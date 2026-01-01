using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FluentValidation;
using KGear.API.Configurations;
using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KGear.API.Services;

public class AuthService
{
    private readonly JwtSettings _jwtSettings;
    private readonly AppDbContext _dbContext;
    private readonly TokenService _tokenService;
    private readonly IValidator<AuthDTOs.RegisterRequest> _registerRequestValidator;
    public AuthService(
        IOptions<JwtSettings> jwtOptions,  
        AppDbContext dbContext, 
        TokenService tokenService, 
        IValidator<AuthDTOs.RegisterRequest> registerRequestValidator
        )
    {
        _jwtSettings = jwtOptions.Value;
        _dbContext = dbContext;
        _tokenService = tokenService;
        _registerRequestValidator = registerRequestValidator;
    }


    public async Task<(string AccessToken, string RefreshToken)> RefreshTokenAsync(string expiredAccessToken, string refreshToken)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(expiredAccessToken);
        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }
        var user = await GetUserByEmailAsync(email);
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiresTime < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid refresh attempt");
        
        var accessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
        await _dbContext.SaveChangesAsync();
        
        return (accessToken, newRefreshToken);
    }


    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == email);
    }
    public async Task UpdateAsync(User user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<(AuthDTOs.LoginResponse, string refreshToken)> LoginAsync(AuthDTOs.LoginRequest request)
    {
        var user = await GetUserByEmailAsync(request.Email);
        if (user == null || user.IsActive == false|| !BCrypt.Net.BCrypt.Verify(request.Password, user.HashedPassword))
        {
            throw new NotFoundException("Unauthorized");
        }

        var refreshToken = _tokenService.GenerateRefreshToken();
        var accessToken = _tokenService.GenerateAccessToken(user);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
        await _dbContext.SaveChangesAsync();
        return (new AuthDTOs.LoginResponse(accessToken, user.Email), refreshToken);
    }

    public async Task<AuthDTOs.RegisterResponse> RegisterAsync(AuthDTOs.RegisterRequest request)
    {
        var validator =  await _registerRequestValidator.ValidateAsync(request);
        if (!validator.IsValid)
        {
            throw new BadRequestException(validator.Errors.First().ErrorMessage);
        }


        if (await _dbContext.Users.AnyAsync(x => x.Email == request.Email))
        {
            throw new UnauthorizedAppException("Email đã tồn tại");
        }
        var refreshToken = _tokenService.GenerateRefreshToken();
        var newUser = new User()
        {
            Name = request.Name,
            Email = request.Email,
            HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Address = request.Address,
            Role = UserRole.Buyer,
            RefreshToken = refreshToken,
            RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };
        //
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();
        
        return new AuthDTOs.RegisterResponse(
            Name: request.Name, 
            Email: request.Email, 
            Status: "success"
        );
    }
}