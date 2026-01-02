using KGear.API.Data.Entities;

namespace KGear.API.DTOs;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public List<CreateVariantDto> Variants { get; set; } = new();
}