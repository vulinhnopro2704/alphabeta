import loginFormSchema from '@/schemas/login-form-schema';
import { useForm, FormProvider, Form } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AnimatedButton from '@/components/animated-button';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import SmoothButton from '@/components/smooth-button';

export default function LoginScreen() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

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
                    <Form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Fill your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Fill your username
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Fill your password
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center">
                            <AnimatedButton> Đăng nhập </AnimatedButton>
                            <button
                                className="pb-10 text-btn-blue-dark cursor-pointer"
                                type="button"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </Form>
                </FormProvider>
                <div className="flex flex-col text-base gap-3">
                    <SmoothButton className="w-full">
                        <div className="flex  text-base items-center justify-center gap-2">
                            <FaGoogle size={18} />
                            Đăng nhập với Google
                        </div>
                    </SmoothButton>
                    <SmoothButton className="w-full">
                        <div className="flex text-base items-center justify-center gap-2">
                            <FaFacebook size={18} />
                            Login via facebook
                        </div>
                    </SmoothButton>
                </div>
            </div>
        </motion.div>
    );
}
