import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import { HeartIcon } from "../components/Icons.jsx";
import { useCart } from "../context/cartContext.js";
import api from "../services/api.js";
import formatCurrency from "../utils/formatCurrency.js";
import getStockStatus from "../utils/stockStatus.js";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart, updatingId } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let active = true;
        async function loadProduct() {
            try {
                const response = await api.get(`/products/${id}`);
                if (active) setProduct(response.data.product);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || "Unable to load product.");
            } finally {
                if (active) setLoading(false);
            }
        }
        loadProduct();
        return () => { active = false; };
    }, [id]);

    async function handleCart() {
        const result = await addToCart(product._id);
        setMessage(result.success
            ? { tone: "success", text: "Added to your cart." }
            : { tone: "error", text: result.message });
    }

    async function handleWishlist() {
        try {
            await api.post(`/wishlist/${product._id}`);
            setMessage({ tone: "success", text: "Saved to your wishlist." });
        } catch (requestError) {
            setMessage(requestError.response?.status === 409
                ? { tone: "success", text: "This product is already in your wishlist." }
                : { tone: "error", text: requestError.response?.data?.message || "Unable to save product." });
        }
    }

    const stock = product ? getStockStatus(product.stock) : null;

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                {loading ? <PageState title="Loading product..." />
                    : error ? <PageState title="Product unavailable" message={error} action={<Link className="btn btn-outline" to="/products">Back to products</Link>} />
                    : <>
                        <nav className="breadcrumb" aria-label="Breadcrumb">
                            <Link to="/products">Products</Link>
                            <span aria-hidden="true">/</span>
                            <span>{product.category}</span>
                        </nav>
                        <section className="details-layout">
                            <div className="details-media"><img src={product.image} alt={product.name} /></div>
                            <div className="details-info">
                                <h1 className="page-title">{product.name}</h1>
                                <span className="price-tag price-tag-lg">{formatCurrency(product.price)}</span>
                                <p className={`stock-line stock-${stock.tone}`}>{stock.label}</p>
                                <p className="details-description">{product.description}</p>
                                <div className="details-actions">
                                    <button className="btn btn-solid" type="button" disabled={!product.stock || updatingId === product._id} onClick={handleCart}>
                                        {!product.stock ? "Out of stock" : updatingId === product._id ? "Adding..." : "Add to cart"}
                                    </button>
                                    <button className="btn btn-outline" type="button" onClick={handleWishlist}><HeartIcon /> Save to wishlist</button>
                                </div>
                                {message && <p className={`notice notice-${message.tone}`} role="status">{message.text}</p>}
                            </div>
                        </section>
                    </>}
            </main>
        </div>
    );
}

export default ProductDetails;
