import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useNavigationLog() {
	const location = useLocation();

	useEffect(() => {
		console.log("Navigating to:", { location });
	}, [location.pathname, location.state]);
}
