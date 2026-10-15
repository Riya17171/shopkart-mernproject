// Turns a stock count into shopper-friendly text and a colour tone.
export default function getStockStatus(stock) {
    if (stock <= 0) return { label: "Out of stock", tone: "out" };
    if (stock <= 5) return { label: `Only ${stock} left`, tone: "low" };
    return { label: "In stock", tone: "ok" };
}
