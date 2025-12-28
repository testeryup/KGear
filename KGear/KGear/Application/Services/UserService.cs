using System.Security.Claims;
using KGear.Application.DTOs;
using KGear.Application.Interfaces;
using KGear.Domain.Entities;
using KGear.Domain.Enums;

namespace KGear.Application.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtProvider _jwtProvider;
    
    public UserService(IUserRepository userRepository,  IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
    }

    public async Task<UserDTO.LoginResponse> AuthenticateAsync(UserDTO.LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        
        if (user == null || user.IsActive == false || user.HashedPassword != request.Password)
        {
            throw new Exception($"Unauthorized");
        }
        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(7);
        
        return new UserDTO.LoginResponse(accessToken, refreshToken, user.Email);
    }

    public async Task<UserDTO.LoginResponse> RefreshTokenAsync(UserDTO.RefreshRequest request)
    {
        var principal = _jwtProvider.GetPrincipalFromExpiredToken(request.AccessToken);
        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            throw new Exception("Invalid token");
        }
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiresTime < DateTime.UtcNow)
            throw new Exception("Invalid refresh attempt");
        
        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(7);
        await _userRepository.UpdateAsync(user);
        return new UserDTO.LoginResponse(accessToken, refreshToken, user.Email);
    }
}