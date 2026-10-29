"use client";

import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: string; name: string; sku: string; description: string; unit: string;
  sellingPrice: string | number; purchasePrice: string | number; stockQuantity: number;
  lowStockAt: number; active: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load products.");
      setProducts(data.products || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load products.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    payload.sellingPrice = String(payload.sellingPrice || "0");
    payload.purchasePrice = String(payload.purchasePrice || "0");
    payload.stockQuantity = String(payload.stockQuantity || "0");
    payload.lowStockAt = String(payload.lowStockAt || "5");
    try {
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create product.");
      formElement.reset();
      setMessage("Product created successfully.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create product."); }
    finally { setSaving(false); }
  }

  async function removeProduct(product: Product) {
    if (!window.confirm("Delete " + product.name + "? This cannot be undone.")) return;
    setError(""); setMessage("");
    try {
      const res = await fetch("/api/admin/products/" + product.id, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete product.");
      setProducts(current => current.filter(item => item.id !== product.id));
      setMessage("Product deleted.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not delete product."); }
  }

  return <main className="admin-shell">
    <div className="admin-header"><div><div className="eyebrow">AL YOUNUS · CATALOGUE</div><h1>Product management</h1><p className="muted">Add and manage catalogue records stored in PostgreSQL.</p></div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><a className="button" href="/admin">Dashboard</a><a className="button" href="/">Storefront</a></div></div>
    {error && <p role="alert" style={noticeError}>{error}</p>}
    {message && <p role="status" style={noticeSuccess}>{message}</p>}
    <section className="card" style={{marginTop:24}}>
      <h2>Add product</h2>
      <form onSubmit={createProduct} className="product-form">
        <label>Product name *<input name="name" required maxLength={160} /></label>
        <label>SKU *<input name="sku" required maxLength={80} /></label>
        <label>Unit<input name="unit" defaultValue="piece" /></label>
        <label>Selling price (₹) *<input name="sellingPrice" type="number" min="0" step="0.01" required defaultValue="0" /></label>
        <label>Purchase price (₹)<input name="purchasePrice" type="number" min="0" step="0.01" defaultValue="0" /></label>
        <label>Stock quantity<input name="stockQuantity" type="number" min="0" step="1" defaultValue="0" /></label>
        <label>Low-stock alert at<input name="lowStockAt" type="number" min="0" step="1" defaultValue="5" /></label>
        <label className="wide-field">Description *<textarea name="description" required rows={3} /></label>
        <button className="button" type="submit" disabled={saving}>{saving ? "Saving…" : "Add product"}</button>
      </form>
    </section>
    <section style={{marginTop:28}}><h2>Products {loading ? "" : "(" + products.length + ")"}</h2>
      {loading ? <p className="muted">Loading products…</p> : products.length === 0 ? <p className="muted">No products in the connected database yet.</p> :
      <div className="table-wrap"><table className="table"><thead><tr><th>SKU</th><th>Product</th><th>Selling price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {products.map(product=><tr key={product.id}><td>{product.sku}</td><td>{product.name}<div className="muted">{product.unit}</div></td><td>₹{Number(product.sellingPrice).toFixed(2)}</td><td>{product.stockQuantity}{product.stockQuantity <= product.lowStockAt ? <span className="tag" style={{marginLeft:8}}>Low stock</span> : null}</td><td>{product.active ? "Active" : "Inactive"}</td><td><button type="button" className="button" onClick={()=>void removeProduct(product)} style={{background:"#9c3328",border:0,cursor:"pointer"}}>Delete</button></td></tr>)}
      </tbody></table></div>}
    </section>
  </main>;
}

const noticeError = {background:"#fff0ef",color:"#a12a20",padding:12,borderRadius:8};
const noticeSuccess = {background:"#eaf8ef",color:"#1b6b3a",padding:12,borderRadius:8};
