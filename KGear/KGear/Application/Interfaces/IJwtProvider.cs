using System.Security.Claims;
using KGear.Domain.Entities;

namespace KGear.Application.Interfaces;
public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}