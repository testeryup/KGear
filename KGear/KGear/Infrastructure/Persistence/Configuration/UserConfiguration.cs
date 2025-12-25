using KGear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace KGear.Infrastructure.Persistence.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).HasMaxLength(128).IsRequired();
        builder.Property(p => p.HashedPassword).HasMaxLength(128).IsRequired();
        builder.Property(p => p.Email).HasMaxLength(128).IsRequired();
        
    }
}