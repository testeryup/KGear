using KGear.Domain.Common;

namespace KGear.Domain.Entities;

public class Product : BaseEntity
{
    public int Id {get; set;}
    public string Name {get; set;}
    public string? Description {get; set;}
    public decimal Price {get; set;}
    // public DateTime CreatedOn {get; set;}
    // public DateTime ModifiedOn {get; set;}
    // public bool IsActive {get; set;}
    public string? ImageUrl {get; set;}
}