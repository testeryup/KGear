using KGear.API.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KGear.API.Data.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("ProductVariants");
        builder.HasKey(x => x.Id);
        // builder.Property(x => x.Id).IsRequired();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.Property(x => x.SKU).IsRequired().HasMaxLength(150);
        builder.HasIndex(x => x.SKU).IsUnique();
        builder.Property(x => x.Price).IsRequired();
        builder.Property(x => x.Stock).IsRequired();
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.Price).HasDefaultValue(0);
        builder.Property(x => x.Stock).HasDefaultValue(0);
        
        builder.HasOne(x => x.Product)
            .WithMany(p => p.ProductVariants) // Cần thêm ICollection này vào Product entity
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}