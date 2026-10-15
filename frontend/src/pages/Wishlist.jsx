import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";

function Wishlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadWishlist() {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/wishlist");
            setProducts(response.data.wishlist);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load your wishlist.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        async function loadInitialWishlist() {
            try {
                const response = await api.get("/wishlist");
                if (active) setProducts(response.data.wishlist);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || "Unable to load your wishlist.");
            } finally {
                if (active) setLoading(false);
            }
        }

        loadInitialWishlist();
        return () => { active = false; };
    }, []);

    function handleRemoved(productId) {
        // Update local UI immediately after the backend confirms removal.
        setProducts((current) => current.filter((product) => product._id !== productId));
    }

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <header className="page-head">
                    <h1 className="page-title">Wishlist</h1>
                    {!loading && !error && <p className="muted">{products.length} saved</p>}
                </header>

                {loading ? <PageState title="Loading your wishlist..." />
                    : error ? <PageState title="Your wishlist didn't load" message={error} action={<button className="btn btn-outline" type="button" onClick={loadWishlist}>Try again</button>} />
                    : products.length === 0 ? <PageState title="Nothing saved yet" message="Tap the heart on any product to save it here." action={<Link className="btn btn-solid" to="/products">Browse products</Link>} />
                    : <section className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} showRemove onWishlistRemoved={handleRemoved} />)}</section>}
            </main>
        </div>
    );
}

export default Wishlist;
