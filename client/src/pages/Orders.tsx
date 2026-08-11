import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Order } from "../types";

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-slate-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">
                  {new Date(o.createdAt).toLocaleString()}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {o.items.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between text-sm">
                    <span>{it.product.title} × {it.quantity}</span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${o.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
