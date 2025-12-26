// KGear/Infrastructure/Persistence/Configurations/ProductConfiguration.cs
using KGear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KGear.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.Description)
            .HasMaxLength(1000);

        builder.Property(p => p.Price)
            .HasPrecision(18, 2); // Quan trọng cho tiền tệ

        builder.Property(p => p.ImageUrl)
            .HasMaxLength(500);

        // Cấu hình các trường từ BaseEntity
        builder.Property(p => p.CreatedOn).IsRequired();
        builder.Property(p => p.ModifiedOn).IsRequired();
        builder.Property(p => p.IsActive).HasDefaultValue(true);
    }
}