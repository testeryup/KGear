using KGear.Domain.Entities;

namespace KGear.Application.Interfaces;

public interface IUserRepository
{
    public Task<User?> GetByEmailAsync(string email);
    public Task UpdateAsync(User user);
}