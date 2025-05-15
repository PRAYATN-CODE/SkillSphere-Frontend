import AuthLayout from '@/components/AuthLayout';
import { errorToast, successToast } from '@/components/SkillSphereToast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SKILLS_DATA } from '@/config/data';
import authService from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

// Validation schema using Zod
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['seeker', 'employer'], { required_error: 'Please select a role' }),
    skills: z.array(z.string()).optional(),
    company: z.string().optional(),
}).refine((data) => {
    if (data.role === 'seeker') {
        return data.skills && data.skills.length > 0;
    }
    return true;
}, {
    message: 'At least one skill is required for seekers',
    path: ['skills'],
}).refine((data) => {
    if (data.role === 'employer') {
        return data.company && data.company.trim().length > 0;
    }
    return true;
}, {
    message: 'Company name is required for employers',
    path: ['company'],
});

export default function SignupPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'seeker',
            skills: [],
            company: '',
        },
    });

    const role = form.watch('role');
    const skills = form.watch('skills') || [];

    const handleAddSkill = () => {
        if (selectedSkill.trim() && !skills.includes(selectedSkill.trim())) {
            form.setValue('skills', [...skills, selectedSkill.trim()]);
            setSelectedSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        form.setValue('skills', skills.filter((skill) => skill !== skillToRemove));
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                ...(data.role === 'seeker' && { skills: data.skills }),
                ...(data.role === 'employer' && { company: data.company }),
            };
            const result = await authService.register(payload);
            if (result.token) {
                successToast('Your account has been created successfully.');
                localStorage.setItem('token',result.token)
                console.log(result);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error.message || 'An error occurred during registration.');
            errorToast(error.response?.data?.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join SkillSphere"
            subtitle="Create an account to start your job journey"
            linkText="Already have an account?"
            linkUrl="/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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

                        {/* Role */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="seeker">Job Seeker</SelectItem>
                                            <SelectItem value="employer">Employer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Skills (for Seeker) */}
                        {role === 'seeker' && (
                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skills</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={selectedSkill}
                                                        onValueChange={setSelectedSkill}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a skill" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SKILLS_DATA.map((skill) => (
                                                                <SelectItem
                                                                    key={skill}
                                                                    value={skill}
                                                                    disabled={skills.includes(skill)}
                                                                >
                                                                    {skill}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleAddSkill}
                                                        disabled={!selectedSkill}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                                {skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 p-2 border rounded">
                                                        {skills.map((skill, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="cursor-pointer hover:bg-red-100"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                            >
                                                                {skill} &times;
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Company (for Employer) */}
                        {role === 'employer' && (
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="company"
                                                type="text"
                                                placeholder="Tech Corp"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-zinc-900 hover:bg-zinc-800"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </Form>
        </AuthLayout>
    );
}