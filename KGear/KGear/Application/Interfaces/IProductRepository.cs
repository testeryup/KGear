using KGear.Domain.Entities;

namespace KGear.Application.Interfaces;

public interface IProductRepository
{
    Task AddAsync(Product product);
    Task<bool> ExistsByNameAsync(string name);
    Task<Product?> GetByIdAsync(int id);
}