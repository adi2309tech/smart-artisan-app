import React, { useState } from 'react';
import { 
  Search, Filter, Sparkles, Heart, ShoppingCart, Star, 
  MapPin, ShieldCheck, ArrowRight, Award, Compass, RefreshCw
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
  },
  {
    id: 4,
    title: "Bidriware Silver Inlay Metal Flower Vase",
    artisan: "Shahid Ali",
    location: "Bidar, Karnataka",
    price: 4200,
    rating: 4.9,
    reviews: 53,
    category: "Metalcraft",
    badge: "GI Tagged",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800",
    description: "Zinc and copper alloy body darkened with soil from Bidar Fort, inlaid with pure 99.9% fine silver wire."
  },
  {
    id: 5,
    title: "Hand-Painted Madhubani Folk Art Canvas",
    artisan: "Gauri Mishra",
    location: "Madhubani, Bihar",
    price: 2800,
    rating: 4.7,
    reviews: 82,
    category: "Paintings",
    badge: "Folk Heritage",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    description: "Painted using twigs, nibs, and natural dyes derived from indigo, turmeric, and marigold flowers."
  },
  {
    id: 6,
    title: "Kashmiri Pashmina Hand-Embroidered Shawl",
    artisan: "Ghulam Hassan",
    location: "Srinagar, Kashmir",
    price: 12500,
    rating: 5.0,
    reviews: 110,
    category: "Textiles",
    badge: "Pashmina Certified",
    image: "https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&q=80&w=800",
    description: "Hand-spun Changthangi goat wool with needle Sozni embroidery done painstaking over two months."
  },
  {
    id: 7,
    title: "Dhokra Brass Tribal Figurine Candle Stand",
    artisan: "Somnath Baghel",
    location: "Bastar, Chhattisgarh",
    price: 1850,
    rating: 4.8,
    reviews: 41,
    category: "Metalcraft",
    badge: "Ancient Technique",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800",
    description: "Non-ferrous metal casting using the 4,000-year-old lost-wax technique passed through tribal generations."
  },
  {
    id: 8,
    title: "Hand-Block Printed Chanderi Cotton Dupatta",
    artisan: "Anand Khatri",
    location: "Bagh, Madhya Pradesh",
    price: 1650,
    rating: 4.6,
    reviews: 76,
    category: "Textiles",
    badge: "Natural Dyes",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    description: "Block printed with carved teak wood blocks using vegetable-based pigments on sheer Chanderi silk-cotton."
  },
  {
    id: 9,
    title: "Blue Pottery Hand-Carved Ceramic Plate",
    artisan: "Kripal Singh Guild",
    location: "Jaipur, Rajasthan",
    price: 2100,
    rating: 4.9,
    reviews: 89,
    category: "Pottery",
    badge: "GI Tagged",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
    description: "Turquoise blue ceramic crafted without clay using quartz stone powder, raw glaze, and gum."
  },
  {
    id: 10,
    title: "Kondapalli Wooden Traditional Musician Set",
    artisan: "V. Satyanarayana",
    location: "Vijayawada, Andhra Pradesh",
    price: 2400,
    rating: 4.7,
    reviews: 35,
    category: "Woodwork",
    badge: "Heritage Toy",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    description: "Carved out of soft Tella Poniki wood and painted with non-toxic oil and enamel colors depicting classical musicians."
  }
];

export default function App({ _lang = 'en', onBackToDashboard }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['All', 'Pottery', 'Textiles', 'Woodwork', 'Metalcraft', 'Paintings'];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Indian Heritage Heritage Warm Ambient Glows */}
      <div className="fixed top-0 left-1/3 w-[700px] h-[350px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-rose-600/10 blur-[140px] pointer-events-none" />

      {/* Main Header Navbar */}
      <header className="sticky top-10 z-40 bg-[#111425]/90 backdrop-blur-xl border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  SmartArtisan <span className="text-amber-400 font-normal text-xs px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">भारत Direct</span>
                </h1>
                <p className="text-[10px] font-bold text-amber-500/80 tracking-widest uppercase">Traditional Craft Linkage Engine</p>
              </div>
            </div>

            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className="md:hidden px-3 py-1.5 bg-slate-800 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-300"
              >
                Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 flex-1 md:max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-amber-500/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Banarasi silk, Jaipur pottery, Madhubani..."
                className="w-full pl-10 pr-4 py-2 bg-[#080911]/90 border border-amber-500/20 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
              />
            </div>

            <button className="relative p-2.5 bg-[#080911] border border-amber-500/30 hover:border-amber-500 rounded-xl text-slate-300 hover:text-amber-400 transition-all shrink-0">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className="hidden md:flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-600/20 shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 space-y-10">
        
        {/* Rich Hero Feature Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#181b30] via-[#121425] to-[#0b0d17] border border-amber-500/30 p-8 md:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Geographical Indication (GI) Certified Artisans</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Authentic Heritage, <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Direct From Master Craftsmen.
                </span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Connecting over 50,000+ rural Indian artisans directly with global patrons. Zero middleman margins, guaranteed provenance, and fair trade economic sustainability.
              </p>

              {/* Stats Strip */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-amber-500/20 max-w-lg">
                <div>
                  <p className="text-xl font-black text-amber-400">100%</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Direct Payouts</p>
                </div>
                <div>
                  <p className="text-xl font-black text-amber-400">28</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Indian States</p>
                </div>
                <div>
                  <p className="text-xl font-black text-amber-400">400+</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">GI Craft Clusters</p>
                </div>
              </div>
            </div>

            {/* Cultural Badge Column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#090b14]/80 border border-amber-500/20 rounded-2xl text-center space-y-3">
              <Award className="w-12 h-12 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Government GI Tag Compliant</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Every handicraft carries a digital cryptographic certificate verifying craft cluster coordinates and master weaver heritage.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-slate-200 tracking-wide uppercase">Explore Regional Craft Traditions</h3>
            </div>
            <span className="text-xs text-amber-400/80 font-bold">{filteredProducts.length} Authenticated Masterpieces</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 pr-3 border-r border-amber-500/20 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Category:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20' 
                    : 'bg-[#111425] border border-amber-500/20 text-slate-300 hover:text-white hover:border-amber-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-[#111425]/70 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/40 flex flex-col justify-between"
            >
              {/* Product Image Container */}
              <div className="relative h-52 overflow-hidden bg-[#080911]">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111425] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-[#080911]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 font-black text-[10px] rounded-lg tracking-wider uppercase">
                    {product.badge}
                  </span>
                </div>

                <button className="absolute top-3 right-3 p-2 bg-[#080911]/80 backdrop-blur-md border border-amber-500/30 rounded-xl text-slate-400 hover:text-rose-400 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-[11px] font-bold text-amber-200/90">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{product.location}</span>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-amber-400 tracking-wide">{product.artisan}</span>
                    <div className="flex items-center space-x-1 text-amber-400 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-500 font-normal text-[10px]">({product.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-100 text-sm leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Purchase Bar */}
                <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Master Weaver Direct</span>
                    <span className="text-lg font-black text-amber-400">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button 
                    onClick={() => setCartCount(prev => prev + 1)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Buy Direct</span>
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