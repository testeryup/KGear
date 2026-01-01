namespace KGear.API.Data.Entities;

public class ProductVariant : BaseEntity
{
    public string SKU {get; set;} = string.Empty;
    public decimal Price {get; set;}
    public int Stock {get; set;}
    public string Name {get; set;} = string.Empty;
    
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    // Navigation Property cho ảnh riêng của SKU
    public ICollection<ProductMedia> VariantMedias { get; set; } = new List<ProductMedia>();
}