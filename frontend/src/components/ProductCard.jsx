import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api.js";
import { useCart } from "../context/cartContext.js";
import formatCurrency from "../utils/formatCurrency.js";
import getStockStatus from "../utils/stockStatus.js";
import { HeartIcon } from "./Icons.jsx";

function ProductCard({ product, onWishlistRemoved, showRemove = false }) {
    const { addToCart, updatingId } = useCart();
    const [wishlistState, setWishlistState] = useState(showRemove ? "saved" : "idle");
    const [message, setMessage] = useState("");

    async function handleWishlist() {
        setWishlistState("saving");
        setMessage("");
        try {
            if (showRemove) {
                await api.delete(`/wishlist/${product._id}`);
                onWishlistRemoved(product._id);
            } else {
                await api.post(`/wishlist/${product._id}`);
                setWishlistState("saved");
            }
        } catch (error) {
            // A duplicate means the desired result (saved) is already true.
            if (!showRemove && error.response?.status === 409) {
                setWishlistState("saved");
                return;
            }
            setWishlistState(showRemove ? "saved" : "idle");
            setMessage(error.response?.data?.message || "Unable to update wishlist.");
        }
    }

    async function handleCart() {
        const result = await addToCart(product._id);
        setMessage(result.success ? "Added to cart." : result.message);
    }

    const saved = wishlistState === "saved";
    const stock = getStockStatus(product.stock);
    const heartLabel = showRemove ? "Remove from wishlist" : saved ? "Saved to wishlist" : "Save to wishlist";
    const productLink = `/products/${product._id}`;

    return (
        <article className="product-card">
            <div className="product-media">
                {/* The product name below is the accessible link; the image link is a larger click target. */}
                <Link to={productLink} tabIndex={-1} aria-hidden="true">
                    <img src={product.image} alt="" />
                </Link>
                <button
                    type="button"
                    className={saved ? "heart-button is-saved" : "heart-button"}
                    aria-label={heartLabel}
                    aria-pressed={showRemove ? undefined : saved}
                    title={heartLabel}
                    onClick={handleWishlist}
                    disabled={wishlistState === "saving"}
                >
                    <HeartIcon filled={saved} />
                </button>
                <span className="price-tag">{formatCurrency(product.price)}</span>
            </div>
            <div className="product-body">
                <div className="product-meta">
                    <span>{product.category}</span>
                    <span className={`stock-${stock.tone}`}>{stock.label}</span>
                </div>
                <h2 className="product-name"><Link to={productLink}>{product.name}</Link></h2>
                <button className="btn btn-solid btn-block" type="button" onClick={handleCart} disabled={product.stock === 0 || updatingId === product._id}>
                    {product.stock === 0 ? "Out of stock" : updatingId === product._id ? "Adding..." : "Add to cart"}
                </button>
                {message && <p className="card-message" role="status">{message}</p>}
            </div>
        </article>
    );
}

export default ProductCard;
