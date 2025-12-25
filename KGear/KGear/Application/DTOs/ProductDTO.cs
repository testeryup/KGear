namespace KGear.Application.DTOs;

public class ProductDTO
{
    public record CreateProductRequest(string Name, string Description, decimal Price, string? ImageUrl);
    public record CreateProductResponse(int Id, string Name,  string Description, decimal Price, DateTime CreatedOn);
    public record UpdateProductRequest(string Name, string Description, decimal Price, string ImageUrl);
    public record UpdateProductResponse(int Id);
    public record DeleteProductRequest(int Id);
    public record DeleteProductResponse(int Id);
}