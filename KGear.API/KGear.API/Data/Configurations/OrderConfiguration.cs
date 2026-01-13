using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KGear.API.Data.Entities;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        // Primary Key (Thường kế thừa từ BaseEntity)
        builder.HasKey(o => o.Id);

        // Cấu hình tiền tệ: bắt buộc phải có HasPrecision để tránh mất phần thập phân
        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // Lưu Enum dưới dạng String trong DB (thay vì số 0, 1, 2...)
        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Các ràng buộc độ dài chuỗi
        builder.Property(o => o.Address).IsRequired().HasMaxLength(255);
        builder.Property(o => o.City).HasMaxLength(100);
        builder.Property(o => o.Phone).IsRequired().HasMaxLength(15);
        builder.Property(o => o.ZipCode).HasMaxLength(10);

        // Quan hệ 1-N: User -> Orders
        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict); // Tránh xóa User là mất sạch Order (tùy nghiệp vụ)
    }
}