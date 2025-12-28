using KGear.Application.Interfaces;
using KGear.Domain.Entities;
using KGear.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace KGear.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _appDbContext;
    public UserRepository(AppDbContext dbContext) => _appDbContext = dbContext;
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _appDbContext.Users.FirstOrDefaultAsync(p => p.Email == email);
    }

    public async Task UpdateAsync(User user)
    {
        _appDbContext.Users.Update(user);
        await _appDbContext.SaveChangesAsync();
    }
}