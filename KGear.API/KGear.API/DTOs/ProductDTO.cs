namespace KGear.API.DTOs;

public class ProductDTO
{
    public record UpdateProductDto(long Id, string Name, string Description, string BrandName);
}