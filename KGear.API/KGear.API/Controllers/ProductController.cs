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

    [HttpPut("{productId}/info")]
    public async Task<IActionResult> UpdateProductInfoAsync(long productId, [FromForm] UpdateProductDto dto)
    {
        await _productService.UpdateProductInfo(productId, dto);
        return Ok(new { success = true });
    }

    [HttpPut("{productId}/variants/{variantId}")] // Thêm productId vào route để check chéo
    public async Task<IActionResult> UpdateProductVariantAsync(long productId, long variantId, [FromForm] UpdateVariantDto dto)
    {
        await _productService.UpdateVariantInfo(productId, variantId, dto);
        return Ok(new { success = true });
    }

    [HttpDelete("{productId}/variants/{variantId}")]
    public async Task<IActionResult> DeleteProductVariantAsync(long productId, long variantId)
    {
        await _productService.DeactiveVariant(productId, variantId);
        return Ok(new { success = true });
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> DeleteProductAsync(long productId)
    {
        await _productService.DeactiveProduct(productId);
        return Ok(new { success = true });
    }

    [HttpGet]
    public async Task<IActionResult> GetProductAsync(ProductDTO.CursorRequest dto)
    {
        var result = await _productService.GetProductsAsync(dto);
        return Ok(result);
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetProductAsync(long productId)
    {
        return Ok();
    }
}