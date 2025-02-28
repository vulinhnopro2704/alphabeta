import { signUpSchema } from '@/schemas/sign-up-schema';
import { useForm, FormProvider } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CalendarFormItem from '@/components/form-item/calendar-form-item';
import SelectFormItem from '@/components/form-item/select-form-item';
import InputFormItem from '@/components/form-item/input-form-item';
import { SignupRequest, useSignUpMutation } from '../auth-api-slice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export default function SignUpScreen() {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            fullname: '',
            username: '',
            dateofbirth: new Date(),
            gender: '',
            confirmPassword: '',
            password: '',
        },
    });

    const [signUp] = useSignUpMutation();

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        try {
            console.log(values);
            const body: SignupRequest = {
                email: values.email,
                fullname: values.fullname,
                username: values.username,
                dateofbirth: values.dateofbirth?.toISOString() ?? '',
                gender: values.gender ?? '',
                password: values.password,
                confirmPassword: values.confirmPassword,
            };
            const result = await signUp(body);
            if (result.error) {
                toast.error(('Failed to sign up: ' + result.error) as string);
            } else {
                toast.success('Sign up successfully');
                // Redirect to login page
                navigate('/login');
            }
        } catch (error) {
            toast('Failed to sign up:', {
                style: {
                    background: '#f56565',
                    color: 'white',
                    border: '1px solid #f56565',
                },
                description: error as string,
            });
        }
    }

    const fields = [
        {
            name: 'email',
            label: 'Email',
            description: 'Nhập địa chỉ email của bạn',
            type: 'text',
        },
        {
            name: 'username',
            label: 'Username',
            description: 'Nhập tên đăng nhập của bạn',
            type: 'text',
        },
        {
            name: 'fullname',
            label: 'Họ và tên',
            description: 'Nhập họ và tên của bạn',
            type: 'text',
        },
        {
            name: 'password',
            label: 'Mật khẩu',
            description: 'Nhập mật khẩu của bạn',
            type: 'password',
        },
        {
            name: 'confirmPassword',
            label: 'Xác nhận mật khẩu',
            description: 'Nhập lại mật khẩu của bạn',
            type: 'password',
        },
    ];

    return (
        <div className="flex items-center text-base justify-center xl:w-4/12 md:w-5/12 sm:w-7/12 min-h-screen">
            <motion.div
                className="w-full max-w-md px-4 py-8 space-y-8 bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        {fields.map(({ name, label, description, type }) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={
                                    name as
                                        | 'email'
                                        | 'username'
                                        | 'fullname'
                                        | 'password'
                                        | 'confirmPassword'
                                }
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
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <SelectFormItem
                                        label="Giới tính"
                                        field={field}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateofbirth"
                                render={({ field }) => (
                                    <CalendarFormItem
                                        label="Ngày sinh"
                                        field={field}
                                    />
                                )}
                            />
                        </div>

                        <Button className="w-full">Đăng ký</Button>
                        <Button
                            variant="outline"
                            type="reset"
                            className="w-full"
                        >
                            Nhập lại
                        </Button>
                    </form>
                </FormProvider>
            </motion.div>
        </div>
    );
}
