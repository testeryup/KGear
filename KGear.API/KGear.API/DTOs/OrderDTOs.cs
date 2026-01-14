using KGear.API.Data.Entities;

namespace KGear.API.DTOs;
public record Item(long VariantId, int Quantity);
public class VariantInfo
{
    public long VariantId { get; set; }
    public decimal UnitPrice  { get; set; }
    public int Quantity { get; set; }
    public string? Thumbnail { get; set; }
    public string? VariantName  {get; set;}
    public string? ProductName {get; set;}
    public long ProductId {get; set;}
}

public record OrderBrief(long Id, string Status, decimal TotalAmount, DateTime CreatedOn);
public class OrderDTOs
{
    public record PlaceOrderRequest(
        string Address, 
        string State, 
        string City, 
        string Phone, 
        string ZipCode,
        List<Item> Items);
    public record AddToCartRequest(long VariantId, int Quantity);
    public record PlaceOrderResponse(bool Success, DateTime CreatedOn, string Message, long? OrderId);
    public record AddToCartResponse(bool Success, DateTime CreatedOn, string Message);
    
    public record OrdersListRequest(long? LastId, DateTime CreatedOn, int PageSize = 10);
    public record OrdersListResponse(
        bool Success, 
        long? NextOrder, 
        bool HasMore, 
        ICollection<OrderBrief> OrderBriefs
        );
    public record OrderDetailResponse(
        long Id,
        long UserId,
        DateTime CreatedOn,
        OrderStatus Status,
        decimal Total,
        IEnumerable<VariantInfo> Variants
    );
}