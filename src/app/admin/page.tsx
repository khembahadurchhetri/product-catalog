"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  stock: number;
};

type DashboardData = {
  stats: {
    totalProducts: number;
    totalStock: number;
    averagePrice: string;
  };
  products: Product[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload Panel Modal State
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form values state for uploading new items
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    shortDescription: "",
    longDescription: "",
    imageUrl: "",
  });

  // Fetch metrics data from the database API
  async function loadDashboardMetrics() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Could not fetch dashboard data.");
      const json = await response.json();
      setData(json);
      setError(null); // Clear errors if retry works
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  // Handle product deletion
  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) loadDashboardMetrics();
    } catch (err) {
      console.error(err);
    }
  }

  // Handle Upload Submission
  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsUploadPanelOpen(false); // Close panel on success
        setFormData({
          name: "",
          category: "",
          price: "",
          stock: "",
          shortDescription: "",
          longDescription: "",
          imageUrl: "",
        });
        loadDashboardMetrics(); // Instantly refresh the products table view below
      } else {
        alert("Failed to upload product record to database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request to database.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      
      {/* 1. Top Management Action Bar (Now always viewable!) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900">Products Catalog Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">Upload, view, and manage your live store inventory</p>
        </div>
        <button
          onClick={() => setIsUploadPanelOpen(true)}
          className="bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition active:scale-98 cursor-pointer z-10"
        >
          🚀 Upload New Product
        </button>
      </div>

      {/* 2. Catch Empty states or network faults gracefully without killing action options */}
      {loading ? (
        <div className="p-12 text-center text-sm font-medium text-gray-400 bg-white rounded-xl border border-gray-100 shadow-xs animate-pulse">
          🔄 Syncing database tables...
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100 text-red-600 font-medium text-xs space-y-2">
          <p>⚠️ {error}</p>
          <p className="text-[10px] text-red-400 font-normal">This is normal if your Neon database is completely brand new with zero products.</p>
          <button onClick={loadDashboardMetrics} className="mt-2 text-[11px] bg-white px-3 py-1 border border-red-200 text-red-700 rounded-lg font-bold shadow-xs hover:bg-red-100 transition cursor-pointer">
            Retry Connection Fetch
          </button>
        </div>
      ) : (
        <>
          {/* 3. Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Unique Items</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">{data?.stats?.totalProducts ?? 0}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Inventory Pieces</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">{data?.stats?.totalStock ?? 0} units</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Unit Price</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">${data?.stats?.averagePrice ?? "0.00"}</h3>
            </div>
          </div>

          {/* 4. Products Data Listing Grid Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!data?.products || data.products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-xs font-medium text-gray-400 bg-gray-50/50">
                      📭 No products deployed inside your Neon tables. Click "Upload New Product" above to push your first item live!
                    </td>
                  </tr>
                ) : (
                  data.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">${Number(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                          {product.stock} units left
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer border border-transparent hover:border-red-100 rounded px-2 py-1 transition"
                        >
                          Delete Row
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 5. PRODUCT UPLOAD DRAWER / MODAL PANEL */}
      {isUploadPanelOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Inventory Item</h3>
                <p className="text-xs text-gray-500">Fill in the specifications to publish live to the store.</p>
              </div>
              <button 
                onClick={() => setIsUploadPanelOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-gray-700 mb-1">Product Title / Name</label>
                <input required type="text" placeholder="e.g., Asics GEL-Trabuco 11" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Category Group</label>
                  <input required type="text" placeholder="e.g., Shoes, Clothing" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Product Image URL</label>
                  <input required type="url" placeholder="https://images.unsplash.com/..." className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Price Retail ($)</label>
                  <input required type="number" step="0.01" placeholder="149.99" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Initial Stock Units</label>
                  <input required type="number" placeholder="25" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Short Description</label>
                <input required type="text" placeholder="Waterproof trail running shoes." className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Detailed Long Description</label>
                <textarea required rows={4} placeholder="Detailed product descriptions here..." className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:border-black text-gray-900 resize-none leading-relaxed" value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsUploadPanelOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition font-semibold">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 cursor-pointer transition font-semibold">
                  {submitting ? "Uploading to DB..." : "Publish & Upload Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}