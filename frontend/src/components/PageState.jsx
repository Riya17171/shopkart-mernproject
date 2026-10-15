function PageState({ title, message, action }) {
    return (
        <section className="page-state" aria-live="polite">
            <h2>{title}</h2>
            {message && <p>{message}</p>}
            {action}
        </section>
    );
}

export default PageState;
