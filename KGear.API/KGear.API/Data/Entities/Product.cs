namespace KGear.API.Data.Entities;

public class Product : BaseEntity
{
    public string Name {get; set;} = string.Empty;
    public string? Description {get; set;} = string.Empty;
    public string BrandName {get; set;} = string.Empty;
    // Navigation Property: Để dễ dàng lấy tất cả ảnh liên quan
    public ICollection<ProductMedia> ProductMedias { get; set; } = new List<ProductMedia>();
    public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}