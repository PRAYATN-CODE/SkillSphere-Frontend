import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { deleteUser, fetchUserProfile } from "@/redux/slice/userSlice";
import authService from "@/services/authService";
import { ChevronDown, LetterText, LogOut, Menu, User2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, loading, error } = useSelector((state) => state.user);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(deleteUser());
        authService.logout()
        navigate("/login");
    };

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());

        }
        if (error) {
            console.log("Error fetching user profile:", error);
        }
    }, [dispatch, user]);

    const navItems = [
        { name: "Dashboard", to: "/dashboard" },
        { name: "Jobs", to: "/jobs" },
        { name: "Applications", to: "/applications" },
        {
            name: "Other",
            subItems: [
                { name: "Status", to: "/status" },
                { name: "About", to: "/about" },
            ]
        }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/80">
            <div className="flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage className='object-cover' src='/icon.png' />
                        <AvatarFallback>
                            Logo
                        </AvatarFallback>
                    </Avatar>
                    <span className="inline-block font-bold text-zinc-900">SkillSphere</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item, index) => (
                        item.subItems ? (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-1 text-zinc-900 hover:bg-zinc-100">
                                        {item.name}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 border-zinc-200 bg-zinc-50">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <DropdownMenuItem key={subIndex} className="hover:bg-zinc-100 cursor-pointer">
                                            <Link to={subItem.to} className="w-full">
                                                {subItem.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={index}
                                to={item.to}
                                className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Auth Buttons - Desktop */}
                <div className="hidden md:flex items-center space-x-4">
                    {token && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-zinc-100">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage className='object-cover' src={user.profileImage} />
                                        <AvatarFallback>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="h-4 w-4 text-zinc-700" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 border-zinc-200 bg-zinc-50">
                                <div className="px-2 py-1.5 text-sm font-medium">
                                    {user.name}
                                </div>
                                <div className="px-2 text-xs text-zinc-500">
                                    {user.email}
                                </div>
                                <DropdownMenuSeparator className="bg-zinc-200" />

                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-zinc-100 "
                                    onClick={() => {
                                        navigate("/applications", { state: {} });
                                        window.location.reload(); // full page reload
                                    }}
                                >
                                    <LetterText className="mr-2 h-4 w-4" />
                                    <span>Applications</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-zinc-100 "
                                    onClick={() => navigate("/profile")}
                                >
                                    <User2 className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-zinc-100 text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate("/login")}
                                variant="outline"
                                className="border-zinc-900 text-zinc-900 hover:bg-zinc-100"
                            >
                                Log in
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                className="bg-zinc-900 hover:bg-zinc-800"
                            >
                                Sign up
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-900 hover:bg-zinc-100">
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] border-l-zinc-200 bg-zinc-50">
                            <div className="flex flex-col h-full">
                                <div className="flex-1 pt-8">
                                    {navItems.map((item, index) => (
                                        <div key={index} className="mb-6">
                                            {item.subItems ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full">
                                                        <Button variant="ghost" className="flex justify-between w-full text-zinc-900 hover:bg-zinc-100">
                                                            {item.name}
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full border-zinc-200 bg-zinc-50">
                                                        {item.subItems.map((subItem, subIndex) => (
                                                            <DropdownMenuItem key={subIndex} className="hover:bg-zinc-100 cursor-pointer">
                                                                <Link
                                                                    to={subItem.to}
                                                                    className="w-full"
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <Link
                                                    to={item.to}
                                                    className="block py-2 text-sm font-medium text-zinc-900 hover:text-zinc-600"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="pb-8">
                                    <div className="flex flex-col space-y-2">
                                        {token && user ? (
                                            <>
                                                <div className="flex items-center space-x-3 px-4 py-2">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage className='object-cover' src={user.profileImage} />
                                                        <AvatarFallback>
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{user.name}</p>
                                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700"
                                                    onClick={() => {
                                                        navigate('/applications', { state: {} });
                                                    }}
                                                >
                                                    <LetterText className="mr-2 h-4 w-4" />
                                                    My Application
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700"
                                                    onClick={() => {
                                                        handleLogout();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                >
                                                    <User2 className="mr-2 h-4 w-4" />
                                                    Profile
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => {
                                                        handleLogout();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Log out
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        navigate("/login");
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    variant="outline"
                                                >
                                                    Log in
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        navigate("/signup");
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="bg-zinc-900 hover:bg-zinc-800"
                                                >
                                                    Sign up
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}