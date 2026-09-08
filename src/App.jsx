import React, { useState } from 'react';
import { 
  Search, Filter, Sparkles, Heart, ShoppingCart, Star, 
  MapPin, ShieldCheck, Tag, ArrowRight, Layers, Eye
} from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Handcrafted Terracotta Clay Water Vessel",
    artisan: "Ramesh Kumar",
    location: "Jaipur, Rajasthan",
    price: 1299,
    rating: 4.9,
    reviews: 128,
    category: "Pottery",
    badge: "GI Tagged",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800",
    description: "Traditional cooling terracotta pot handcrafted using age-old clay molding techniques unique to Rajasthani heritage."
  },
  {
    id: 2,
    title: "Hand-Woven Pure Silk Banarasi Saree",
    artisan: "Sunita Devi",
    location: "Varanasi, Uttar Pradesh",
    price: 8499,
    rating: 5.0,
    reviews: 94,
    category: "Textiles",
    badge: "Heritage Craft",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    description: "Woven with intricate zari brocade work over 3 weeks. Authentic silk mark certified direct from the weaver."
  },
  {
    id: 3,
    title: "Carved Rosewood Elephant Sculpture",
    artisan: "M. Nambiar",
    location: "Wayanad, Kerala",
    price: 3450,
    rating: 4.8,
    reviews: 67,
    category: "Woodwork",
    badge: "Eco-Sustainable",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    description: "Carved out of single-block fallen rosewood timber featuring natural oil polish and fine traditional detail."
  }
];

export default function App({ _lang = 'en', onBackToDashboard }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['All', 'Pottery', 'Textiles', 'Woodwork', 'Metalcraft', 'Jewelry'];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Header Navbar */}
      <header className="sticky top-12 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Navigation Context */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  SmartArtisan Market
                </h1>
                <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">Direct-from-Source Linkage Engine</p>
              </div>
            </div>

            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className="md:hidden px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300"
              >
                Back to Dashboard
              </button>
            )}
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center space-x-3 flex-1 md:max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authentic crafts, artisans, or regions..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
              />
            </div>

            <button className="relative p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all shrink-0">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className="hidden md:flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Category Filters Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 pr-3 border-r border-slate-800 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter By:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/20 p-8 mb-10 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Certified Direct Artisan Linkage</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Support Authentic Indian Artisans Directly
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every purchase removes intermediaries, placing maximum revenue straight into the hands of traditional craftspeople.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/40 flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Category & Verified Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 font-extrabold text-[10px] rounded-lg tracking-wider uppercase">
                    {product.badge}
                  </span>
                </div>

                <button className="absolute top-3 right-3 p-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-rose-400 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-[11px] font-semibold text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{product.location}</span>
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-indigo-400">{product.artisan}</span>
                    <div className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-500 font-normal">({product.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & Add Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Direct Price</span>
                    <span className="text-lg font-black text-white">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button 
                    onClick={() => setCartCount(prev => prev + 1)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}