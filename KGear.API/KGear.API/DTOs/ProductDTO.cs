using System.Net.Mime;

namespace KGear.API.DTOs;

public class Media
{
    public IFormFile? Image;
    public bool IsMain = false;
    public int SortOrder;
}

public class ProductInfo
{
    public long Id { get; set; }
    public string Name {get; set;} = string.Empty;
    public string? Description {get; set;} = string.Empty;
    public string BrandName {get; set;} = string.Empty;
    public string? ThumbnailLink {get; set;}
}
public class ProductDTO
{
    public record UpdateProductDto(long Id, string Name, string Description, string BrandName);
    public record UpdateProductImageDto(List<Media> Medias);

    public record CursorRequest(long? LastId, int PageSize = 10);
    public record CursorResponse(
        bool Status, 
        List<ProductInfo> Items,
        long? NextCursor,
        bool HasMore
    );
}