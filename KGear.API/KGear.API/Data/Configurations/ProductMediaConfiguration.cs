using KGear.API.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KGear.API.Data.Configurations;

public class ProductMediaConfiguration : IEntityTypeConfiguration<ProductMedia>
{
    public void Configure(EntityTypeBuilder<ProductMedia> builder)
    {
        builder.ToTable("ProductMedias");
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Product)
            .WithMany(p => p.ProductMedias)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.ProductVariant)
            .WithMany(v => v.VariantMedias)
            .HasForeignKey(x => x.ProductVariantId)
            .OnDelete(DeleteBehavior.SetNull); // Xóa SKU thì ảnh vẫn thuộc về Product

        builder.HasOne(x => x.MediaAsset)
            .WithMany() // Một ảnh có thể xuất hiện trong nhiều dòng ProductMedia
            .HasForeignKey(x => x.MediaAssetId)
            .OnDelete(DeleteBehavior.Restrict); // Không xóa ảnh vật lý khi xóa link
    }
}