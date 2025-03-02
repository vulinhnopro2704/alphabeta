import { toast } from 'sonner';
import { Logo, Streak, Diamond, Heart } from '.';
import { Button } from './ui/button';
import { useLogoutMutation } from '@/features/auth/auth-api-slice';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/auth-slice';

export default function Header() {
    const [logoutCall] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        try {
            const result = await logoutCall();
            if (result.error) {
                console.error('Failed to logout:', result.error);
            } else {
                toast.success('Logout successfully');
                dispatch(logout());
            }
        } catch (error) {
            console.error('Failed to logout:', error);
            toast.error('Failed to logout:');
        }
    };

    return (
        <header className="dark:bg-background-dark  flex justify-between items-center p-4 bg-white shadow-md shadow-amber-50">
            {/*Logo*/}
            <Logo className="h-10 w-40" />

            <div className="flex items-center space-x-4">
                {/* Streaks */}
                <Streak variant="filled" />

                {/* Diamond */}
                <Diamond />

                {/* Hear */}
                <Heart />

                {/* Profile */}
                <div>
                    <img src="" alt="" />
                </div>
                <div>
                    <Button variant="destructive" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
