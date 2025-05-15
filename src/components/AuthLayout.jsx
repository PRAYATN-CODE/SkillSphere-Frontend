import { Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';

export default function AuthLayout({ children, title, subtitle, linkText, linkUrl }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <AnimatedBackground />
            <div className="w-full max-w-md z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>
                    <p className="mt-2 text-zinc-600">{subtitle}</p>
                </div>

                {children}

                <div className="mt-6 text-center text-sm text-zinc-600">
                    {linkText}{' '}
                    <Link to={linkUrl} className="font-medium text-zinc-900 hover:text-zinc-700">
                        {linkUrl === "/signup" ? 'Sign up' : 'Log in'}
                    </Link>
                </div>
            </div>
        </div>
    );
}