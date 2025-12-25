namespace KGear.Application.DTOs;

public class UserDTO
{
    public record RegisterRequest(string Name, string Email, string Password, string? Address);
    public record RegisterResponse(string Name, string Email);
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string Email, string Password);
}