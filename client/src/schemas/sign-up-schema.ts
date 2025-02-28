import { z } from 'zod';

export const signUpSchema = z
    .object({
        email: z.string().email('Địa chỉ email không hợp lệ'),
        password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
                'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt',
            ),
        confirmPassword: z.string(),
        username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
        fullname: z.string().min(3, 'Họ và tên phải có ít nhất 3 ký tự'),
        dateofbirth: z
            .date()
            .max(new Date(), 'Ngày sinh phải là ngày trong quá khứ')
            .min(new Date('1900-01-01'), 'Ngày sinh phải sau ngày 01-01-1900')
            .optional(),
        gender: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu và xác nhận mật khẩu phải trùng khớp',
        path: ['confirmPassword'], // đường dẫn của lỗi
    });
