import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    BookOpen, Code, Cpu, Database, Globe,
    Lightbulb,
    Lock,
    Shield, Sparkles, Users
} from "lucide-react"

export default function AboutPage() {
    
    const teamMembers = [
        {
            name: "Aman Mishra",
            role: "Founder & Visionary",
            bio: "On a mission to bridge the gap between skills and opportunities.",
            avatar: "https://github.com/mayadsouza.png"
        },
    ]

    const features = [
        {
            icon: <Cpu className="h-6 w-6" />,
            title: "AI-Driven Skill Matching",
            description: "Smartly pairs learners with curated courses and mentors."
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Global Course Catalog",
            description: "Access 5,000+ courses across tech, design, and business."
        },
        {
            icon: <Lock className="h-6 w-6" />,
            title: "Secure Learning Space",
            description: "User privacy and data security are our top priorities."
        },
        {
            icon: <Database className="h-6 w-6" />,
            title: "Progress Analytics",
            description: "Track your learning journey and skill growth in real-time."
        },
        {
            icon: <Code className="h-6 w-6" />,
            title: "Hands-on Practice Labs",
            description: "Apply your skills with interactive coding environments."
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Verified Certification",
            description: "Earn shareable credentials that employers trust."
        }
    ]

    return (
        <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900">
            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <Badge variant="outline" className="mb-4 bg-zinc-100 text-zinc-900">
                    About SkillSphere
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Empowering the Future Through Skills
                </h1>
                <p className="mt-6 text-xl text-zinc-600 max-w-3xl mx-auto">
                    SkillSphere connects ambitious learners with tailored educational paths, mentors, and job-ready skills.
                </p>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Card className="border-zinc-200 bg-zinc-100">
                    <CardHeader>
                        <CardTitle className="text-3xl">Our Mission</CardTitle>
                        <CardDescription className="text-lg">
                            To make skill development accessible, personalized, and outcome-driven for everyone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Why We Started
                            </h3>
                            <p className="text-zinc-700">
                                Many learners feel lost navigating endless courses. We created SkillSphere to provide clarity—helping users identify their goals and chart a path that works for them, backed by AI guidance and expert mentorship.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Our Approach
                            </h3>
                            <p className="text-zinc-700">
                                We're combining data-driven personalization, community mentorship, and verified credentials to offer an experience that doesn’t just teach—but transforms careers.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Features */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">What Sets Us Apart</h2>
                    <p className="mt-2 text-zinc-600">Learn smarter, grow faster</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-zinc-200">
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-zinc-100 text-zinc-900 mb-4">
                                    {feature.icon}
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-zinc-100 rounded-xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Meet the People Behind SkillSphere</h2>
                    <p className="mt-2 text-zinc-600">A passionate team committed to educational impact</p>
                </div>

                <div className="grid gap-8">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="border-zinc-200 text-center">
                            <CardContent className="pt-6">
                                <Avatar className="mx-auto h-24 w-24 mb-4">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle>{member.name}</CardTitle>
                                <Badge variant="outline" className="mt-2 bg-zinc-200">
                                    {member.role}
                                </Badge>
                                <p className="mt-4 text-zinc-600">{member.bio}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Card className="border-zinc-200">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Our Core Values</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-zinc-100 text-zinc-900 mb-4">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Trust & Transparency</h3>
                            <p className="text-zinc-600 mt-2">
                                We ensure your learning data is secure and transparently used.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-zinc-100 text-zinc-900 mb-4">
                                <Lightbulb className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Curiosity</h3>
                            <p className="text-zinc-600 mt-2">
                                We foster a culture of lifelong learning and creativity.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-zinc-100 text-zinc-900 mb-4">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Community</h3>
                            <p className="text-zinc-600 mt-2">
                                Learning is better together—our platform thrives on collaboration.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Start Your Skill Journey with Us</h2>
                <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
                    Discover, learn, and grow with SkillSphere—your companion for future-ready skills.
                </p>
            </section>

            <Separator className="my-1 bg-zinc-200" />

            <footer className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-zinc-600">
                <p>© 2025 SkillSphere. All rights reserved.</p>
            </footer>
        </div>
    )
}
