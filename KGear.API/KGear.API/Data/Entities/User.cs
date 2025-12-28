namespace KGear.API.Data.Entities;

public class User : BaseEntity
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; } = string.Empty;
    public string HashedPassword { get; set; } = string.Empty;
    public string? Address { get; set; }
    public UserRole Role { get; set; } = UserRole.Buyer;
    // public DateTime? CreatedOn { get; set; }
    // public DateTime? ModifiedOn { get; set; }
    // public bool IsActive { get; set; }

    // Refresh token
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiresTime { get; set; }
}