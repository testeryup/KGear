namespace KGear.API.Data.Entities;

public class ProductMedia : BaseEntity
{
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Nullable: Nếu có ID -> Ảnh này dành riêng cho SKU. 
    // Nếu NULL -> Ảnh này là ảnh chung của cả Product (Ảnh vỏ hộp, ảnh marketing)
    public long? ProductVariantId { get; set; } 
    public ProductVariant? ProductVariant { get; set; }

    public long MediaAssetId { get; set; }
    public MediaAsset MediaAsset { get; set; } = null!;

    public bool IsMain { get; set; } // Dùng để đánh dấu ảnh đại diện cho SKU hoặc Product
    public int SortOrder { get; set; } // Thứ tự hiển thị trong Gallery
}