import AboutPage from '@/pages/about/AboutPage'
import SeekerMessageBoard from '@/pages/about/SeekerMessagesSection'
import Applications from '@/pages/application/Applications'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import HomePage from '@/pages/home/HomePage'
import Jobs from '@/pages/jobs/Jobs'
import LandingPage from '@/pages/landing/LandingPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import { Route, Routes } from 'react-router-dom'

function AppRoute() {
    return (
        <>
            <Routes>

                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/status" element={<SeekerMessageBoard />} />
                <Route path="/jobs" element={<Jobs />} />
            </Routes>
        </>
    )
}

export default AppRoute
