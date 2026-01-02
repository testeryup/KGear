using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using KGear.API.Configurations;
using Microsoft.Extensions.Options;

namespace KGear.API.Services;

public class CloudinaryService : IMediaService
{
    private readonly Cloudinary _cloudinary;
    private readonly CloudinarySettings _cloudinarySettings;

    public CloudinaryService(IConfiguration configuration, IOptions<CloudinarySettings> cloudinarySettings)
    {
        _cloudinarySettings = cloudinarySettings.Value;
        var acc = new Account(_cloudinarySettings.CloudName, _cloudinarySettings.ApiKey, _cloudinarySettings.ApiSecret);
        _cloudinary = new Cloudinary(acc);
    }
    
    public async Task<ImageUploadResult> UploadImage(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();
        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "kgear_products"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        return uploadResult;
    }

    public async Task<DeletionResult> DeleteImage(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        return await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task DeleteImages(List<string> publicIds)
    {
        var deleteTasks = new List<Task<DeletionResult>>();
        foreach (var publicId in publicIds)
        {
            deleteTasks.Add(Task.Run(() => DeleteImage(publicId)));
        }
        await Task.WhenAll(deleteTasks);
    }
    // public async Task<DeletionResult> DeleteImageAsync(string publicId)
    // {
    //     var deleteParams = new DeletionParams(publicId);
    //     return await _cloudinary.DestroyAsync(deleteParams);
    // }
}