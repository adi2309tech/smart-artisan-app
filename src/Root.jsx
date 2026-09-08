import React, { useState, useEffect } from 'react';
import App from './App';
import SellerDashboard, { SellerLogin } from './SellerDashboard';
import { Sparkles, ShoppingBag, Store, Globe } from 'lucide-react';

export default function Root() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('smart_artisan_view') || 'onboarding';
  });
  
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('smart_artisan_lang') || 'en';
  });

  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(() => {
    return localStorage.getItem('smart_artisan_seller_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('smart_artisan_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('smart_artisan_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('smart_artisan_seller_auth', isSellerLoggedIn);
  }, [isSellerLoggedIn]);

  const handleSellerLogout = () => {
    setIsSellerLoggedIn(false);
    localStorage.removeItem('smart_artisan_seller_auth');
    setCurrentView('onboarding');
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Global Heritage Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080911]/90 backdrop-blur-xl border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('onboarding')}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border border-amber-300/30 shadow-md shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <span className="text-xs font-black tracking-wider text-white">SmartArtisan <span className="text-amber-400 font-normal">भारत</span></span>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center space-x-2 bg-[#111425] px-3 py-1 rounded-xl border border-amber-500/20">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-[11px] font-bold text-amber-300 focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-[#111425] text-slate-200">English (EN)</option>
            <option value="hi" className="bg-[#111425] text-slate-200">हिंदी (Hindi)</option>
            <option value="bn" className="bg-[#111425] text-slate-200">বাংলা (Bengali)</option>
            <option value="ta" className="bg-[#111425] text-slate-200">தமிழ் (Tamil)</option>
          </select>
        </div>
      </nav>

      {/* View Router */}
      <div className="pt-12">
        {currentView === 'onboarding' && (
          <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-[140px] pointer-events-none" />

            <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI-Driven Traditional Craft Linkage Ecosystem</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  Welcome to <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                    SmartArtisan Direct
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Choose your gateway below to explore verified GI regional craft listings or access the artisan studio management platform.
                </p>
              </div>

              {/* Portal Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left">
                {/* Buyer Portal Card */}
                <div 
                  onClick={() => setCurrentView('buyer')}
                  className="group bg-[#111425]/80 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/70 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-amber-400 group-hover:text-slate-950" />
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">Consumer Marketplace</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Discover authentic GI-certified handicrafts, pure silk weaves, Bidriware, and terracotta direct from master weavers.
                  </p>
                  <div className="mt-6 flex items-center space-x-2 text-xs font-black text-amber-400">
                    <span>Enter Marketplace</span>
                    <span>&rarr;</span>
                  </div>
                </div>

                {/* Studio Portal Card */}
                <div 
                  onClick={() => setCurrentView('seller')}
                  className="group bg-[#111425]/80 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/70 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Store className="w-6 h-6 text-amber-400 group-hover:text-slate-950" />
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">Artisan Studio Hub</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Portal for verified artisans to manage live inventories, direct payouts, international export orders, and pricing.
                  </p>
                  <div className="mt-6 flex items-center space-x-2 text-xs font-black text-amber-400">
                    <span>Access Studio Workspace</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consumer Marketplace View */}
        {currentView === 'buyer' && (
          <App _lang={lang} onBackToDashboard={() => setCurrentView('onboarding')} />
        )}

        {/* Master Artisan Studio View */}
        {currentView === 'seller' && (
          isSellerLoggedIn ? (
            <SellerDashboard 
              _lang={lang} 
              onLogout={handleSellerLogout}
              onNavigateToStudio={() => setCurrentView('onboarding')}
            />
          ) : (
            <SellerLogin onLoginSuccess={() => setIsSellerLoggedIn(true)} />
          )
        )}
      </div>
    </div>
  );
}