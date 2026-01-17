namespace KGear.API.DTOs;

public class UpdateVariantDto
{
    // public long Id { get; set; }
    public string SKU {get; set;} = string.Empty;
    public string Name {get; set;} = string.Empty;
    public decimal Price {get; set;}
    public int Stock {get; set;}
    // public List<IFormFile> Images { get; set; } = new();
}