namespace KGear.API.Data.Entities;

public class BaseEntity
{
    public long  Id { get; set; }
    public DateTime CreatedOn {get; set;}
    public DateTime ModifiedOn {get; set;}
    public bool IsActive { get; set; } = true; 
}