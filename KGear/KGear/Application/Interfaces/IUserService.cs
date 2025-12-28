using KGear.Application.DTOs;
using KGear.Domain.Entities;

namespace KGear.Application.Interfaces;

public interface IUserService
{
    // Task RegisterAsync(User user);
    Task<User> GetByEmailAsync(string email);
    // Task LoginAsync(string email, string password);

    Task UpdateAsync(User user);
}