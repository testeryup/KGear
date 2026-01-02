using CloudinaryDotNet.Actions;

namespace KGear.API.Services;

public interface IMediaService
{
    Task<ImageUploadResult> UploadImage(IFormFile file);
    Task<DeletionResult> DeleteImage(string publicId);
    Task DeleteImages(List<string> publicIds);
}