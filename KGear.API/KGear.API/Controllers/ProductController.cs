using KGear.API.DTOs;
using KGear.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace KGear.API.Controllers;
[ApiController]
[Route("/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;
    public  ProductController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateNewProductAsync([FromForm] CreateProductDto dto)
    {
        // await _productService.CreateProductAsync(dto);
        await _productService.CreateProduct(dto);
        return Ok(new {success = true});
    }
}