import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/config/axios';
import { Loader } from 'lucide-react'; // Import loader icon
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('/api/jobs/all'); // Update this endpoint if needed
                setJobs(res.data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="space-y-6 px-4 sm:px-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Available Job Openings</CardTitle>
                    <CardDescription>Browse and apply to the latest job opportunities.</CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader className="animate-spin text-blue-600 h-6 w-6" />
                        </div>
                    ) : jobs.length === 0 ? (
                        <p className="text-gray-500 text-sm">No jobs available right now.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {jobs.map((job) => (
                                <Card key={job._id} className="border rounded-xl shadow-sm p-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-primary">{job.title}</h3>
                                        <p className="text-sm text-muted-foreground">{job.company}</p>
                                        <p className="text-sm text-gray-600">{job.location}</p>
                                        <p className="text-sm text-gray-500">{job.salary || 'Salary not disclosed'}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <CardFooter className="pt-4">
                                        <Button
                                            onClick={() => navigate('/applications', { state: { jobId: job._id } })}
                                            className="w-full"
                                        >
                                            Apply
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Jobs;
