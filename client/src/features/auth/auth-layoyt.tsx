import { useAppSelector } from "@/app/hooks";
import { Navigate, Outlet } from "react-router";

export default function AuthLayout() {
	const token = useAppSelector((state) => state.auth.accessToken);
	if (token) {
		return <Navigate to="/" />;
	}

	return (
		<div className="custom-bg h-screen w-screen flex items-center justify-center">
			<Outlet />
		</div>
	);
}
