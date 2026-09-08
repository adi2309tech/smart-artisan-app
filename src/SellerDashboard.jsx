import React, { useState } from 'react';
import { 
  User, Lock, LogOut, LayoutDashboard, Package, 
  TrendingUp, IndianRupee, ShieldCheck, ArrowRight 
} from 'lucide-react';

export default function SellerDashboard({ onLogout, onNavigateToStudio }) {
  const stats = [
    { title: "Total Sales", value: "₹24,850", icon: IndianRupee, color: "text-emerald-600 bg-emerald-50" },
    { title: "Products Listed", value: "12 Items", icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { title: "Store Views", value: "1,420", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
    { title: "Artisan Rating", value: "4.9 / 5.0", icon: ShieldCheck, color: "text-blue-600 bg-blue-50" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base">Artisan Seller Dashboard</h1>
              <p className="text-xs text-slate-500">Welcome back, Rameshwar Handlooms</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onNavigateToStudio}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {[
                { id: "#ORD-9021", name: "Handwoven Banarasi Pure Silk Saree", price: "₹4,850", status: "Shipped" },
                { id: "#ORD-9018", name: "Terracotta Hand-Painted Ethnic Vase", price: "₹1,250", status: "Delivered" },
                { id: "#ORD-8995", name: "Brass Antique Table Lamp", price: "₹3,400", status: "Delivered" },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900">{order.id}</span>
                    <p className="text-slate-600 mt-0.5">{order.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">{order.price}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-800/50 px-2 py-1 rounded">
                AI Studio Tool
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">Create New Product Listing</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Use our AI studio to clean product photos, convert voice to multi-lingual descriptions, and calculate fair artisan margins.
              </p>
            </div>

            <button
              onClick={onNavigateToStudio}
              className="mt-6 w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Launch Studio Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export function SellerLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('artisan@craft.in');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Seller Portal Login</h2>
          <p className="text-xs text-slate-500 mt-1">Manage crafts, sales, and AI listings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email / Phone</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all mt-2"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}