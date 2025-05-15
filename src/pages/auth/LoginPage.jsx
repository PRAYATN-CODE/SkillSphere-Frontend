import AuthLayout from '@/components/AuthLayout';
import { successToast } from '@/components/SkillSphereToast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import authService from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (formData) => {
        console.log('Form submitted:', formData);
        setLoading(true);
        try {
            const response = await authService.login(formData);
            console.log('API response:', response);

            // Save token to localStorage
            localStorage.setItem('token', response.token);

            const user = response.user;

            successToast('Login successful!');

            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            errorToast(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your email and password to sign in to your account"
            linkText="Don't have an account?"
            linkUrl="/signup"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="email">Email</Label>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="password">Password</Label>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800" disabled={loading}>
                        {loading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Sign in'}
                    </Button>
                </form>
            </Form>
        </AuthLayout>
    );
}