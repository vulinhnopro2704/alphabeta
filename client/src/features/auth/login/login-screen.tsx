import loginFormSchema from '@/schemas/login-form-schema';
import { useForm, FormProvider } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/animated-button';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import SmoothButton from '@/components/smooth-button';
import InputFormItem from '@/components/form-item/input-form-item';
import { FormField } from '@/components/ui/form';
import { useLoginMutation } from '../auth-api-slice';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';

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
            className="flex items-center justify-center py-10 px-8 bg-background-dark shadow-2xl text-white rounded-2xl w-3/12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full h-full">
                <FormProvider {...form}>
                    <h3 className="text-center text-3xl font-bold">
                        Đăng nhập
                    </h3>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
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
                            <AnimatedButton> Đăng nhập </AnimatedButton>
                            <button
                                className="pb-10 text-btn-blue-dark cursor-pointer"
                                type="button"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </form>
                </FormProvider>
                <Link to="/signup" className="text-center text-btn-blue-dark">
                    Đăng ký tài khoản mới
                </Link>
                {/* Đăng nhập bằng Google/Facebook */}
                <div className="flex flex-col text-base gap-3">
                    {[
                        { icon: FaGoogle, text: 'Đăng nhập với Google' },
                        { icon: FaFacebook, text: 'Login via Facebook' },
                    ].map(({ icon: Icon, text }) => (
                        <SmoothButton key={text} className="w-full">
                            <div className="flex text-base items-center justify-center gap-2">
                                <Icon size={18} /> {text}
                            </div>
                        </SmoothButton>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
