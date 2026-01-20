using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Exceptions;
using KGear.API.Services;
using KGear.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KGear.API.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly RedisService _redisService;

    public OrderController(OrderService orderService, RedisService redisService)
    {
        _orderService = orderService;
        _redisService = redisService;
    }
    
    [HttpPost("order")]
    public async Task<IActionResult> PlaceOrderAsync([FromBody] OrderDTOs.PlaceOrderRequest request)
    {
        var userId = User.GetUserId();
        if (userId == -1)
        {
            return BadRequest();
        }
        var result = await _orderService.PlaceOrderAsync(request, userId);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpGet("test")]
    public async Task<string> TestAsync([FromQuery] string value)
    {
        var userId = User.GetUserId();
        Console.WriteLine(userId);
        _redisService.Run();
        return userId.ToString();
    }
    
    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderDetailAsync(long orderId)
    {
        var userRole = User.GetUserRole() ;
        if (string.IsNullOrEmpty(userRole))
        {
            throw new UnauthorizedAppException("Không có Role!");
        }
        var userId = User.GetUserId();

        var result = await _orderService.GetOrderDetail(userId, orderId, userRole);
        return Ok(result);
    }
}