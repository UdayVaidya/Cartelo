import { createBrowserRouter, Navigate, useRouteError, useSearchParams } from "react-router-dom";
import AuthPage from "../Features/Auth/pages/AuthPage";
import DashBoard from "../Features/Dashboard/pages/DashBoard";
import Error from "../Shared/Error";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// Extracts error info from React Router and passes it to the Error UI
function RouteErrorBoundary() {
    const err = useRouteError();
    const statusCode = err?.status ?? err?.statusCode ?? 500;
    const message = err?.statusText || err?.message || "Something went wrong";
    return <Error statusCode={statusCode} error={message} />;
}

// Redirects to /dashboard if already authenticated
function AuthRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    
    // Check for OAuth failures from the backend redirect
    const authError = searchParams.get("error");
    
    // If there's an error, make sure we aren't secretly keeping an old session alive
    useEffect(() => {
        if (authError) {
            import("../Features/Auth/services/auth.service").then(({ logoutUser }) => {
                logoutUser().catch(() => {});
            });
            dispatch({ type: "auth/logout" });
        }
    }, [authError, dispatch]);

    if (authError === "google_auth_failed") {
        return <Error statusCode={401} error="Google Authentication Failed. Access Denied." isAuthError={true} />;
    }

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return children;
}

// Redirects to / if not authenticated
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><AuthPage /></AuthRoute>,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><DashBoard /></ProtectedRoute>,
        errorElement: <RouteErrorBoundary />,
    },
    {
        // Catch-all: any unknown path (e.g. /login, /signup, /abc)
        path: "*",
        element: <Error statusCode={404} error="Page not found" />,
    },
]);

export default router;