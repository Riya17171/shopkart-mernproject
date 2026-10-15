import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="page-loader" role="status"><span className="loader-mark">ShopKart</span><span className="loader-bar" /><p>Checking your session...</p></div>;
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export default ProtectedRoute;
