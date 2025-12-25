namespace KGear.Extensions;

public static class CorsExtensions
{
    private const string DefaultPolicyName = "DefaultCorsPolicy";
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        services.AddCors(options =>
        {
            options.AddPolicy(name: DefaultPolicyName,
                policy => 
                    policy
                        .WithOrigins(allowedOrigins!)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
            );
        });
        return services;
    }
    public static string PolicyName =>  DefaultPolicyName;
}