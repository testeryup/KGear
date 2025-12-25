using KGear.Application.DTOs;
using KGear.Application.Interfaces;
using KGear.Domain.Entities;
using KGear.Domain.Enums;

namespace KGear.Application.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDTO.RegisterResponse> RegisterAsync(UserDTO.RegisterRequest request)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email))
        {
            throw new Exception($"User with email {request.Email} already exists");
        }
        
        User user = new User
        {
            Name = request.Name,
            Email = request.Email,
            HashedPassword = request.Password, // problem may occur
            Address = request.Address,
            Role = UserRole.Admin,
            IsActive = true,
            CreatedOn = DateTime.UtcNow,
            ModifiedOn = DateTime.UtcNow
        };

        await _userRepository.RegisterAsync(user);
        return new UserDTO.RegisterResponse(user.Name, user.Email);
    }

    // public async Task<UserDTO.LoginResponse> LoginAsync(UserDTO.LoginRequest request)
    // {
    //     if (!await _userRepository.ExistsByEmailAsync(request.Email))
    //     {
    //         throw new Exception("User not found");
    //     }
    //     
    // }
}