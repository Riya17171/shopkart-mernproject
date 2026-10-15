import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import ProgressSteps from "../components/ProgressSteps.jsx";
import { CheckIcon } from "../components/Icons.jsx";
import api from "../services/api.js";
import formatCurrency from "../utils/formatCurrency.js";
import { formatOrderDate, formatOrderNumber, getPaymentLabel, trackingLabels, trackingStatuses } from "../utils/orders.js";

function OrderDetails() {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function loadOrder() {
            try {
                const response = await api.get(`/orders/${id}`);
                if (active) setOrder(response.data.order);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || "Unable to load order.");
            } finally {
                if (active) setLoading(false);
            }
        }
        loadOrder();
        return () => { active = false; };
    }, [id]);

    if (loading || error) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="page">
                    {loading ? <PageState title="Loading order..." />
                        : <PageState title="Order unavailable" message={error} action={<Link className="btn btn-outline" to="/orders">Back to orders</Link>} />}
                </main>
            </div>
        );
    }

    const trackingIndex = trackingStatuses.indexOf(order.status);
    const unitCount = order.items.reduce((total, item) => total + item.quantity, 0);
    const address = order.shippingAddress;

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                {location.state?.orderPlaced && (
                    <section className="order-placed" role="status">
                        <span className="order-placed-icon"><CheckIcon /></span>
                        <div>
                            <h2>Order placed</h2>
                            <p>Your payment went through. Your cart is now empty and the order is saved below.</p>
                        </div>
                    </section>
                )}

                <header className="page-head">
                    <div>
                        <h1 className="page-title">Order #{formatOrderNumber(order._id)}</h1>
                        <p className="muted">Placed on {formatOrderDate(order.createdAt)}</p>
                    </div>
                    <span className={`status status-${order.paymentStatus.toLowerCase()}`}>{getPaymentLabel(order.paymentStatus)}</span>
                </header>

                {trackingIndex === -1
                    ? <p className="notice notice-warning tracking-note">This order is waiting for payment.</p>
                    : <ProgressSteps steps={trackingLabels} current={trackingIndex} label="Delivery progress" />}

                <div className="order-layout">
                    <div className="order-main">
                        <section className="panel">
                            <h2 className="section-title">Items</h2>
                            <ul className="order-items">
                                {order.items.map((item) => (
                                    <li key={item.product}>
                                        <img src={item.image} alt="" />
                                        <div><strong>{item.name}</strong><span>{formatCurrency(item.price)} × {item.quantity}</span></div>
                                        <b>{formatCurrency(item.price * item.quantity)}</b>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="info-pair">
                            <section className="panel">
                                <h2 className="section-title">Delivery address</h2>
                                <address>
                                    <strong>{address.fullName}</strong><br />
                                    {address.addressLine1}<br />
                                    {address.city}, {address.state} {address.pincode}<br />
                                    {address.phone}
                                </address>
                            </section>
                            <section className="panel">
                                <h2 className="section-title">Payment</h2>
                                <p>Razorpay Test Mode</p>
                                {order.razorpayPaymentId && <p className="payment-id">Payment ID: {order.razorpayPaymentId}</p>}
                            </section>
                        </div>
                    </div>

                    <aside className="order-side">
                        <div className="receipt">
                            <h2 className="receipt-title">Bill</h2>
                            <dl className="receipt-rows">
                                <div><dt>Items</dt><dd>{unitCount}</dd></div>
                                <div><dt>Subtotal</dt><dd>{formatCurrency(order.totalAmount)}</dd></div>
                                <div><dt>Delivery</dt><dd>Free</dd></div>
                            </dl>
                            <div className="receipt-total"><span>{order.paymentStatus === "PAID" ? "Total paid" : "Total"}</span><strong>{formatCurrency(order.totalAmount)}</strong></div>
                        </div>
                        <div className="order-actions">
                            <Link className="btn btn-solid" to="/products">Continue shopping</Link>
                            <Link className="btn btn-outline" to="/orders">View all orders</Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default OrderDetails;
