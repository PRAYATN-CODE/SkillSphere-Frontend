import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, ChevronRight, FileText, MessageSquare, Search, Send, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
                        Connect with <span className="text-[#1e7eeb]">Opportunities</span> That Match Your Skills
                    </h1>
                    <p className="mt-6 text-xl text-zinc-600 max-w-3xl mx-auto">
                        SkillSphere bridges the gap between talented job seekers and forward-thinking employers with AI-powered matching.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-[#1e7eeb] hover:bg-[#1a6fd4]"
                            asChild
                        >
                            <Link to="/signup">
                                Get Started <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link to="/jobs">
                                Browse Jobs
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                        Why Choose SkillSphere?
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600 max-w-3xl mx-auto">
                        A seamless hiring experience powered by modern technology
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card
                            key={feature.name}
                            className="hover:shadow-lg transition-shadow border-[#1e7eeb]/10 hover:border-[#1e7eeb]/20"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#1e7eeb]/10 text-[#1e7eeb] mb-4">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{feature.name}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-zinc-100 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                            How SkillSphere Works
                        </h2>
                        <p className="mt-4 text-lg text-zinc-600 max-w-3xl mx-auto">
                            Three simple steps to your next career opportunity
                        </p>
                    </div>

                    <div className="mt-16">
                        <Tabs defaultValue="seekers" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-zinc-200">
                                <TabsTrigger
                                    value="seekers"
                                    className="data-[state=active]:bg-[#1e7eeb] data-[state=active]:text-white"
                                >
                                    For Job Seekers
                                </TabsTrigger>
                                <TabsTrigger
                                    value="employers"
                                    className="data-[state=active]:bg-[#1e7eeb] data-[state=active]:text-white"
                                >
                                    For Employers
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="seekers">
                                <div className="space-y-4">
                                    {seekerSteps.map((step, index) => (
                                        <Card key={index} className="border-[#1e7eeb]/10">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e7eeb] text-white font-medium">
                                                        {index + 1}
                                                    </span>
                                                    {step.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-zinc-600">{step.description}</p>
                                                {step.icon && <step.icon className="mt-4 text-[#1e7eeb] w-6 h-6" />}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="employers">
                                <div className="space-y-4">
                                    {employerSteps.map((step, index) => (
                                        <Card key={index} className="border-[#1e7eeb]/10">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e7eeb] text-white font-medium">
                                                        {index + 1}
                                                    </span>
                                                    {step.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-zinc-600">{step.description}</p>
                                                {step.icon && <step.icon className="mt-4 text-[#1e7eeb] w-6 h-6" />}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                        Trusted by Thousands
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600 max-w-3xl mx-auto">
                        What our users say about SkillSphere
                    </p>
                </div>
                <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#1e7eeb]"></div>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#1e7eeb]/10 flex items-center justify-center">
                                        <User className="text-[#1e7eeb] w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle>{testimonial.name}</CardTitle>
                                        <CardDescription>{testimonial.role}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-600 italic">"{testimonial.quote}"</p>
                                <div className="mt-4 flex text-[#1e7eeb]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : ''}`}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-[#1e7eeb] rounded-2xl px-6 py-16 sm:p-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to transform your career or hiring process?
                    </h2>
                    <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                        Join thousands of professionals and companies finding their perfect match.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-[#1e7eeb] hover:bg-zinc-100"
                            asChild
                        >
                            <Link to="/signup?role=seeker">
                                I'm a Job Seeker
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white text-[#1e7eeb] hover:bg-zinc-100"
                            asChild
                        >
                            <Link to="/signup?role=employer">
                                I'm an Employer
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

const features = [
    {
        name: "Smart Job Matching",
        description: "Our AI matches your skills with the most relevant job openings automatically.",
        icon: Search,
    },
    {
        name: "Direct Applications",
        description: "Apply with one click and track all your applications in one place.",
        icon: Send,
    },
    {
        name: "Secure Messaging",
        description: "Communicate directly with employers in a protected environment.",
        icon: MessageSquare,
    },
];

const seekerSteps = [
    {
        title: "Create Your Profile",
        description: "Highlight your skills, experience, and career preferences to attract the right employers.",
        icon: User
    },
    {
        title: "Browse & Apply",
        description: "Find jobs that match your profile and submit applications with your resume and cover letter.",
        icon: FileText
    },
    {
        title: "Track & Communicate",
        description: "Monitor application statuses and message employers directly through our platform.",
        icon: MessageSquare
    }
];

const employerSteps = [
    {
        title: "Post Jobs",
        description: "List your openings with detailed requirements and let our system find qualified candidates.",
        icon: Briefcase
    },
    {
        title: "Review Applications",
        description: "View candidate profiles, resumes, and cover letters in a streamlined dashboard.",
        icon: FileText
    },
    {
        title: "Hire Efficiently",
        description: "Send offers and communicate with top candidates without leaving SkillSphere.",
        icon: Send
    }
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Frontend Developer",
        quote: "Found my dream job in 2 weeks thanks to SkillSphere's matching algorithm!",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "HR Director",
        quote: "Reduced our hiring time by 40% while improving candidate quality.",
        rating: 4
    },
    {
        name: "David Rodriguez",
        role: "Fullstack Engineer",
        quote: "The application tracking system saved me hours of follow-up emails.",
        rating: 5
    }
];