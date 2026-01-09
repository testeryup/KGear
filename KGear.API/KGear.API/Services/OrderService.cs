using System.Security.Authentication;
using System.Security.Claims;
using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace KGear.API.Services;

public class OrderService
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public OrderService(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<OrderDTOs.PlaceOrderResponse> PlaceOrderAsync(OrderDTOs.PlaceOrderRequest request)
    {
        var userClaim =  _httpContextAccessor.HttpContext?
            .User?
            .Identity?
            .Name ?? null;
        
        if (userClaim == null)
        {
            throw new AuthenticationException("User not authenticated");
        }
        
        long.TryParse(userClaim,  out long userId);
        
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var requestedItems = request.Items.OrderBy(i => i.VariantId).ToList();
            decimal orderTotal = 0;
            ICollection<OrderItem> orderItems = new List<OrderItem>();
            foreach (var requestedItem in requestedItems)
            {
                int rowAffected = await _dbContext.ProductVariants
                    .Where(v => v.Id == requestedItem.VariantId && v.Stock > requestedItem.Quantity)
                    .ExecuteUpdateAsync(setters => 
                        setters.SetProperty(v => v.Stock,
                            v => v.Stock - requestedItem.Quantity));
                if (rowAffected == 0)
                {
                    throw new OutOfStockException($"Item with Id {requestedItem.VariantId} is out of stock or not exits");
                }
            }

            var order = new Order()
            {
                UserId = userId,
                Status = OrderStatus.Pending,
            };
            foreach (var requestedItem in requestedItems)
            {
                decimal unitPrice = await _dbContext.ProductVariants.AsNoTracking().Where(v => v.Id == requestedItem.VariantId)
                    .Select(v => v.Price).Take(1).SumAsync();
                var orderItem = new OrderItem()
                {
                    Order = order,
                    ProductVariantId = requestedItem.VariantId,
                    UnitPrice = unitPrice,
                };
                orderItems.Add(orderItem);
                orderTotal += unitPrice * requestedItem.Quantity;
            }
            order.TotalAmount = orderTotal;
            order.OrderItems = orderItems;
            
            _dbContext.Orders.Add(order);
            _dbContext.OrderItems.AddRange(orderItems);
            await _dbContext.SaveChangesAsync();

            var audit = new Audit()
            {
                Action = "PLACE_ORDER",
                Details = $"User placed {order.Id} success"
            };
            _dbContext.Audits.Add(audit);
            await _dbContext.SaveChangesAsync();
            
            await transaction.CommitAsync();
            
            return new OrderDTOs.PlaceOrderResponse(true, DateTime.UtcNow, "Order Placed successfully");
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return new OrderDTOs.PlaceOrderResponse(false, DateTime.UtcNow, "Order Failed");
        }
    }
}