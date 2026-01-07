using KGear.API.Data.Entities;

namespace KGear.API.DTOs;

public class UpdateProductDto
{
    public long ProductId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string BrandName { get; set; }
    public List<ProductVariant> ProductVariants { get; set; } = new();
}