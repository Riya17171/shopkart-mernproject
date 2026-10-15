import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import api from "../services/api.js";
import formatCurrency from "../utils/formatCurrency.js";
import { formatOrderDate, formatOrderNumber, getPaymentLabel } from "../utils/orders.js";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function loadOrders() {
            try {
                const response = await api.get("/orders");
                if (active) setOrders(response.data.orders);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || "Unable to load orders.");
            } finally {
                if (active) setLoading(false);
            }
        }
        loadOrders();
        return () => { active = false; };
    }, []);

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <header className="page-head">
                    <h1 className="page-title">Your orders</h1>
                    {!loading && !error && orders.length > 0 && <p className="muted">{orders.length} {orders.length === 1 ? "order" : "orders"}</p>}
                </header>

                {loading ? <PageState title="Loading your orders..." />
                    : error ? <PageState title="Your orders didn't load" message={error} />
                    : orders.length === 0 ? <PageState title="No orders yet" message="Orders you place will appear here." action={<Link className="btn btn-solid" to="/products">Start shopping</Link>} />
                    : <div className="table-card">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th scope="col">Order</th>
                                    <th scope="col">Placed on</th>
                                    <th scope="col">Items</th>
                                    <th scope="col">Payment</th>
                                    <th scope="col" className="num">Total</th>
                                    <th scope="col"><span className="visually-hidden">Details</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td data-label="Order"><span className="order-number">#{formatOrderNumber(order._id)}</span></td>
                                        <td data-label="Placed on">{formatOrderDate(order.createdAt)}</td>
                                        <td data-label="Items" className="order-items-cell">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td>
                                        <td data-label="Payment"><span className={`status status-${order.paymentStatus.toLowerCase()}`}>{getPaymentLabel(order.paymentStatus)}</span></td>
                                        <td data-label="Total" className="num">{formatCurrency(order.totalAmount)}</td>
                                        <td><Link className="btn btn-outline btn-small" to={`/orders/${order._id}`}>View order</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>}
            </main>
        </div>
    );
}

export default Orders;
