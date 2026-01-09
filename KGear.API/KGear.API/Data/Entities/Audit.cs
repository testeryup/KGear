namespace KGear.API.Data.Entities;

public class Audit
{
    public long Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}