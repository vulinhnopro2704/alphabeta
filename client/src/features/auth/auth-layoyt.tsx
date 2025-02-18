import { Outlet } from 'react-router';

export default function AuthLayout() {
    return (
        <div className="custom-bg h-screen w-screen flex items-center justify-center">
            <Outlet />
        </div>
    );
}
