import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import axios from '@/config/axios';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SeekerMessageBoard = () => {
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);

    const { user, loading } = useSelector((state) => state.user);
    const token = localStorage.getItem('token');     // JWT
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            if (!token) throw new Error('Authentication required');

            setLoadingApps(true);
            setError(null);

            const response = await axios.get('/api/jobs/my-applications', {
                headers: { Authorization: `${token}` },
                timeout: 10000,
            });

            setApplications(response.data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to fetch applications';
            setError(msg);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoadingApps(false);
        }
    };

    const fetchMessages = async (jobId) => {
        try {
            if (!user?._id) return;

            setLoadingMessages(true);
            setMessages([]);
            const receiverId = user._id;

            const res = await axios.get(`/api/messages/seeker/${receiverId}/${jobId}`, {
                headers: { Authorization: `${token}` },
            });

            setMessages(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleJobClick = (jobId, applicationId) => {
        const selectedApp = applications.find(app => app._id === applicationId);
        setSelectedApplication(selectedApp);
        setSelectedJobId(applicationId);
        fetchMessages(jobId);
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            pending: {
                icon: ClockIcon,
                variant: "outline",
                className: "text-yellow-600 border-yellow-400 bg-yellow-50"
            },
            accepted: {
                icon: CheckCircleIcon,
                variant: "outline",
                className: "text-green-600 border-green-400 bg-green-50"
            },
            rejected: {
                icon: XCircleIcon,
                variant: "outline",
                className: "text-red-600 border-red-400 bg-red-50"
            }
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <div className="flex items-center gap-1.5">
                <Badge variant={config.variant} className={cn(config.className, "flex gap-1.5 items-center px-2.5 py-1")}>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="capitalize">{status}</span>
                </Badge>
            </div>
        );
    };

    const downloadResume = (url, filename) => {
        if (!url) return;

        fetch(url, { method: 'GET', mode: 'cors' })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename || 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(err => {
                console.error('Error downloading file:', err);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Messages From Recruiters</h2>
                    <p className="text-gray-600 mt-2">Communications regarding your job applications</p>
                </div>

                {loadingApps ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-500">Once you apply to jobs, any recruiter replies will show here.</p>
                        <div className="mt-6">
                            <Button variant="primary">Browse Jobs</Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid md:grid-cols-3 divide-x divide-gray-200 h-full">
                            {/* Applications List - Left Panel */}
                            <div className="md:col-span-1 h-[calc(100vh-180px)] overflow-y-auto">
                                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                                    <h3 className="text-lg font-semibold text-gray-900">Your Applications</h3>
                                    <div className="mt-2 relative">
                                        <input
                                            type="text"
                                            placeholder="Search applications..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                        />
                                        <div className="absolute left-3 top-2.5 text-gray-400">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <div
                                            key={app._id}
                                            onClick={() => handleJobClick(app.jobId._id, app._id)}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedJobId === app._id ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 line-clamp-1">{app.jobId?.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                        <span className="truncate">{app.jobId?.company}</span>
                                                        <span className="mx-1">•</span>
                                                        <span className="truncate">{app.jobId?.location}</span>
                                                    </p>
                                                </div>
                                                <StatusBadge status={app.status} />
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    Applied {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                                                </span>
                                                <span className="text-xs font-medium text-gray-900">
                                                    {app.jobId?.salary}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {app.jobId?.skills?.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {app.jobId?.skills?.length > 3 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        +{app.jobId.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Messages Section - Right Panel */}
                            <div className="md:col-span-2 h-[calc(100vh-180px)] flex flex-col">
                                {loadingMessages ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                                        <p className="text-gray-500 max-w-md">
                                            When a recruiter replies to your application, it'll appear here with all the details about your conversation.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {selectedApplication?.jobId?.title} • {selectedApplication?.jobId?.company}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadResume(selectedApplication?.resumeUrl, 'resume.pdf')}
                                                    disabled={!selectedApplication?.resumeUrl}
                                                >
                                                    View Resume
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {messages.map((msg) => (
                                                <div key={msg._id} className="flex">

                                                    <div className="flex-1 min-w-0">
                                                        <div className="bg-gray-100 rounded-lg p-4">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    Recruiter
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-gray-800">{msg.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerMessageBoard;