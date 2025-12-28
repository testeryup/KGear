namespace KGear.API.DTOs;

public class AuthDTOs
{
    public record RegisterRequest(string Name, string Email, string Password, string? Address);
    public record RegisterResponse(string Name, string Email);
    
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string AccessToken, string Email);
    
    public record LogoutRequest(string Token);
    public record LogoutResponse(string Token);

    public record RefreshRequest(string AccessToken, string RefreshToken);
    public record RefreshTokenResponse(string AccessToken, string RefreshToken);
}