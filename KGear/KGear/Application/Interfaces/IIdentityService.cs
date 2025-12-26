using KGear.Application.DTOs;

namespace KGear.Application.Interfaces;

public interface IIdentityService
{
    Task<UserDTO.LoginResponse> AuthenticateAsync(UserDTO.LoginRequest request);
    Task<UserDTO.LoginResponse> RefreshTokenAsync(string expiredToken, string refreshToken);
}