import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useRefreshMutation } from '@/features/auth/auth-api-slice';
import { setCredentials } from '@/features/auth/auth-slice';
import { toast } from 'sonner';

const useAuthRefresh = () => {
    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector((state) => state.auth);
    const [refresh, { isLoading }] = useRefreshMutation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refreshToken = async () => {
            if (!accessToken) {
                try {
                    toast.success('Refreshing token...');
                    const data = await refresh().unwrap();
                    dispatch(
                        setCredentials({ accessToken: data.access_token }),
                    );
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                }
            }
            setLoading(false);
        };

        refreshToken();
    }, [accessToken, dispatch, refresh]);

    return loading || isLoading; // Trả về trạng thái loading
};

export default useAuthRefresh;
