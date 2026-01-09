namespace KGear.API.Exceptions;

public abstract class BaseException : Exception
{
    public int StatusCode { get; }

    protected BaseException(string message, int statusCode) : base(message)
    {
        StatusCode = statusCode;
    }
}

public class BadRequestException : BaseException
{
    public BadRequestException(string message) : base(message, StatusCodes.Status400BadRequest) {}
}

public class NotFoundException : BaseException
{
    public NotFoundException(string message) : base(message, StatusCodes.Status404NotFound) {}
}

public class UnauthorizedAppException : BaseException
{
    public UnauthorizedAppException(string message) : base(message, StatusCodes.Status401Unauthorized) { }
}

public class UploadException : BaseException
{
    public UploadException(string message) : base(message, StatusCodes.Status422UnprocessableEntity) { }
}

public class OutOfStockException : BaseException
{
    public OutOfStockException(string message) : base(message, StatusCodes.Status422UnprocessableEntity) { }
}
