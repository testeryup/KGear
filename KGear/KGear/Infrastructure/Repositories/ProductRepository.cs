using KGear.Application.Interfaces;
using KGear.Domain.Entities;
using KGear.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using KGear.Infrastructure.Persistence.AppDbContext;

namespace KGear.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext dbContext)
    {
        _context = dbContext;
    }
    public async Task AddAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsByNameAsync(string name)
        => await _context.Products.AnyAsync(p => p.Name == name);

    public async Task<Product?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }
}