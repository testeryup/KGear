using FluentAssertions;
using KGear.API.Data.Entities;
using KGear.API.DTOs;
using KGear.API.Services;
using Microsoft.EntityFrameworkCore;

namespace KGear.Tests.Intergrations;

public class OrderTestPlace : OrderTestBase
{
    private readonly OrderService _service;
    public OrderTestPlace()
    {
        _service = new OrderService(dbContext: DbContext);
    }

    [Fact]
    public async Task PlaceOrder_ValidRequest_ShouldCreateOrderAndAudit()
    {
        var user = new User() {Id = 1, Name = "TestUser"};
        var product = new Product() {Id = 1, Name = "TestProduct"};
        var variant = new ProductVariant { Id = 1, Price = 100M, Stock = 10, SKU = "SKU01", Name = "Test", Product = product};
        DbContext.Products.Add(product);
        await DbContext.SaveChangesAsync();
        DbContext.Users.Add(user);
        DbContext.ProductVariants.Add(variant);
        await DbContext.SaveChangesAsync();
        
        var request = new OrderDTOs.PlaceOrderRequest(
            Items: new List<Item> { new Item(1, 2) }, // Mua 2 cái
            Address: "HCM", City: "HCM", State: "VN", Phone: "0123", ZipCode: "70000"
        );
        
        var result = await _service.PlaceOrderAsync(request, userId: 1);
        result.Success.Should().BeTrue();
        
        await DbContext.Entry(variant).ReloadAsync();
        var updatedVariant = await DbContext.ProductVariants.FindAsync(variant.Id);
        updatedVariant!.Stock.Should().Be(8);
        
        var order = await DbContext.Orders.FindAsync(result.OrderId!.Value);
        order.Should().NotBeNull();
        order.TotalAmount.Should().Be(200M);
        order.Status.Should().Be(OrderStatus.Pending);

        var audit = await DbContext.Audits.AnyAsync(a => a.Action == "PLACE_ORDER");
        audit.Should().BeTrue();
    }
    
    [Fact]
    public async Task PlaceOrder_OutOfStock_ShouldRollBack()
    {
        var product = new Product() {Id = 1, Name = "TestProduct"};
        var variant = new ProductVariant { Id = 1, Price = 100, Stock = 1, SKU = "SKU01", Name = "Test", Product = product, ProductId = 1};
        DbContext.ProductVariants.Add(variant);
        await DbContext.SaveChangesAsync();
        
        var request = new OrderDTOs.PlaceOrderRequest(
            Items: new List<Item> { new Item(1, 2) }, // Mua 2 cái
            Address: "HCM", City: "HCM", State: "VN", Phone: "0123", ZipCode: "70000"
        );
        
        var result = await _service.PlaceOrderAsync(request, userId: 1);
        result.Success.Should().BeFalse();
        
        var updatedVariant = await DbContext.ProductVariants.FindAsync(1L);
        updatedVariant!.Stock.Should().Be(1);
        
        var order = await DbContext.Orders.CountAsync();
        order.Should().Be(0);

        var audit = await DbContext.Audits.CountAsync();
        audit.Should().Be(0);
    }
}