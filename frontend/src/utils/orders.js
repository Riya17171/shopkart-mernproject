export const checkoutSteps = ["Cart", "Delivery address", "Payment"];

// Delivery tracking follows the order status values defined in the Order model.
export const trackingStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
export const trackingLabels = ["Placed", "Confirmed", "Shipped", "Delivered"];

const paymentLabels = {
    PAID: "Paid",
    PENDING: "Payment pending",
    FAILED: "Payment failed"
};

export function getPaymentLabel(paymentStatus) {
    return paymentLabels[paymentStatus] || paymentStatus;
}

export function formatOrderNumber(orderId) {
    return orderId.slice(-8).toUpperCase();
}

export function formatOrderDate(date) {
    return new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" });
}
