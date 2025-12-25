using KGear.Domain.Enums;

namespace KGear.Domain.Entities;

public class User
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string HashedPassword { get; set; }
    public string? Address { get; set; }
    public UserRole Role { get; set; }
    public DateTime? CreatedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public bool IsActive { get; set; }
}