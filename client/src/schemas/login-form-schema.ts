import { z } from 'zod';

const loginFormSchema = z.object({
    username: z.string(),
    password: z
        .string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt',
        ),
});

export default loginFormSchema;
