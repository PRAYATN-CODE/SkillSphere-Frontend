import { errorToast, successToast } from '@/components/SkillSphereToast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/config/axios';
import { useState } from 'react';

const JobApplicationsList = ({ profileLoading, user, isLoading, error, applications, employerApplications, navigate, fetchApplications, fetchEmployerApplications }) => {
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleViewJob = (job) => {
        console.log('Opening job modal for:', job);
        setSelectedJob(job);
        setIsJobModalOpen(true);
    };

    const handleRecruit = (application) => {
        setSelectedApplication(selectedApplication === application._id ? null : application._id);
        setMessage('');
    };

    const handleRecruitSubmit = async (application) => {
        if (!message.trim()) {
            errorToast('Message is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(
                '/api/messages',
                {
                    receiverId: application.seekerId?._id,
                    jobId: application.jobId?._id,
                    message: message.trim()
                },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            if (!response.data) {
                throw new Error('No response data received');
            }

            successToast('Message sent successfully!');
            setSelectedApplication(null);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            errorToast(error?.response?.data?.message || error.message || 'Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profileLoading && user?.role !== 'seeker' && user?.role !== 'employer') {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-red-500">This page is only available for job seekers and employers</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="mt-4"
                        style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                    >
                        Go to Home
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-red-500">{error}</p>
                    <Button
                        variant="outline"
                        onClick={user?.role === 'seeker' ? fetchApplications : fetchEmployerApplications}
                        className="mt-4"
                        style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Retry'}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Employer-specific view
    if (user?.role === 'employer') {
        if (employerApplications.length === 0) {
            return (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-500">No applications received for your job postings yet.</p>
                        <Button
                            onClick={() => navigate('/jobs/create')}
                            className="mt-4"
                            style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                        >
                            Create Job Posting
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-6 px-4 sm:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Applications Received</CardTitle>
                        <CardDescription>
                            View all applications for your job postings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {employerApplications.map((application) => (
                                <Card key={application._id} className="border rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-primary">
                                            {application.jobId?.title || 'Untitled Job'}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="font-medium">Applicant:</span> {application.seekerId?.name || 'Unknown'}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Email:</span> {application.seekerId?.email || 'Not provided'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Applied on:{' '}
                                            <span className="font-medium">
                                                {new Date(application.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${application.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : application.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRecruit(application)}
                                                >
                                                    {selectedApplication === application._id ? 'Cancel' : 'Recruit'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                                                >
                                                    View Resume
                                                </Button>
                                            </div>
                                        </div>

                                        {selectedApplication === application._id && (
                                            <div className="mt-4 space-y-2">
                                                <Label htmlFor={`message-${application._id}`} className="block text-sm font-medium text-gray-700">
                                                    Message to Applicant
                                                </Label>
                                                <Textarea
                                                    id={`message-${application._id}`}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e7eeb] focus:ring-[#1e7eeb]"
                                                    placeholder="Let's discuss your application..."
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedApplication(null);
                                                            setMessage('');
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                                                        onClick={() => handleRecruitSubmit(application)}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {employerApplications.length} application{employerApplications.length !== 1 ? 's' : ''}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Create New Job
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Seeker-specific view
    if (applications.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-gray-500">You haven't submitted any applications yet.</p>
                    <Button
                        onClick={() => navigate('/jobs')}
                        className="mt-4"
                        style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                    >
                        Browse Jobs
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 px-4 sm:px-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Job Applications</CardTitle>
                    <CardDescription>
                        View the status of all your submitted job applications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {applications.map((application) => (
                            <Card key={application._id} className="border rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-primary">
                                        {application.jobId?.title || 'Untitled Job'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {application.jobId?.company || 'Unknown Company'}
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        Applied on:{' '}
                                        <span className="font-medium">
                                            {new Date(application.appliedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${application.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : application.status === 'accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewJob(application.jobId)}
                                        >
                                            View Job
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/jobs')}
                    >
                        Browse More Jobs
                    </Button>
                </CardFooter>
            </Card>

            {/* Job Details Modal */}
            {selectedJob && (
                <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>{selectedJob.title || 'Untitled Job'}</DialogTitle>
                            <DialogDescription>
                                {selectedJob.company || 'Unknown Company'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">Job Details</h4>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Location:</span> {selectedJob.location || 'Not specified'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Salary:</span> {selectedJob.salary || 'Not specified'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Type:</span> {selectedJob.type || 'Not specified'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Posted on:</span>{' '}
                                    {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'Not specified'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm text-gray-500">
                                    {selectedJob.description || 'No description provided'}
                                </p>
                            </div>
                            {selectedJob.requirements && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Requirements</h4>
                                    <p className="text-sm text-gray-500">
                                        {selectedJob.requirements || 'No requirements specified'}
                                    </p>
                                </div>
                            )}
                            {selectedJob.benefits && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Benefits</h4>
                                    <p className="text-sm text-gray-500">
                                        {selectedJob.benefits || 'No benefits specified'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setIsJobModalOpen(false)}
                                style={{ backgroundColor: '#1e7eeb', color: 'white' }}
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default JobApplicationsList;