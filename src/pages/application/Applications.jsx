import { errorToast, successToast } from '@/components/SkillSphereToast';
import axios from '@/config/axios';
import { fetchUserProfile } from '@/redux/slice/userSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import JobApplicationForm from './JobApplicationForm';
import JobApplicationsList from './JobApplicationsList';

const Applications = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading: profileLoading } = useSelector((state) => state.user);
    const [jobId, setJobId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [employerApplications, setEmployerApplications] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        coverLetter: '',
        resume: null
    });
    const [formErrors, setFormErrors] = useState({
        coverLetter: '',
        resume: ''
    });

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            coverLetter: '',
            resume: ''
        };

        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = 'Cover letter is required';
            isValid = false;
        } else if (formData.coverLetter.length > 2000) {
            newErrors.coverLetter = 'Cover letter must be less than 2000 characters';
            isValid = false;
        }

        if (!formData.resume) {
            newErrors.resume = 'Resume is required';
            isValid = false;
        } else if (formData.resume) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const fileType = formData.resume.type;
            const fileSize = formData.resume.size; // in bytes

            if (!allowedTypes.includes(fileType)) {
                newErrors.resume = 'Only PDF and Word documents are allowed';
                isValid = false;
            }

            if (fileSize > 5 * 1024 * 1024) { // 5MB limit
                newErrors.resume = 'File size must be less than 5MB';
                isValid = false;
            }
        }

        setFormErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (location.state?.jobId) {
            setJobId(location.state.jobId);
        }
        if (!user) {
            dispatch(fetchUserProfile()).catch(err => {
                console.error('Error fetching user profile:', err);
                errorToast('Failed to load user profile');
                setError('Failed to load user profile');
            });
        }
    }, [location.state, location.state?.jobId, dispatch, user]);

    useEffect(() => {
        if (user?.role === 'seeker' && !jobId) {
            fetchApplications();
        } else if (user?.role === 'employer') {
            fetchEmployerApplications();
        }
    }, [user, jobId]);

    const fetchApplications = async () => {
        try {
            if (!token) {
                throw new Error('Authentication required');
            }

            setIsLoading(true);
            setError(null);

            const response = await axios.get('/api/jobs/my-applications', {
                headers: {
                    'Authorization': token
                },
                timeout: 10000 // 10 seconds timeout
            });

            if (!response.data) {
                throw new Error('Invalid response data');
            }

            setApplications(response.data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to fetch applications';
            setError(errorMessage);
            errorToast(errorMessage);

            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployerApplications = async () => {
        try {
            if (!token) {
                throw new Error('Authentication required');
            }

            setIsLoading(true);
            setError(null);

            const response = await axios.get('/api/jobs/employer/applications', {
                headers: {
                    'Authorization': token
                },
                timeout: 10000
            });

            if (!response.data) {
                throw new Error('Invalid response data');
            }

            setEmployerApplications(response.data || []);
        } catch (err) {
            console.error('Error fetching employer applications:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to fetch applications';
            setError(errorMessage);
            errorToast(errorMessage);

            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            resume: file
        }));

        if (formErrors.resume) {
            setFormErrors(prev => ({
                ...prev,
                resume: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (!token) {
                throw new Error('Authentication required');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('resume', formData.resume);
            formDataToSend.append('coverLetter', formData.coverLetter);

            const response = await axios.post(
                `/api/jobs/${jobId}/apply`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': token
                    },
                    timeout: 15000
                }
            );

            if (!response.data) {
                throw new Error('No response data received');
            }

            successToast('Application submitted successfully!');
            setFormData({ coverLetter: '', resume: null });

            setTimeout(() => {
                navigate('/jobs', { state: {} });
            }, 1500);

        } catch (error) {
            console.error('Error submitting application:', error);
            let errorMessage = 'Failed to submit application';

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Please login to apply';
                    navigate('/login');
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data.message || 'Invalid application data';
                } else if (error.response.status === 404) {
                    errorMessage = 'Job not found';
                    navigate('/jobs');
                } else if (error.response.status === 409) {
                    errorMessage = 'You have already applied to this job';
                }
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            errorToast(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <JobApplicationForm
                jobId={jobId}
                formData={formData}
                formErrors={formErrors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                navigate={navigate}
            />
            <JobApplicationsList
                profileLoading={profileLoading}
                user={user}
                isLoading={isLoading}
                error={error}
                applications={applications}
                employerApplications={employerApplications}
                navigate={navigate}
                fetchApplications={fetchApplications}
                fetchEmployerApplications={fetchEmployerApplications}
            />
        </>
    );
};

export default Applications;