using System.Runtime.CompilerServices;
using CloudinaryDotNet.Actions;
using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

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
        var uploadTasks = createProductDto.Variants.SelectMany(
            v => v.Images.Select(async img =>
            {
                var res = await _mediaService.UploadImage(img);
                return (SKU: v.SKU, Result: res);
            })
        ).ToList();
        var results = await Task.WhenAll(uploadTasks);
        var uploadedPublicIds = results.Select(r => r.Result.PublicId)
            .Where(id => !string.IsNullOrEmpty(id)).ToList();

        // 1. Kiểm tra lỗi Upload và dọn dẹp ngay lập tức
        if (uploadedPublicIds.Count != uploadTasks.Count)
        {
            await _mediaService.DeleteImages(uploadedPublicIds);
            throw new UploadException("Upload failed. Cleanup triggered.");
        }

        var dictResults = results.GroupBy(result => result.SKU)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Result).ToList());
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var product = new Product {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                BrandName = createProductDto.BrandName
            };

            foreach (var variantDto in createProductDto.Variants)
            {
                var variant = new ProductVariant {
                    SKU = variantDto.SKU,
                    Name = variantDto.Name,
                    Price = variantDto.Price,
                    Stock = variantDto.Stock,
                    Product = product // Dùng Navigation Property thay vì ProductId
                };

                int imageCounter = 1;
                foreach (var imgRes in dictResults[variantDto.SKU])
                {
                    var asset = new MediaAsset {
                        Url = imgRes.Url.ToString(),
                        PublicId = imgRes.PublicId,
                        AltText = $"{product.Name} - {variant.SKU}"
                    };

                    var mapping = new ProductMedia {
                        Product = product,      // Navigation Property
                        ProductVariant = variant, // Navigation Property
                        MediaAsset = asset,     // Navigation Property
                        IsMain = imageCounter == 1,
                        SortOrder = imageCounter
                    };
                    _dbContext.ProductMedias.Add(mapping);
                    imageCounter++;
                }
            }

            // EF Core sẽ tự tính toán thứ tự: Product -> Variant -> Asset -> Mapping
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            await _mediaService.DeleteImages(uploadedPublicIds);
            throw;
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
    public async Task UpdateProduct(UpdateProductDto updateDto)
    {
        var product = await _dbContext.Products
            .Include(p => p.ProductVariants)
            .ThenInclude(v => v.VariantMedias)
            .ThenInclude(m => m.MediaAsset)
            .FirstOrDefaultAsync(p => p.Id == updateDto.ProductId)
            ?? throw new BadRequestException($"Product does not exist");

        var oldPublicIdsToDelete = new List<string>();
        
        var variantIdsInDto = updateDto.ProductVariants
            .Where(v => v.ProductId == product.Id)
            .Select(v => v.Id)
            .ToHashSet();
        var variantsToDelete = product
            .ProductVariants.Where(v => !variantIdsInDto.Contains(v.Id))
            // .Select(v => v.Id)
            .ToList();
        foreach (var productVariant in variantsToDelete)
        {
            var pIds = productVariant.VariantMedias
                .Select(v => v.MediaAsset.PublicId)
                .ToHashSet();
            
        }

    }

    public async Task UpdateProductInfo(ProductDTO.UpdateProductDto productDto)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productDto.Id)
            ?? throw new BadRequestException($"Product does not exist");
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.BrandName = productDto.BrandName;
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw new BadRequestException(e.Message);
        }
    }

    public async Task UpdateVariantInfo(UpdateVariantDto updateVariantDto)
    {
        var variant = await _dbContext.ProductVariants.FirstOrDefaultAsync(v => v.Id == updateVariantDto.Id)
            ?? throw new BadRequestException($"Variant does not exist");
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            variant.Name = updateVariantDto.Name;
            variant.Price = updateVariantDto.Price;
            variant.Stock = updateVariantDto.Stock;
            variant.SKU = updateVariantDto.SKU;
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw new BadRequestException(e.Message);
        }
    }

    public async Task DeactiveProduct(long id)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id) 
                      ?? throw new BadRequestException($"Product does not exist");
        product.IsActive = false;
        
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeactiveVariant(long id)
    {
        var variant = await _dbContext.ProductVariants.FirstOrDefaultAsync(v => v.Id == id)
            ?? throw new BadRequestException($"Variant does not exist");
        variant.IsActive = false;
        await _dbContext.SaveChangesAsync();
    }
    
    
}