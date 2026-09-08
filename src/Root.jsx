import React, { useState } from 'react';
import App from './App.jsx';
import SellerDashboard, { SellerLogin } from './SellerDashboard.jsx';
import { ShoppingBag, Store, ArrowLeft } from 'lucide-react';

export default function Root() {
  const [role, setRole] = useState(null); // 'buyer' | 'seller' | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'studio'

  // Step 1: Role Selection Screen (Buyer or Seller)
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome to Smart Artisan</h2>
          <p className="text-xs text-slate-500 mb-6">Please select your account type to continue</p>

          <div className="space-y-3">
            {/* Buyer Option */}
            <button
              onClick={() => setRole('buyer')}
              className="w-full p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left flex items-center space-x-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700">Explore as Buyer</p>
                <p className="text-[11px] text-slate-500">Browse and purchase authentic handmade crafts</p>
              </div>
            </button>

            {/* Seller Option */}
            <button
              onClick={() => setRole('seller')}
              className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left flex items-center space-x-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-700">Login as Artisan / Seller</p>
                <p className="text-[11px] text-slate-500">Access seller portal, studio tools, and manage orders</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2A: Buyer Flow (Directly loads product catalog)
  if (role === 'buyer') {
    return (
      <div>
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium">
          <span>Shopping Mode (Buyer View)</span>
          <button 
            onClick={() => setRole(null)}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
        </div>
        <App />
      </div>
    );
  }

  // Step 2B: Seller Login Flow
  if (!isLoggedIn) {
    return (
      <div className="relative">
        <button 
          onClick={() => setRole(null)}
          className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to selection</span>
        </button>
        <SellerLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // Step 3: Seller Dashboard / Studio
  if (currentView === 'dashboard') {
    return (
      <SellerDashboard 
        onLogout={() => {
          setIsLoggedIn(false);
          setRole(null);
        }} 
        onNavigateToStudio={() => setCurrentView('studio')} 
      />
    );
  }

  return <App />;
}