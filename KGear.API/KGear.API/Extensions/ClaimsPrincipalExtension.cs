using System.Security.Claims;

namespace KGear.Extensions;

public static class ClaimsPrincipalExtension
{
    public static long GetUserId(this ClaimsPrincipal principal)
    {
        var claim =  principal.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? long.Parse(claim.Value) : 0;
    }
    public static string GetUserRole(this ClaimsPrincipal principal)
    {
        var claim =  principal.FindFirst(ClaimTypes.Role);
        return claim != null ? claim.Value : string.Empty;
    }
}