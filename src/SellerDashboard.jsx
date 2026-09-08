import { useState } from 'react';
import { 
  Store, Package, TrendingUp, DollarSign, Plus, Sparkles, 
  Globe, LogOut, ArrowRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';

// Mock Seller Inventory Data
const INITIAL_INVENTORY = [
  {
    id: 101,
    title: "Handcrafted Terracotta Clay Water Vessel",
    category: "Pottery",
    price: 1299,
    stock: 24,
    sales: 112,
    status: "Active",
    badge: "GI Tagged"
  },
  {
    id: 102,
    title: "Blue Pottery Hand-Carved Ceramic Plate",
    category: "Pottery",
    price: 2100,
    stock: 8,
    sales: 45,
    status: "Low Stock",
    badge: "GI Tagged"
  }
];

// Seller Login / Authentication Component
export function SellerLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [artisanId, setArtisanId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && artisanId) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#111425]/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 border border-amber-300/30">
            <Store className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Artisan Studio Portal</h2>
          <p className="text-xs text-slate-400">Log in to manage your craft inventory and track global sales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-amber-400 mb-1.5">
              Registered Email or Mobile
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artisan@smartartisan.in"
              className="w-full px-4 py-2.5 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-amber-400 mb-1.5">
              Craft Cluster / Artisan ID
            </label>
            <input 
              type="password" 
              required
              value={artisanId}
              onChange={(e) => setArtisanId(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
          >
            <span>Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-amber-500/20 text-center">
          <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Verified Artisan Authentication Network
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Seller Dashboard Component
export default function SellerDashboard({ _lang = 'en', onLogout, onNavigateToStudio }) {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pottery');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newStock) return;

    const newItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      sales: 0,
      status: "Active",
      badge: "Handcrafted"
    };

    setInventory([newItem, ...inventory]);
    setNewTitle('');
    setNewPrice('');
    setNewStock('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Workspace Header */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
            <Store className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Master Artisan Studio
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Verified Partner</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jaipur Craft Cluster &bull; Rajasthan Hub</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onNavigateToStudio && (
            <button 
              onClick={onNavigateToStudio}
              className="px-3.5 py-2 bg-[#111425] border border-amber-500/30 hover:border-amber-500 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Listing Assistant</span>
            </button>
          )}

          <button 
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#111425]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">₹2,39,890</p>
            <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% from last month
            </p>
          </div>

          <div className="bg-[#111425]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Inventory</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{inventory.length} Items</p>
            <p className="text-[10px] font-bold text-slate-400">Across 2 craft categories</p>
          </div>

          <div className="bg-[#111425]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Direct Orders</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">157</p>
            <p className="text-[10px] font-bold text-amber-400">12 pending dispatch</p>
          </div>

          <div className="bg-[#111425]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Global Reach</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">14 Countries</p>
            <p className="text-[10px] font-bold text-emerald-400">GI Export Certified</p>
          </div>
        </div>

        {/* Inventory Section Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Active Craft Listings</h2>
            <p className="text-xs text-slate-400">Manage real-time prices, stock levels, and catalog status</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Craft Item</span>
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-[#111425]/80 backdrop-blur-md border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-[#080911] text-amber-400 uppercase tracking-wider text-[10px] border-b border-amber-500/20">
                <tr>
                  <th className="px-6 py-4">Craft Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Direct Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Total Sales</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10 text-slate-300">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                      <span>{item.title}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold">
                        {item.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{item.category}</td>
                    <td className="px-6 py-4 font-black text-amber-400">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-bold">{item.stock} units</td>
                    <td className="px-6 py-4">{item.sales} sold</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111425] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Add New Craft Listing</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Craft Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hand-Carved Brass Diya Set"
                  className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pottery">Pottery</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Metalcraft">Metalcraft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Initial Stock Count</label>
                <input 
                  type="number" 
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs rounded-xl"
                >
                  Save Craft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}