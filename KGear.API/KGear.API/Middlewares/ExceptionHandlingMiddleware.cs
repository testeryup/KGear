using KGear.API.Exceptions;

namespace KGear.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Một lỗi không mong đợi đã xảy ra: {Message}", ex.Message);            
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        int statusCode = StatusCodes.Status500InternalServerError;
        string message = "Một lỗi không mong đợi đã xảy ra";

        if (exception is BaseException customException)
        {
            statusCode = customException.StatusCode;
            message = customException.Message;
        }
        else if (exception is FluentValidation.ValidationException valException)
        {
            statusCode = StatusCodes.Status400BadRequest;
            message = valException?.Message ?? "Dữ liệu không hợp lệ";
        }
        context.Response.StatusCode = statusCode;

        var response = new
        {
            errorCode = statusCode,
            error = message,
            detail = exception.InnerException?.Message
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}