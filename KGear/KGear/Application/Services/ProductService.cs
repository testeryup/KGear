using KGear.Application.DTOs;
using KGear.Application.Interfaces;
using KGear.Domain.Entities;

namespace KGear.Application.Services;

public class ProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDTO.CreateProductResponse> CreateAsync(ProductDTO.CreateProductRequest request)
    {
        if (await _productRepository.ExistsByNameAsync(request.Name))
        {
            throw new Exception("Sản phẩm đã tồn tại");
        }

        if (request.Price <= 0) throw new Exception("Giá sản phẩm không thể nhỏ hơn 0");
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            CreatedOn =  DateTime.UtcNow,
            ModifiedOn = DateTime.UtcNow,
            IsActive = true
        };
        await _productRepository.AddAsync(product);
        return new ProductDTO.CreateProductResponse(product.Id, product.Name, product.Description, product.Price, product.CreatedOn);
    }
}