using KGear.Domain.Common;
using KGear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace KGear.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        
        // Gợi ý: Thêm Global Query Filter cho Soft Delete ở đây nếu cần
        // modelBuilder.Entity<Product>().HasQueryFilter(p => p.IsActive);
    }

    // Override bản đồng bộ
    public override int SaveChanges()
    {
        OnBeforeSaving();
        return base.SaveChanges();
    }

    // Override bản bất đồng bộ
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        OnBeforeSaving();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void OnBeforeSaving()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedOn = utcNow;
                    entry.Entity.ModifiedOn = utcNow;
                    entry.Entity.IsActive = true;
                    break;

                case EntityState.Modified:
                    entry.Entity.ModifiedOn = utcNow;
                    break;

                case EntityState.Deleted:
                    // THỰC HIỆN SOFT DELETE TẠI ĐÂY
                    entry.State = EntityState.Modified; // Chuyển từ Xóa sang Sửa
                    entry.Entity.ModifiedOn = utcNow;
                    entry.Entity.IsActive = false; // Đánh dấu là đã xóa
                    break;
            }
        }
    }
}