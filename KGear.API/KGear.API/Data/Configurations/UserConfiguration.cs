using KGear.API.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KGear.API.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(150);
        builder.HasIndex(x => x.Email).IsUnique();
        
        builder.Property(x => x.HashedPassword)
            .IsRequired()
            .HasMaxLength(255);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.RefreshToken).HasMaxLength(500);
        builder.Property(x => x.RefreshTokenExpiresTime).HasColumnType("datetime2");
        builder.Property(x => x.CreatedOn).IsRequired().HasColumnType("datetime2");
        builder.Property(x => x.ModifiedOn).HasColumnType("datetime2");
        builder.Property(x => x.IsActive).HasDefaultValue(true);
    }
}