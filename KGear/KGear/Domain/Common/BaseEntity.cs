namespace KGear.Domain.Common;

public abstract class BaseEntity
{
    public DateTime CreatedOn {get; set;}
    public DateTime ModifiedOn {get; set;}
    public bool IsActive { get; set; } = true;
}