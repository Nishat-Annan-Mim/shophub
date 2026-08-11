import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");

  const load = () => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReview = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/reviews", { productId: id, rating, comment });
      setComment("");
      load();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Could not submit review");
    }
  };

  const handleOrder = async () => {
    setMsg("");
    try {
      await api.post("/orders", { items: [{ productId: id, quantity: qty }] });
      setMsg("Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Could not place order");
    }
  };

  if (!product)
    return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 grid md:grid-cols-2 gap-8">
        <div className="h-64 bg-gradient-to-br from-brand-100 to-brand-50 rounded-xl flex items-center justify-center text-6xl font-bold text-brand-600 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            product.title.charAt(0)
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-600 uppercase">
            {product.category?.name}
          </p>
          <h1 className="text-2xl font-bold mt-1">{product.title}</h1>
          <p className="text-slate-500 mt-2">{product.description}</p>
          <p className="text-3xl font-bold mt-4">${product.price.toFixed(2)}</p>
          <p className="text-sm text-slate-500 mt-1">
            {product.stock} in stock
          </p>

          {user ? (
            <div className="mt-6 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 border border-slate-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={handleOrder}
                disabled={product.stock === 0}
                className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
              >
                Place Order
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              Login to place an order.
            </p>
          )}
          {msg && <p className="mt-3 text-sm text-brand-700">{msg}</p>}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>

        {user && (
          <form
            onSubmit={handleReview}
            className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 space-y-3"
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-3 py-1.5"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              rows={3}
            />
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
              Submit review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-4 rounded-xl border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.user.name}</span>
                  <span className="text-amber-500">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-slate-600 mt-1 text-sm">{r.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
