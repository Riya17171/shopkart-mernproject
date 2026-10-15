const iconProps = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
};

export function HeartIcon({ filled = false }) {
    return (
        <svg {...iconProps} fill={filled ? "currentColor" : "none"}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export function SearchIcon() {
    return (
        <svg {...iconProps} fill="none">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.35-4.35" />
        </svg>
    );
}

export function CheckIcon() {
    return (
        <svg {...iconProps} width={24} height={24} strokeWidth={3} fill="none">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
