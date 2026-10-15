import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/authContext.js";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await api.post("/customers/login", form);
            setUser(response.data.customer);
            navigate("/home", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to log in. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-sign">
                <div>
                    <div className="auth-wordmark">Shop<br />Kart</div>
                    <p className="auth-tagline">Gadgets, books, clothes and homeware in one cart.</p>
                </div>
                <p className="auth-footnote">Checkout runs in Razorpay Test Mode, so no real money is charged.</p>
            </section>

            <section className="auth-panel">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-head">
                        <h1>Sign in</h1>
                        <p className="muted">Use the email and password you registered with.</p>
                    </div>
                    {location.state?.message && <div className="notice notice-success" role="status">{location.state.message}</div>}
                    {error && <div className="notice notice-error" role="alert">{error}</div>}
                    <label className="field">Email address
                        <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
                    </label>
                    <label className="field">Password
                        <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" autoComplete="current-password" required />
                    </label>
                    <button className="btn btn-solid btn-block" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
                    <p className="auth-switch">New to ShopKart? <Link to="/register">Create an account</Link></p>
                </form>
            </section>
        </main>
    );
}

export default Login;
