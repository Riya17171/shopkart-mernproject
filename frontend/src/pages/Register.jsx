import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

const initialForm = { fullName: "", email: "", phone: "", password: "" };

function Register() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/customers/register", form);
            navigate("/login", { replace: true, state: { message: "Account created. You can now sign in." } });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create your account.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-sign">
                <div>
                    <div className="auth-wordmark">Shop<br />Kart</div>
                    <p className="auth-tagline">One account for your cart, your wishlist and every order you place.</p>
                </div>
                <p className="auth-footnote">Checkout runs in Razorpay Test Mode, so no real money is charged.</p>
            </section>

            <section className="auth-panel">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-head">
                        <h1>Create your account</h1>
                        <p className="muted">You'll use these details to sign in and check out.</p>
                    </div>
                    {error && <div className="notice notice-error" role="alert">{error}</div>}
                    <div className="field-pair">
                        <label className="field">Full name<input className="input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Priya Sharma" autoComplete="name" required /></label>
                        <label className="field">Phone number<input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" inputMode="tel" autoComplete="tel" required /></label>
                    </div>
                    <label className="field">Email address<input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required /></label>
                    <label className="field">Password<input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" minLength="6" autoComplete="new-password" required /></label>
                    <button className="btn btn-solid btn-block" disabled={submitting}>{submitting ? "Creating account..." : "Create account"}</button>
                    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                </form>
            </section>
        </main>
    );
}

export default Register;
