import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../Features/Auth/pages/AuthPage";

import DashBoard from "../Features/Dashboard/pages/DashBoard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />
    },
    {
        path: "/dashboard",
        element: <DashBoard />
    }
]);

export default router;