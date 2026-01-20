namespace KGear.API.Configurations;

public class RedisSettings
{
    public string Endpoint {get; set;} = string.Empty;
    public int Port {get; set;}
    public string User {get; set;} = string.Empty;
    public string Password {get; set;} = string.Empty;
    public string DbName {get; set;} = string.Empty;
}