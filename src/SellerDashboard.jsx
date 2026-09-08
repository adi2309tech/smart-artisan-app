import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Store, Package, TrendingUp, DollarSign, Sparkles, 
  Globe, LogOut, ArrowRight, ShieldCheck, CheckCircle2, Mic, MicOff, Image as ImageIcon,
  Bot, RefreshCw, Scissors
} from 'lucide-react';

// Initialize Gemini API using your existing environment variable
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Optional Background Removal API Key (e.g., remove.bg)
const REMOVE_BG_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;

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

export default function SellerDashboard({ _lang = 'en', onLogout, onNavigateToStudio }) {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pottery');
  const [description, setDescription] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Processing States
  const [isRecording, setIsRecording] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [aiError, setAiError] = useState('');

  // Audio Recording Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Remove Background Utility Function
  const removeBackground = async (file) => {
    if (!REMOVE_BG_KEY) return file; // Skip if no API key provided

    setIsRemovingBg(true);
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': REMOVE_BG_KEY },
        body: formData,
      });

      if (!response.ok) throw new Error('Background removal failed');

      const blob = await response.blob();
      return new File([blob], file.name.replace(/\.[^/.]+$/, "") + "_no_bg.png", { type: 'image/png' });
    } catch (err) {
      console.warn("Background removal skipped/failed:", err);
      return file; // Fallback to original image
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Convert File to Gemini Base64 Format
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // 1. Image Processing & Vision Analysis via Gemini
  const handleImageUpload = async (e) => {
    const originalFile = e.target.files[0];
    if (!originalFile) return;

    setAiError('');
    setIsAiAnalyzing(true);

    try {
      // Step A: Process Background Removal (if key exists)
      const processedFile = await removeBackground(originalFile);

      // Display Preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(processedFile);

      // Step B: Send to Gemini Vision API
      const imagePart = await fileToGenerativePart(processedFile);
      
      const prompt = `Analyze this handicraft image and respond ONLY with a strict valid JSON object in this exact format:
      {
        "title": "A short descriptive title for this artisan craft",
        "category": "Choose one: Pottery, Textiles, Woodwork, Metalcraft",
        "description": "A compelling 2-3 sentence story and technique description for marketing this craft globally",
        "suggestedPrice": "Estimated fair artisan price in INR as an integer, e.g. 2400"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, imagePart]
      });

      const responseText = response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.suggestedPrice) setSuggestedPrice(String(parsed.suggestedPrice));
      }
    } catch (err) {
      console.error("Image Processing Error:", err);
      setAiError("Failed to analyze image.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // 2. Audio Transcription via Gemini API
  const startRecording = async () => {
    setAiError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioWithGemini(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Audio recording permission error:", err);
      setAiError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudioWithGemini = async (audioBlob) => {
    setIsAiAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        const audioPart = {
          inlineData: {
            data: base64Audio,
            mimeType: audioBlob.type || 'audio/webm'
          }
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            "Transcribe this voice recording into clear product description text in English, capturing the artisan's details:",
            audioPart
          ]
        });

        if (response.text) {
          setDescription((prev) => prev ? `${prev}\n\n${response.text}` : response.text);
        }
      };
    } catch (err) {
      console.error("Gemini Audio Transcription Error:", err);
      setAiError("Audio transcription failed.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!title || !suggestedPrice) return;

    const newItem = {
      id: Date.now(),
      title,
      category,
      price: Number(suggestedPrice),
      stock: Number(stock),
      sales: 0,
      status: "Active",
      badge: "AI Verified"
    };

    setInventory([newItem, ...inventory]);
    setTitle('');
    setDescription('');
    setSuggestedPrice('');
    setImagePreview(null);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
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
              <span>Portal Home</span>
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
        
        {/* Metric Cards */}
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
            <p className="text-[10px] font-bold text-slate-400">Across active catalog</p>
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

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Active Craft Listings</h2>
            <p className="text-xs text-slate-400">Manage real-time prices, stock levels, and Gemini AI listings</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-90 text-slate-950 rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Product Upload</span>
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

      {/* Product Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#111425] border border-amber-500/30 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Gemini Listing Studio</h3>
              </div>
              <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                {(isAiAnalyzing || isRemovingBg) && <RefreshCw className="w-3 h-3 animate-spin" />}
                {isRemovingBg ? 'Removing Background...' : isAiAnalyzing ? 'Gemini Vision Active...' : 'Ready'}
              </span>
            </div>

            {aiError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {aiError}
              </div>
            )}
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              
              {/* Image Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    1. Upload Photo (Background Removal + Gemini AI)
                  </label>
                  {REMOVE_BG_KEY && (
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <Scissors className="w-2.5 h-2.5" /> Auto BG Remover Enabled
                    </span>
                  )}
                </div>

                <div className="border-2 border-dashed border-amber-500/30 hover:border-amber-500/80 rounded-2xl p-4 text-center cursor-pointer bg-[#080911]/60 transition-all relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-[radial-gradient(#1e2238_1px,transparent_1px)] [background-size:16px_16px]">
                      <img src={imagePreview} alt="Craft Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <ImageIcon className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-xs font-extrabold text-slate-200">Click or Drag Photo to Analyze</p>
                      <p className="text-[10px] text-slate-500">Auto-removes background and generates product details</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Craft Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Auto-generated by Gemini API..."
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Craft Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pottery">Pottery</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Metalcraft">Metalcraft</option>
                  </select>
                </div>
              </div>

              {/* Audio Recording Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    2. Voice-to-Description (Microphone Input)
                  </label>
                  <button 
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isRecording ? 'Stop Recording' : 'Record Audio Note'}</span>
                  </button>
                </div>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Generated description from uploaded image or voice note..."
                  className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    3. Recommended Price (₹)
                  </label>
                  <input 
                    type="number" 
                    required
                    value={suggestedPrice}
                    onChange={(e) => setSuggestedPrice(e.target.value)}
                    placeholder="Estimated by Gemini..."
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs font-black text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-amber-500/20 flex items-center justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#080911] border border-amber-500/20 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1"
                >
                  <span>Publish Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}