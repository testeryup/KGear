using CloudinaryDotNet.Actions;
using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.DTOs;

namespace KGear.API.Services;

public class ProductService
{
    private readonly AppDbContext _dbContext;
    private readonly IMediaService _mediaService;

    public ProductService(AppDbContext dbContext, IMediaService mediaService)
    {
        _dbContext = dbContext;
        _mediaService = mediaService;
    }

    public async Task CreateProduct(CreateProductDto createProductDto)
    {
        var uploadTasks = new List<Task<(string SKU, ImageUploadResult Result)>>();
    
        foreach (var variant in createProductDto.Variants)
        {
            foreach (var media in variant.Images)
            {
                // Không cần Task.Run ở đây nếu UploadImage là async
                uploadTasks.Add(_mediaService.UploadImage(media)
                    .ContinueWith(t => (variant.SKU, t.Result)));
            }
        }

        var results = await Task.WhenAll(uploadTasks);
    
        var uploadedPublicIds = results
            .Select(r => r.Result.PublicId)
            .Where(id => !string.IsNullOrEmpty(id))
            .ToList();

        // Kiểm tra nếu có bất kỳ ảnh nào upload lỗi
        if (uploadedPublicIds.Count != uploadTasks.Count)
        {
            // Tái sử dụng hàm mass delete
            await _mediaService.DeleteImages(uploadedPublicIds);
            throw new Exception("One or more images failed to upload. All successful uploads have been rolled back.");
        }
    }
    public async Task CreateProductAsync(CreateProductDto createProductDto)
    {
        var uploadedPublicIds = new List<string>();
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                BrandName = createProductDto.BrandName,
            };
            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            foreach (var productVariant in createProductDto.Variants)
            {
                var newProductVariant = new ProductVariant
                {
                    ProductId = product.Id,
                    SKU = productVariant.SKU,
                    Name = productVariant.Name,
                    Price = productVariant.Price,
                    Stock = productVariant.Stock,
                    // Product = product,
                };
                _dbContext.ProductVariants.Add(newProductVariant);
                await _dbContext.SaveChangesAsync();

                int imageCounter = 1;
                foreach (var media in productVariant.Images)
                {
                    var uploadResult = await _mediaService.UploadImage(media);
                    if (string.IsNullOrEmpty(uploadResult.PublicId))
                    {
                        throw new Exception("Image cannot be uploaded");
                    }
                    uploadedPublicIds.Add(uploadResult.PublicId);
                    var asset = new MediaAsset()
                    {
                        Url = uploadResult.SecureUrl.ToString(),
                        PublicId = uploadResult.PublicId,
                        AltText = $"{product.Name} - {productVariant.Name} - {imageCounter}"
                    };
                    _dbContext.MediaAssets.Add(asset);
                    await _dbContext.SaveChangesAsync();

                    var mapping = new ProductMedia()
                    {
                        ProductId = product.Id,
                        MediaAssetId = asset.Id,
                        ProductVariantId = newProductVariant.Id,
                        IsMain = imageCounter == 1,
                        SortOrder = imageCounter,
                    };
                    _dbContext.ProductMedias.Add(mapping);
                    imageCounter++;
                }
            }
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            foreach (var publicId in uploadedPublicIds)
            {
                await _mediaService.DeleteImage(publicId);
            }

            throw;
        }
    }
}