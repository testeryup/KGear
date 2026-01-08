using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Exceptions;

namespace KGear.API.Services;

public class OrderService
{
    private readonly AppDbContext _dbContext;
    public OrderService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<OrderDTOs.MakeOrderResponse> MakeOrderAsync(OrderDTOs.MakeOrderRequest request)
    {
        var variants = new HashSet<ProductVariant>();
        using var transaction = _dbContext.Database.BeginTransaction();
        try
        {
            foreach (var item in request.Items)
            {
                var orderVariant = _dbContext.ProductVariants.FirstOrDefault(v => v.Id == item.VariantId)
                              ?? throw new BadRequestException($"Variant with id {item.VariantId} does not exist");
                if (orderVariant.Stock < item.Quantity)
                {
                    throw new BadRequestException($"Variant with id {item.VariantId} does not have enough stock");
                }
                
                if (variants.Any(v => v.Id == item.VariantId))
                {
                    throw new BadRequestException($"Không thể mua hàng khi mà variant {item.VariantId} bị trùng");
                }
                orderVariant.Stock -= item.Quantity;
                variants.Add(orderVariant);
            }
            
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
        return new OrderDTOs.MakeOrderResponse(Success: true,
            CreatedAt: DateTime.UtcNow,
            Message: "Order Created");
    }
}