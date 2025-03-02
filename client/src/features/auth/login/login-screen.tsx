import loginFormSchema from '@/schemas/login-form-schema';
import { useForm, FormProvider } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import InputFormItem from '@/components/form-item/input-form-item';
import { FormField } from '@/components/ui/form';
import { useLoginMutation } from '../auth-api-slice';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            toast.success('Đã đăng nhập');
            navigate('/');
        }
    }, [token, navigate]);
    const [login] = useLoginMutation();
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            const result = await login(values).unwrap();
            if (result.status.toString().startsWith('2')) {
                toast.success('Đăng nhập thành công');
                navigate('/');
            } else {
                toast.error('Đăng nhập thất bại' + result.message);
            }
        } catch (error) {
            toast.error(('Đăng nhập thất bại' + error) as string);
        }
    }

    // Danh sách các trường input
    const fields = [
        {
            name: 'username',
            label: 'Tên đăng nhập',
            description: 'Nhập tên đăng nhập của bạn',
        },
        {
            name: 'password',
            label: 'Mật khẩu',
            description: 'Nhập mật khẩu của bạn',
            type: 'password',
        },
    ];

    return (
        <motion.div
            className="dark:bg-white flex items-center justify-center py-10 px-8 bg-background-dark shadow-2xl text-white rounded-2xl lg:w-1/3 md:w-1/2 w-4/5"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full h-full">
                <FormProvider {...form}>
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <h3 className="text-left text-2xl font-bold">
                            Đăng nhập
                        </h3>
                        {fields.map(({ name, label, description, type }) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name as 'username' | 'password'}
                                render={({ field }) => (
                                    <InputFormItem
                                        field={field}
                                        label={label}
                                        description={description}
                                        type={type}
                                    />
                                )}
                            />
                        ))}
                        <div className="flex justify-between items-center">
                            <div>
                                <input type="checkbox" />
                                <span className="ml-1">Ghi nhớ đăng nhập</span>
                            </div>
                            <Button
                                className="text-btn-blue-dark cursor-pointer"
                                type="button"
                                variant="link"
                            >
                                Quên mật khẩu?
                            </Button>
                        </div>
                        <Button className="bg-blue-700 hover:bg-blue-500 text-center py-1 w-full">
                            Đăng nhập
                        </Button>
                    </form>
                </FormProvider>

                <p className="mt-6">
                    Chưa có tài khoản?{' '}
                    <Link to="/signup">
                        <span className="text-blue-500 font-bold hover:text-blue-400">
                            Đăng ký
                        </span>
                    </Link>{' '}
                </p>
            </div>
        </motion.div>
    );
}
