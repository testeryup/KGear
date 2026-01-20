using KGear.API.Configurations;
using Microsoft.Extensions.Options;

namespace KGear.API.Services;
using StackExchange.Redis;

public class RedisService
{
    private readonly IDatabase _db;

    public RedisService(IConnectionMultiplexer muxer)
    {
        _db = muxer.GetDatabase();
    }
    public async Task SetValueAsync(string key, string value, TimeSpan? expiry = null)
    {
        await _db.StringSetAsync(key, value, expiry);
    }

    public async Task<string?> GetValueAsync(string key)
    {
        var result = await _db.StringGetAsync(key);
        return result.HasValue ? result.ToString() : null;
    }
    public void Run()
    {
        Console.WriteLine("redis values:");
        RedisValue result = _db.StringGet("foo");
        Console.WriteLine(result); // >>> bar
    }
}