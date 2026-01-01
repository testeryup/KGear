using KGear.API.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KGear.API.Data.Configurations;

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> builder)
    {
        builder.ToTable("MediaAssets");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Url).IsRequired().HasMaxLength(500);
        builder.Property(x => x.PublicId).IsRequired().HasMaxLength(255);
        builder.HasIndex(x => x.PublicId).IsUnique(); // Tránh trùng lặp file vật lý
    }
}