namespace KGear.API.Data.Entities;

public class Order : BaseEntity
{
    public long UserId { get; set; }
    public User? User { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string ZipCode { get; set; } = "";
    public string Phone { get; set; } = "";
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}