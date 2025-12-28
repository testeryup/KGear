namespace KGear.API.Data.Entities;

public class BaseEntity
{
    public DateTime CreatedOn {get; set;}
    public DateTime ModifiedOn {get; set;}
    public bool IsActive { get; set; } = true; 
}