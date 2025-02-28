// src/components/ProtectedRoute.tsx
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute: React.FC = () => {
    const { accessToken } = useAppSelector((state: RootState) => state.auth);

    // Nếu chưa đăng nhập, chuyển hướng về trang login
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, cho phép truy cập các routes con
    return <Outlet />;
};

export default ProtectedRoute;
