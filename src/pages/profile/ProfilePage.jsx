import { errorToast, successToast } from "@/components/SkillSphereToast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from '@/config/axios';
import { fetchUserProfile } from "@/redux/slice/userSlice";
import { Check, Key, Loader2, Mail, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPreviewImage(user.profileImage || '');
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
        if (error) {
            console.log("Error fetching user profile:", error);
        }
    }, [dispatch, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                errorToast("Image size should be less than 2MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                errorToast("Please upload an image file");
                return;
            }
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            if (name !== user.name) {
                formData.append('name', name);
            }
            if (profileImage) {
                formData.append('profile-image', profileImage);
            }

            const response = await axios.put('api/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });

            dispatch(fetchUserProfile());
            successToast("Profile updated successfully");
            setIsEditing(false);
            setProfileImage(null);
        } catch (err) {
            errorToast(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="max-w-md w-full border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate('/login')}
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>No User Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please sign in to view your profile</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar - Profile Summary */}
                    <div className="w-full md:w-1/3">
                        <Card className="sticky top-8">
                            <CardHeader className="items-center">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src={previewImage || user.profileImage} alt="Profile" className="object-cover" />
                                        <AvatarFallback className="bg-primary/10">
                                            <User className="h-16 w-16 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Label htmlFor="profileImage" className="cursor-pointer">
                                                <Upload className="h-6 w-6 text-white" />
                                            </Label>
                                            <Input
                                                id="profileImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="mt-4 text-center">
                                    {user.name}
                                    {user.verified && (
                                        <Badge variant="success" className="ml-2">
                                            Verified
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-center">
                                    {user.role || 'Member'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full md:w-2/3">
                        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profile">
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="security">
                                    <Key className="h-4 w-4 mr-2" />
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>
                                            Update your personal details and profile picture
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isEditing ? (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email Address</Label>
                                                    <Input
                                                        value={user.email}
                                                        disabled
                                                        className="opacity-70"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Contact support to change your email
                                                    </p>
                                                </div>
                                                <div className="flex justify-end space-x-3 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setName(user.name);
                                                            setPreviewImage(user.profileImage);
                                                            setProfileImage(null);
                                                        }}
                                                        disabled={isSubmitting}
                                                    >
                                                        Discard Changes
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check className="mr-2 h-4 w-4" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-6">
                                                <div>
                                                    <Label>Full Name</Label>
                                                    <p className="text-sm mt-1">{user.name}</p>
                                                </div>
                                                <div>
                                                    <Label>Email Address</Label>
                                                    <p className="text-sm mt-1">{user.email}</p>
                                                </div>
                                                <div>
                                                    <Label>Role</Label>
                                                    <div className="mt-1">
                                                        <Badge variant={user.role === "employer" ? "success" : "warning"}>
                                                            {user.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {
                                                    user.role !== "seeker" && <div>
                                                        <Label>Skills</Label>
                                                        <div className="mt-1 flex flex-wrap gap-2">
                                                            {user.skills.map((skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>
                                            Manage your password and account security
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div>
                                                <Label>Password Security</Label>
                                                <div className="mt-3 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Encryption Type:</span>
                                                        <span className="text-sm font-medium">BCrypt</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Hash Strength:</span>
                                                        <span className="text-sm font-medium">12 rounds</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Last Changed:</span>
                                                        <span className="text-sm font-medium">
                                                            {user.lastPasswordChange ?
                                                                new Date(user.lastPasswordChange).toLocaleDateString() :
                                                                'Never changed'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;