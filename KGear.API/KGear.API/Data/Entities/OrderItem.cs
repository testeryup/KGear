namespace KGear.API.Data.Entities;

public class OrderItem : BaseEntity
{
    public long ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    public long OrderId { get; set; }
    public Order? Order { get; set; }
    public decimal UnitPrice { get; set; } 
}