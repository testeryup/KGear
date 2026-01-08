namespace KGear.API.DTOs;
public record Item(long VariantId, int Quantity);

public class OrderDTOs
{
    public record MakeOrderRequest(List<Item> Items);
    public record AddToCartRequest(long VariantId, int Quantity);
    public record MakeOrderResponse(bool Success, DateTime CreatedAt, string Message);
    public record AddToCartResponse(bool Success, DateTime CreatedAt, string Message);
}