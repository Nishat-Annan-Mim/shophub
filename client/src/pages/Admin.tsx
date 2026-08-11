import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import type { Category, Product } from "../types";

const emptyProductForm = {
  title: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK",
};

export default function Admin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Category form
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  // Product form
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [msg, setMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadAll = () => {
    api.get("/categories").then((res) => setCategories(res.data.data));
    api
      .get("/products", { params: { limit: 50 } })
      .then((res) => setProducts(res.data.data));
  };

  useEffect(loadAll, []);

  const flash = (text: string) => {
    setSuccessMsg(text);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // ---------------- Category handlers ----------------

  const startEditCategory = (c: Category) => {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatDesc(c.description || "");
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setCatName("");
    setCatDesc("");
  };

  const submitCategory = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      if (editingCategoryId) {
        await api.patch(`/categories/${editingCategoryId}`, {
          name: catName,
          description: catDesc,
        });
        flash("Category updated");
      } else {
        await api.post("/categories", { name: catName, description: catDesc });
        flash("Category created");
      }
      cancelEditCategory();
      loadAll();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to save category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (
      !confirm(
        "Delete this category? Products under it will remain but should be reassigned.",
      )
    )
      return;
    await api.delete(`/categories/${id}`);
    flash("Category deleted");
    loadAll();
  };

  // ---------------- Product handlers ----------------

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      description: p.description || "",
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId,
      imageUrl: p.imageUrl || "",
      status: p.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    const payload = {
      title: productForm.title,
      description: productForm.description || undefined,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      categoryId: productForm.categoryId,
      imageUrl: productForm.imageUrl || undefined,
      status: productForm.status,
    };
    try {
      if (editingProductId) {
        await api.patch(`/products/${editingProductId}`, payload);
        flash("Product updated");
      } else {
        await api.post("/products", payload);
        flash("Product created");
      }
      cancelEditProduct();
      loadAll();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone from the UI."))
      return;
    await api.delete(`/products/${id}`);
    if (editingProductId === id) cancelEditProduct();
    flash("Product deleted");
    loadAll();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {msg && (
        <div className="mb-4 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 text-sm bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg">
          {successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* ---------------- Categories ---------------- */}
        <div>
          <h2 className="font-semibold mb-3">
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </h2>
          <form
            onSubmit={submitCategory}
            className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3"
          >
            <input
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
              placeholder="Description (optional)"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <div className="flex gap-2">
              <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
                {editingCategoryId ? "Update" : "Create"}
              </button>
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={cancelEditCategory}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200"
              >
                <span className="text-sm">{c.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEditCategory(c)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Products ---------------- */}
        <div>
          <h2 className="font-semibold mb-3">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>
          <form
            onSubmit={submitProduct}
            className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3"
          >
            <input
              placeholder="Product title"
              value={productForm.title}
              onChange={(e) =>
                setProductForm({ ...productForm, title: e.target.value })
              }
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Description (optional)"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <div className="flex gap-3">
              <input
                placeholder="Price"
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Stock"
                type="number"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({ ...productForm, stock: e.target.value })
                }
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={productForm.status}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  status: e.target.value as typeof productForm.status,
                })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
            <input
              placeholder="Image URL (optional, paste a link e.g. https://...)"
              value={productForm.imageUrl}
              onChange={(e) =>
                setProductForm({ ...productForm, imageUrl: e.target.value })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            {productForm.imageUrl && (
              <img
                src={productForm.imageUrl}
                alt="Preview"
                className="h-32 w-full object-cover rounded-lg border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="flex gap-2">
              <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
                {editingProductId ? "Update" : "Create"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={cancelEditProduct}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className={`flex justify-between items-center bg-white p-3 rounded-xl border ${
                  editingProductId === p.id
                    ? "border-brand-400 ring-1 ring-brand-200"
                    : "border-slate-200"
                }`}
              >
                <div className="text-sm">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-slate-500"> — ${p.price}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {p.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEditProduct(p)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
