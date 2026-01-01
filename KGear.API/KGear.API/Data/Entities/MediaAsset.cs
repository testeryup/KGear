namespace KGear.API.Data.Entities;

public class MediaAsset : BaseEntity
{
    // public long Id { get; set; }
    public string Url {get; set;} = string.Empty;
    public string PublicId {get; set;} = string.Empty;
    public string? AltText {get; set;} = string.Empty;
}