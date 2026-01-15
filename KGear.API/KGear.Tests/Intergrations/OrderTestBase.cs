using System.Data.Common;
using KGear.API.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace KGear.Tests;

public class OrderTestBase : IDisposable
{
    protected readonly AppDbContext DbContext;
    private readonly DbConnection _connection;

    protected OrderTestBase()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;
        DbContext =  new AppDbContext(options);
        DbContext.Database.EnsureCreated();
    }
    public void Dispose()
    {_connection.Dispose();}
}