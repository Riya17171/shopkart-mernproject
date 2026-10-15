import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/authContext.js";
import { useCart } from "../context/cartContext.js";

function Home() {
    const { user } = useAuth();
    const { totalItems } = useCart();
    const firstName = user.fullName.split(" ")[0];

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <section className="home-hero">
                    <div className="home-greeting">
                        <h1 className="display">Namaste, {firstName}.</h1>
                        <p>Your cart, wishlist and orders are all in one place.</p>
                        <Link className="btn btn-solid" to="/products">Start shopping</Link>
                    </div>

                    <article className="member-card" aria-label="Your account details">
                        <div className="member-card-top"><span className="member-brand">ShopKart</span><span>Member</span></div>
                        <p className="member-name">{user.fullName}</p>
                        <dl className="member-details">
                            <div><dt>Email</dt><dd>{user.email}</dd></div>
                            <div><dt>Phone</dt><dd>{user.phone}</dd></div>
                            <div><dt>Member ID</dt><dd className="member-id">{user._id}</dd></div>
                        </dl>
                    </article>
                </section>

                <nav className="home-shelf" aria-label="Your shopping">
                    <Link to="/cart">
                        <strong>Cart</strong>
                        <span>{totalItems === 0 ? "Nothing in it yet" : `${totalItems} ${totalItems === 1 ? "item" : "items"} waiting`}</span>
                    </Link>
                    <Link to="/wishlist"><strong>Wishlist</strong><span>Products you saved for later</span></Link>
                    <Link to="/orders"><strong>Orders</strong><span>Track and review past purchases</span></Link>
                </nav>
            </main>
        </div>
    );
}

export default Home;
