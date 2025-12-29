using KGear.API.Configurations;
using KGear.API.DTOs;
using KGear.API.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace KGear.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly AuthService _authService;
    private readonly JwtSettings _jwtSettings;
    public AuthController(ILogger<AuthController> logger,  AuthService authService,  IOptions<JwtSettings> jwtOptions)
    {
        _logger = logger;
        _authService = authService;
        _jwtSettings = jwtOptions.Value;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthDTOs.LoginRequest loginRequest)
    {
        var (authResponse, newRefreshToken) = await _authService.LoginAsync(loginRequest);
        SetRefreshTokenCookie(newRefreshToken);
        return Ok(new {accessToken = authResponse.AccessToken, email = authResponse.Email});
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string accessToken)
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("No refresh token provided");
        }
        
        var (newAccessToken, newRefreshToken) = await _authService.RefreshTokenAsync(accessToken, refreshToken);
        SetRefreshTokenCookie(newRefreshToken);
        return Ok(new {accessToken = newAccessToken});
    }

    private void SetRefreshTokenCookie(string newRefreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };
        Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthDTOs.RegisterRequest registerRequest)
    {
        return Ok(await _authService.RegisterAsync(registerRequest));
    }
}