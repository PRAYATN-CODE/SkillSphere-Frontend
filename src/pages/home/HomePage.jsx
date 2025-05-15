import { errorToast, successToast } from "@/components/SkillSphereToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from '@/config/axios';
import { SKILLS_DATA } from "@/config/data";
import { fetchUserProfile } from "@/redux/slice/userSlice";
import { Briefcase, Loader2, Search } from "lucide-react";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const dispatch = useDispatch()
    const { user, loading: profileLoading, error } = useSelector((state) => state.user);
    const [searchQuery, setSearchQuery] = useState({ skills: [], location: '' });
    const [jobForm, setJobForm] = useState({
        title: '',
        description: '',
        skills: [],
        location: '',
        salary: '',
    });
    const [skillInput, setSkillInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (user && error) {
            errorToast(error);
        }
        console.log(user, profileLoading)
    }, [user, error]);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());

        }
        if (error) {
            console.log("Error fetching user profile:", error);
        }
    }, [dispatch, user]);

    const handleAddSearchSkill = (skill) => {
        if (!searchQuery.skills.includes(skill)) {
            setSearchQuery({
                ...searchQuery,
                skills: [...searchQuery.skills, skill]
            });
        }
    };

    const handleRemoveSearchSkill = (skillToRemove) => {
        setSearchQuery({
            ...searchQuery,
            skills: searchQuery.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!jobForm.skills.includes(skillInput.trim())) {
                setJobForm({
                    ...jobForm,
                    skills: [...jobForm.skills, skillInput.trim()],
                });
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setJobForm({
            ...jobForm,
            skills: jobForm.skills.filter((skill) => skill !== skillToRemove),
        });
    };

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            setSearchPerformed(true);
            const params = new URLSearchParams();
            if (searchQuery.skills.length > 0) {
                params.append('skills', searchQuery.skills.join(','));
            }
            if (searchQuery.location) {
                params.append('location', searchQuery.location);
            }

            const response = await axios.get('/api/jobs', { params });
            setJobs(response.data);
            successToast(`Found ${response.data.length} jobs matching your criteria`);
        } catch (error) {
            console.error('Error searching jobs:', error);
            errorToast('Failed to search jobs. Please try again.');
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostJob = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/jobs', {
                title: jobForm.title,
                description: jobForm.description,
                skills: jobForm.skills,
                location: jobForm.location,
                salary: jobForm.salary
            }, {
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });

            successToast('Job posted successfully!');
            setJobForm({
                title: '',
                description: '',
                skills: [],
                location: '',
                salary: '',
            });
        } catch (error) {
            console.error('Error posting job:', error);
            errorToast(error.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-12 w-12 animate-spin text-[#1e7eeb]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50">
                <Card className="border-[#1e7eeb]/20">
                    <CardHeader>
                        <CardTitle className="text-[#1e7eeb]">Authentication Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please sign in to access this page.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-fit bg-zinc-50 text-zinc-900">
            {/* Hero Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        {user?.role === 'seeker' ? 'Find Your Dream Job with SkillSphere' : 'Hire Top Talent with SkillSphere'}
                    </h1>
                    <p className="mt-6 text-lg text-zinc-600 max-w-3xl mx-auto">
                        {user?.role === 'seeker'
                            ? 'Connect with top employers and explore thousands of job opportunities tailored to your skills.'
                            : 'Post jobs and connect with skilled professionals instantly.'}
                    </p>
                </div>
            </section>

            {/* Main Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {user?.role === 'seeker' ? (
                    <>
                        {/* Seeker: Job Search */}
                        <Card className="border-[#1e7eeb]/20 mb-8">
                            <CardHeader>
                                <CardTitle className="text-[#1e7eeb]">Search Jobs</CardTitle>
                                <CardDescription>Find jobs that match your skills and preferred location.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="skills">Skills</Label>
                                        <div className="flex gap-2">
                                            <Select
                                                onValueChange={(value) => handleAddSearchSkill(value)}
                                                value=""
                                            >
                                                <SelectTrigger className="border-[#1e7eeb]/30">
                                                    <SelectValue placeholder="Select a skill" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SKILLS_DATA.filter(skill => !searchQuery.skills.includes(skill)).map((skill) => (
                                                        <SelectItem key={skill} value={skill}>
                                                            {skill}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {searchQuery.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 p-2 border border-[#1e7eeb]/20 rounded">
                                                {searchQuery.skills.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:bg-[#1e7eeb]/10 text-[#1e7eeb] border-[#1e7eeb]/30"
                                                        onClick={() => handleRemoveSearchSkill(skill)}
                                                    >
                                                        {skill} &times;
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g., Remote, New York"
                                            value={searchQuery.location}
                                            onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                                            className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    onClick={handleSearch}
                                    className="bg-[#1e7eeb] hover:bg-[#1a6fd4]"
                                    disabled={isLoading || (searchQuery.skills.length === 0 && !searchQuery.location)}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="mr-2 h-4 w-4" />
                                    )}
                                    {isLoading ? 'Searching...' : 'Search Jobs'}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Job Results */}
                        {searchPerformed && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-[#1e7eeb]">Job Results</h2>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-[#1e7eeb]" />
                                    </div>
                                ) : jobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {jobs.map((job) => (
                                            <Card key={job._id} className="border-[#1e7eeb]/20 hover:border-[#1e7eeb]/40 transition-colors">
                                                <CardHeader>
                                                    <CardTitle>{job.title}</CardTitle>
                                                    <div className="flex gap-2 items-center text-sm text-zinc-600">
                                                        <span>{job.location}</span>
                                                        {job.salary && <span>• {job.salary}</span>}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-zinc-700 mb-4">{job.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.skills.map((skill, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-[#1e7eeb] border-[#1e7eeb]/30"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-end">
                                                    <Button
                                                        onClick={() => navigate('/applications', { state: { jobId: job._id } })}
                                                        className="bg-[#1e7eeb] hover:bg-[#1a6fd4]"
                                                    >
                                                        Apply Now
                                                    </Button>

                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="border-[#1e7eeb]/20">
                                        <CardHeader>
                                            <CardTitle>No jobs found</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Try adjusting your search criteria.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </>
                ) : user?.role === 'employer' ? (
                    /* Employer: Job Posting Form */
                    <Card className="border-[#1e7eeb]/20" id="post-job">
                        <CardHeader>
                            <CardTitle className="text-[#1e7eeb]">Post a New Job</CardTitle>
                            <CardDescription>Attract top talent by posting a job opportunity.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Frontend Developer"
                                        value={jobForm.title}
                                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                        className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the job requirements..."
                                        value={jobForm.description}
                                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                        className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">Skills</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            onValueChange={(value) => {
                                                if (!jobForm.skills.includes(value)) {
                                                    setJobForm({
                                                        ...jobForm,
                                                        skills: [...jobForm.skills, value]
                                                    });
                                                }
                                            }}
                                            value=""
                                        >
                                            <SelectTrigger className="border-[#1e7eeb]/30">
                                                <SelectValue placeholder="Select a skill" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SKILLS_DATA.filter(skill => !jobForm.skills.includes(skill)).map((skill) => (
                                                    <SelectItem key={skill} value={skill}>
                                                        {skill}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Or type a skill and press Enter"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleAddSkill}
                                            className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                        />
                                    </div>
                                    {jobForm.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-2 border border-[#1e7eeb]/20 rounded">
                                            {jobForm.skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-[#1e7eeb]/10 text-[#1e7eeb] border-[#1e7eeb]/30"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                >
                                                    {skill} &times;
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Remote, New York"
                                        value={jobForm.location}
                                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                        className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input
                                        id="salary"
                                        placeholder="e.g., $80k-$100k"
                                        value={jobForm.salary}
                                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                                        className="border-[#1e7eeb]/30 focus:border-[#1e7eeb]/50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                onClick={handlePostJob}
                                disabled={!jobForm.title.trim() || !jobForm.description.trim() || isLoading}
                                className="bg-[#1e7eeb] hover:bg-[#1a6fd4]"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Briefcase className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? 'Posting...' : 'Post Job'}
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="border-[#1e7eeb]/20">
                        <CardHeader>
                            <CardTitle className="text-[#1e7eeb]">Unauthorized Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Your account doesn't have the required permissions to view this page.</p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
}