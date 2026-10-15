// Shows a fixed sequence of steps, such as checkout progress or delivery tracking.
// `current` is the index of the active step; -1 means no step is reached yet.
function ProgressSteps({ steps, current, label }) {
    return (
        <ol className="progress-steps" aria-label={label}>
            {steps.map((step, index) => (
                <li
                    key={step}
                    className={index < current ? "is-done" : index === current ? "is-current" : undefined}
                    aria-current={index === current ? "step" : undefined}
                >
                    {step}
                </li>
            ))}
        </ol>
    );
}

export default ProgressSteps;
