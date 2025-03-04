import '@/App.css';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLayout from './features/auth/auth-layoyt.tsx';
import LoginScreen from './features/auth/login/login-screen.tsx';
import SignUpScreen from './features/auth/signup/sign-up-screen.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import Homepage from './features/homepage/homepage.tsx';
import Layout from './features/layout.tsx';
import { Loader } from 'lucide-react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route element={<AuthLayout />}>
                    <Route
                        path="login"
                        element={
                            <PageTransition>
                                <LoginScreen />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="signup"
                        element={
                            <PageTransition>
                                <SignUpScreen />
                            </PageTransition>
                        }
                    />
                </Route>
                <Route element={<Layout />}>
                    {/* <Route element={<ProtectedRoute />}> */}
                    <Route
                        index
                        element={
                            <PageTransition>
                                <Homepage />
                            </PageTransition>
                        }
                    />
                    {/* </Route> */}
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

// Component giúp thêm hiệu ứng chuyển trang
function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-screen h-full justify-center items-center flex"
        >
            {children}
        </motion.div>
    );
}

function App() {
    // const loading = useAuthRefresh();

    if (false) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                    }}
                >
                    <Loader size="50" className="text-blue-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
            <Toaster />
        </>
    );
}

export default App;
