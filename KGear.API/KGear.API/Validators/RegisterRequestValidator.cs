using FluentValidation;
using KGear.API.DTOs;

namespace KGear.API.Validators;

public class RegisterRequestValidator : AbstractValidator<AuthDTOs.RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").WithMessage("Định dạng Email không hợp lệ");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống")
            .MinimumLength(8).WithMessage("Mật khẩu phải từ 8 ký tự")
            .MaximumLength(30).WithMessage("Mật khẩu không quá 30 ký tự");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên không được để trống");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Địa chỉ không được để trống");
    }
}