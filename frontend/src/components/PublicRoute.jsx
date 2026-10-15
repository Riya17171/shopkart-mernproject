import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";

function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="page-loader" role="status"><span className="loader-mark">ShopKart</span><span className="loader-bar" /><p>Opening the store...</p></div>;
    }

    if (user) return <Navigate to="/home" replace />;
    return children;
}

export default PublicRoute;
