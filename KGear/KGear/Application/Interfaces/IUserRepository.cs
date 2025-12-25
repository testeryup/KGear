using KGear.Domain.Entities;

namespace KGear.Application.Interfaces;

public interface IUserRepository
{
    Task RegisterAsync(User user);
    Task<bool> ExistsByEmailAsync(string email);
    Task LoginAsync(string email, string password);
}