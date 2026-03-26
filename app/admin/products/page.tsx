'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader2, X, Package } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  gender: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', category: 'T-Shirts', gender: 'Men',
    price: '', discountPrice: '', images: '', stock: '',
    sizes: 'S:10,M:15,L:10,XL:5',
    tags: '', isFeatured: false, isNewArrival: false, careInstructions: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({
      name: '', slug: '', description: '', category: 'T-Shirts', gender: 'Men',
      price: '', discountPrice: '', images: '', stock: '',
      sizes: 'S:10,M:15,L:10,XL:5',
      tags: '', isFeatured: false, isNewArrival: false, careInstructions: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: '',
      category: product.category,
      gender: product.gender,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      images: product.images.join(','),
      stock: product.stock.toString(),
      sizes: 'S:10,M:15,L:10,XL:5',
      tags: '',
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      careInstructions: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizes = form.sizes.split(',').map((s) => {
      const [size, stock] = s.trim().split(':');
      return { size, stock: parseInt(stock) || 0 };
    });

    const body = {
      ...form,
      price: parseInt(form.price),
      discountPrice: form.discountPrice ? parseInt(form.discountPrice) : undefined,
      stock: parseInt(form.stock),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      sizes,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? 'Product updated!' : 'Product created!');
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save product');
      }
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted">{products.length} products</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={resetForm} className="p-1.5 hover:bg-[var(--input-bg)] rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-muted mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" required /></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-muted mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent resize-none" required /></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent">
                {['T-Shirts','Shoes','Hoodies','Jeans','Shirts','Jackets','Accessories'].map(c => <option key={c}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Gender *</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent">
                {['Men','Women','Unisex'].map(g => <option key={g}>{g}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" required /></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Discount Price (₹)</label>
              <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" required /></div>
            <div><label className="block text-xs font-medium text-muted mb-1">Sizes (S:10,M:15,L:10)</label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-muted mb-1">Image URLs (comma separated)</label>
              <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-muted mb-1">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent" /></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="rounded" /> New Arrival</label>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2.5 text-sm border border-[var(--border)] rounded-xl hover:bg-[var(--input-bg)] transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-5 font-semibold text-muted">Product</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Category</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Price</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Stock</th>
                  <th className="text-right py-3 px-5 font-semibold text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--skeleton)] overflow-hidden flex-shrink-0 relative">
                          {product.images[0] && <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted">{product.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">{product.category}</td>
                    <td className="py-3 px-5">
                      {product.discountPrice ? (
                        <span>₹{product.discountPrice} <span className="text-muted line-through text-xs">₹{product.price}</span></span>
                      ) : `₹${product.price}`}
                    </td>
                    <td className="py-3 px-5">
                      <span className={product.stock === 0 ? 'text-red-500 font-medium' : ''}>{product.stock}</span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-[var(--input-bg)] rounded-lg text-muted hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
