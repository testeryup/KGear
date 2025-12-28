using KGear.Application.DTOs;
using KGear.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KGear.Presentation.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;
    public AuthController(IIdentityService identityService) => _identityService = identityService;

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserDTO.LoginRequest request)
    {
        return Ok(await _identityService.AuthenticateAsync(request));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(UserDTO.RefreshRequest request)
    {
        return Ok(await _identityService.RefreshTokenAsync(request));
    }
}