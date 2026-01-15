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
    public OrderService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<OrderDTOs.PlaceOrderResponse> PlaceOrderAsync(OrderDTOs.PlaceOrderRequest request, long userId)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var requestedItems = request.Items.OrderBy(i => i.VariantId).ToList();
            var variantIds = requestedItems.Select(i => i.VariantId).ToHashSet();
            
            var variantData = await _dbContext.ProductVariants.AsNoTracking()
                .Where(v => variantIds.Contains(v.Id))
                .ToDictionaryAsync(v => v.Id, v => v.Price);

            decimal orderTotal = 0;
            ICollection<OrderItem> orderItems = new List<OrderItem>();

            var order = new Order()
            {
                UserId = userId,
                Status = OrderStatus.Pending,
                Address = request.Address,
                City = request.City,
                State = request.State,
                Phone = request.Phone,
                ZipCode =  request.ZipCode
            };
            foreach (var requestedItem in requestedItems)
            {
                int rowAffected = await _dbContext.ProductVariants
                    .Where(v => v.Id == requestedItem.VariantId && v.Stock >= requestedItem.Quantity)
                    .ExecuteUpdateAsync(setters =>
                        setters.SetProperty(v => v.Stock,
                            v => v.Stock - requestedItem.Quantity));
                if (rowAffected == 0)
                    throw new OutOfStockException($"Sản phẩm (ID: {requestedItem.VariantId}) không đủ hàng.");
                if (!variantData.TryGetValue(requestedItem.VariantId, out decimal unitPrice))
                    throw new KeyNotFoundException("Không tìm thấy thông tin giá của sản phẩm.");
                orderItems.Add(new OrderItem
                {
                    Order = order,
                    ProductVariantId = requestedItem.VariantId,
                    UnitPrice = unitPrice,
                    Quantity = requestedItem.Quantity,
                });
                orderTotal += unitPrice * requestedItem.Quantity;
            }

            order.TotalAmount = orderTotal;
            order.OrderItems = orderItems;

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            _dbContext.Audits.Add(new Audit()
            {
                Action = "PLACE_ORDER",
                Details = $"User placed {order.Id} success"
            });
            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
            return new OrderDTOs.PlaceOrderResponse(true, DateTime.UtcNow, "Đặt hàng thành công", order.Id);
        }
        catch (OutOfStockException ex)
        {
            await transaction.RollbackAsync();
            return new OrderDTOs.PlaceOrderResponse(false, DateTime.UtcNow, ex.Message, null);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return new OrderDTOs.PlaceOrderResponse(false, DateTime.UtcNow, "Lỗi hệ thống", null);
        }
    }

    public async Task<OrderDTOs.OrdersListResponse> ViewAllOrderListAsync(OrderDTOs.OrdersListRequest rq)
    {
        const int maxPageSize = 50;
        int pageSize = Math.Min(rq.PageSize, maxPageSize);
        var query = _dbContext.Orders.AsQueryable();
        if (rq.LastId.HasValue)
        {
            query = query.Where(o => o.Id > rq.LastId.Value);
        }

        var orders = await query
            .OrderBy(o => o.Id)
            .Take(pageSize + 1)
            .Select(o => new OrderBrief(o.Id,
                o.Status.ToString(),
                o.TotalAmount,
                o.CreatedOn)
            ).ToListAsync();
        long? nextCursor = null;
        bool hasMore = orders.Count > pageSize;
        if (hasMore)
        {
            orders.RemoveAt(pageSize);
            nextCursor = orders[pageSize - 1].Id;
        }
        return new OrderDTOs.OrdersListResponse(
            true, 
            nextCursor, 
            hasMore, 
            orders
        );
    }
    // for normal user / customer
    public async Task<OrderDTOs.OrdersListResponse> ViewUserOrdersAsync(OrderDTOs.OrdersListRequest rq, long userId)
    {
        const int maxPageSize = 50;
        int pageSize = Math.Max(rq.PageSize, maxPageSize);
        
        var query = _dbContext.Orders.AsQueryable()
            .Where(o => o.UserId == userId);

        if (rq.LastId.HasValue)
        {
            query = query.Where(o => o.Id > rq.LastId.Value);
        }

        var orders = await query
            .OrderBy(o => o.Id)
            .Take(pageSize + 1)
            .Select(o => new OrderBrief(
                o.Id,
                o.Status.ToString(),
                o.TotalAmount,
                o.CreatedOn
            )).ToListAsync<OrderBrief>();

        long? lastId = null;
        bool hasMore = orders.Count > pageSize;
        if (hasMore)
        {
            orders.RemoveAt(pageSize);
            lastId = orders.Last().Id;
        }

        return new OrderDTOs.OrdersListResponse(
            true,
            lastId,
            hasMore,
            orders);
    }

    public async Task<OrderDTOs.OrderDetailResponse> GetOrderDetail(long userId, long orderId, string userRole)
    {
        var query = _dbContext.Orders.AsSplitQuery();
        if (userRole != "Admin")
        {
            query = query.Where(o => o.UserId == userId);
        }
        
        var orderDetail = await query
            .Where(o => o.Id == orderId)
            .Select(o => new
            {
                Id = o.Id,
                UserId = o.UserId,
                CreatedOn = o.CreatedOn,
                Status = o.Status,
                ZipCode = o.ZipCode,
                Address = o.Address,
                City = o.City,
                State = o.State,
                Phone = o.Phone,
                Total = o.TotalAmount,
                Variants = o.OrderItems.Select(i => new VariantInfo
                {
                    VariantId = i.ProductVariantId,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    Thumbnail = i.ProductVariant!.VariantMedias
                        .Where(v => v.SortOrder == 1)
                        .Select(m => m.MediaAsset.Url)
                        .FirstOrDefault(),
                    VariantName = i.ProductVariant.Name,
                    ProductName = i.ProductVariant.Product.Name,
                    ProductId = i.ProductVariant.Product.Id,
                })
            }).AsSplitQuery().FirstOrDefaultAsync();

        if (orderDetail == null)
        {
            return null;
        }
        return new OrderDTOs.OrderDetailResponse(
            orderDetail.Id,
            orderDetail.UserId,
            orderDetail.CreatedOn,
            orderDetail.Status,
            orderDetail.Total,
            orderDetail.Variants
        );
         
    }
}