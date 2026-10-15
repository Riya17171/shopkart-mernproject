import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import PageState from "../components/PageState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { SearchIcon } from "../components/Icons.jsx";
import api from "../services/api.js";

const categories = ["", "Electronics", "Fashion", "Books", "Home"];

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        // A short delay avoids sending an API request after every single keystroke.
        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const response = await api.get("/products", { params: { search, category, sort } });
                if (active) setProducts(response.data.products);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || "Unable to load products.");
            } finally {
                if (active) setLoading(false);
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [search, category, sort]);

    function clearFilters() {
        setSearch("");
        setCategory("");
    }

    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <header className="page-head">
                    <h1 className="page-title">{category || "All products"}</h1>
                    {!loading && !error && <p className="muted">{products.length} {products.length === 1 ? "product" : "products"}</p>}
                </header>

                <div className="catalog-toolbar">
                    <label className="search-box">
                        <span className="visually-hidden">Search products</span>
                        <SearchIcon />
                        <input className="input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name" />
                    </label>
                    <label className="sort-control">Sort
                        <select className="select" value={sort} onChange={(event) => setSort(event.target.value)}>
                            <option value="">Newest first</option>
                            <option value="price_asc">Price: low to high</option>
                            <option value="price_desc">Price: high to low</option>
                        </select>
                    </label>
                </div>

                <div className="category-tabs" role="group" aria-label="Filter by category">
                    {categories.map((item) => (
                        <button key={item || "all"} type="button" className="category-tab" aria-pressed={category === item} onClick={() => setCategory(item)}>
                            {item || "All"}
                        </button>
                    ))}
                </div>

                {loading ? <PageState title="Loading products..." />
                    : error ? <PageState title="Products didn't load" message={error} />
                    : products.length === 0 ? <PageState title="No products match" message="Try another search term or category." action={<button className="btn btn-outline" type="button" onClick={clearFilters}>Clear filters</button>} />
                    : <section className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</section>}
            </main>
        </div>
    );
}

export default Products;
