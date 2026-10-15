import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import ProgressSteps from "../components/ProgressSteps.jsx";
import { useAuth } from "../context/authContext.js";
import { useCart } from "../context/cartContext.js";
import api from "../services/api.js";
import formatCurrency from "../utils/formatCurrency.js";
import loadRazorpay from "../utils/loadRazorpay.js";
import { checkoutSteps } from "../utils/orders.js";

function Checkout() {
    const { user } = useAuth();
    const { cartItems, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(event) {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    }

    function validateForm() {
        if (Object.values(form).some((value) => !value.trim())) return "All shipping fields are required.";
        if (!/^\d{10}$/.test(form.phone.trim())) return "Phone number must contain 10 digits.";
        if (!/^\d{6}$/.test(form.pincode.trim())) return "Pincode must contain 6 digits.";
        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError("");

        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) {
            setError("Unable to load Razorpay Checkout. Check your internet connection.");
            setSubmitting(false);
            return;
        }

        try {
            // Only the address is sent. The backend rebuilds items and total from the cart.
            const response = await api.post("/orders/create-payment-order", { shippingAddress: form });
            const checkoutData = response.data;

            const paymentObject = new window.Razorpay({
                key: checkoutData.key,
                amount: checkoutData.amount,
                currency: checkoutData.currency,
                name: "ShopKart",
                description: "ShopKart Order",
                order_id: checkoutData.razorpayOrderId,
                prefill: { name: form.fullName, contact: form.phone, email: user?.email },
                theme: { color: "#1b1f5e" },
                modal: {
                    ondismiss: () => setSubmitting(false)
                },
                handler: async (paymentResponse) => {
                    try {
                        const verification = await api.post("/orders/verify-payment", {
                            shopKartOrderId: checkoutData.shopKartOrderId,
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature
                        });
                        clearCart();
                        navigate(`/orders/${verification.data.order._id}`, {
                            replace: true,
                            state: { orderPlaced: true }
                        });
                    } catch (requestError) {
                        setError(requestError.response?.data?.message || "Payment could not be verified. Your cart was not cleared.");
                        setSubmitting(false);
                    }
                }
            });

            paymentObject.on("payment.failed", (paymentResponse) => {
                setError(paymentResponse.error?.description || "Payment failed. Your cart has not been cleared.");
                setSubmitting(false);
            });
            paymentObject.open();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to start checkout.");
            setSubmitting(false);
        }
    }

    if (cartItems.length === 0) {
        return <div className="app-shell"><Navbar /><main className="page"><PageState title="Your cart is empty" message="Add products to your cart before checking out." action={<Link className="btn btn-solid" to="/products">Browse products</Link>} /></main></div>;
    }

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <ProgressSteps steps={checkoutSteps} current={1} label="Checkout progress" />
                <header className="page-head"><h1 className="page-title">Checkout</h1></header>

                <form className="checkout-layout" onSubmit={handleSubmit}>
                    <section className="panel checkout-form">
                        <h2 className="section-title">Delivery address</h2>
                        <div className="field-pair">
                            <label className="field">Full name<input className="input" name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" required /></label>
                            <label className="field">Phone number<input className="input" name="phone" value={form.phone} onChange={handleChange} inputMode="numeric" maxLength="10" autoComplete="tel-national" required /></label>
                        </div>
                        <label className="field">Address<input className="input" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="House number, street and area" autoComplete="address-line1" required /></label>
                        <div className="field-pair">
                            <label className="field">City<input className="input" name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" required /></label>
                            <label className="field">State<input className="input" name="state" value={form.state} onChange={handleChange} autoComplete="address-level1" required /></label>
                        </div>
                        <label className="field">Pincode<input className="input" name="pincode" value={form.pincode} onChange={handleChange} inputMode="numeric" maxLength="6" autoComplete="postal-code" required /></label>
                    </section>

                    <aside className="receipt">
                        <h2 className="receipt-title">Your order</h2>
                        <dl className="receipt-rows">
                            {cartItems.map((item) => (
                                <div key={item.product._id}><dt>{item.product.name} × {item.quantity}</dt><dd>{formatCurrency(item.product.price * item.quantity)}</dd></div>
                            ))}
                            <div><dt>Delivery</dt><dd>Free</dd></div>
                        </dl>
                        <div className="receipt-total"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
                        {/* Errors sit next to the pay button because that is where the shopper is looking. */}
                        {error && <div className="notice notice-error" role="alert">{error}</div>}
                        <button className="btn btn-solid btn-block" disabled={submitting}>{submitting ? "Opening payment..." : `Pay ${formatCurrency(subtotal)}`}</button>
                        <p className="receipt-note">This is a Razorpay Test Mode payment, so no real money is charged.</p>
                    </aside>
                </form>
            </main>
        </div>
    );
}

export default Checkout;
