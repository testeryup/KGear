using KGear.Application.DTOs;
using KGear.Application.Services;
using KGear.Domain.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace KGear.Presentation.Controllers;
[ApiController]
[Route("[controller]")]
public class ProductController :  ControllerBase
{
    private readonly ProductService _productService;
    public ProductController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<ActionResult<ProductDTO.CreateProductResponse>> Create(ProductDTO.CreateProductRequest request)
    {
        var result = await _productService.CreateAsync(request);
        return Ok(result);
    }
}