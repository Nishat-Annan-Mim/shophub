import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Category, Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeCategory) params.categoryId = activeCategory;
    if (search) params.search = search;
    api
      .get("/products", { params })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover products</h1>
        <p className="text-slate-500 mt-1">Browse our catalog by category</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeCategory === "" ? "bg-brand-600 text-white" : "bg-white border border-slate-300"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeCategory === c.id
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-slate-300"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-slate-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
