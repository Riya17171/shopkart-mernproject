import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";
import { useCart } from "../context/cartContext.js";

function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    return (
        <header className="signboard">
            <div className="signboard-inner">
                <Link className="wordmark" to="/home">ShopKart</Link>
                <nav className="nav-links" aria-label="Main">
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/wishlist">Wishlist</NavLink>
                    <NavLink to="/cart">Cart <span className="cart-badge">{totalItems}</span></NavLink>
                    <NavLink to="/orders">Orders</NavLink>
                </nav>
                <div className="nav-account">
                    <span className="nav-user">{user?.fullName}</span>
                    <button className="text-button" type="button" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
