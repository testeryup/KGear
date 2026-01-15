using KGear.API.Data;
using KGear.API.Data.Entities;
using KGear.API.Services;
using Microsoft.EntityFrameworkCore;

namespace KGear.Tests;

public class OrderTest
{
    [Fact]
    public async Task GetOrderDetailAsync_WhenUserIsNotOwner_ShouldReturnNull()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new AppDbContext(options);
        var orderId = 100;
        var ownerId = 1;
        var hackerId = 3;

        context.Orders.Add(new Order() { Id = orderId, UserId = ownerId });
        await context.SaveChangesAsync();
        var service = new OrderService(context);
        
        var result = await service.GetOrderDetail(hackerId, orderId, nameof(UserRole.Buyer));
        
        Assert.Null(result);
    }

    [Fact]
    public async Task PlaceOrderAsync_WhenValidRequest_ShouldReturnTrue()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new AppDbContext(options);
        
    }
}