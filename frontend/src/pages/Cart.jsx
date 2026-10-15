import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import ProgressSteps from "../components/ProgressSteps.jsx";
import { useCart } from "../context/cartContext.js";
import formatCurrency from "../utils/formatCurrency.js";
import { checkoutSteps } from "../utils/orders.js";

function Cart() {
    const { cartItems, loading, error, updatingId, totalItems, subtotal, refreshCart, updateQuantity, removeFromCart } = useCart();

    if (loading) {
        return <div className="app-shell"><Navbar /><main className="page"><PageState title="Loading your cart..." /></main></div>;
    }

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                {cartItems.length > 0 && <ProgressSteps steps={checkoutSteps} current={0} label="Checkout progress" />}
                <header className="page-head">
                    <h1 className="page-title">Your cart</h1>
                    <p className="muted">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
                </header>

                {error && <div className="notice notice-error notice-row" role="alert">{error} <button className="text-button" type="button" onClick={refreshCart}>Try again</button></div>}

                {cartItems.length === 0 ? <PageState title="Your cart is empty" message="Add a product to get started." action={<Link className="btn btn-solid" to="/products">Browse products</Link>} />
                    : <div className="cart-layout">
                        <ul className="cart-lines">
                            {cartItems.map((item) => (
                                <li className="cart-line" key={item.product._id}>
                                    <img src={item.product.image} alt="" />
                                    <div className="cart-line-info">
                                        <Link className="cart-line-name" to={`/products/${item.product._id}`}>{item.product.name}</Link>
                                        <span className="muted">{formatCurrency(item.product.price)} each</span>
                                        <button className="text-button" type="button" disabled={updatingId === item.product._id} onClick={() => removeFromCart(item.product._id)}>Remove</button>
                                    </div>
                                    <div className="qty-stepper" role="group" aria-label={`Quantity of ${item.product.name}`}>
                                        <button type="button" aria-label="Decrease quantity" disabled={item.quantity === 1 || updatingId === item.product._id} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>−</button>
                                        <output aria-live="polite">{item.quantity}</output>
                                        <button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.product.stock || updatingId === item.product._id} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <strong className="line-amount">{formatCurrency(item.product.price * item.quantity)}</strong>
                                </li>
                            ))}
                        </ul>

                        <aside className="receipt">
                            <h2 className="receipt-title">Order summary</h2>
                            <dl className="receipt-rows">
                                <div><dt>Items</dt><dd>{totalItems}</dd></div>
                                <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
                                <div><dt>Delivery</dt><dd>Free</dd></div>
                            </dl>
                            <div className="receipt-total"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
                            <Link className="btn btn-solid btn-block" to="/checkout">Continue to delivery</Link>
                            <p className="receipt-note">Enter your address next, then pay with Razorpay.</p>
                        </aside>
                    </div>}
            </main>
        </div>
    );
}

export default Cart;
