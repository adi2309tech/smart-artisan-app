import React, { useState, useRef } from 'react';
import { 
  Upload, Sparkles, Image as ImageIcon, AlertCircle, 
  CheckCircle2, LogOut, ArrowRight, RefreshCw, X, Tag, IndianRupee, Palette, ShoppingBag 
} from 'lucide-react';

const REMOVE_BG_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper: Convert File to Base64 for Gemini Vision
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

// Studio Background Options
const BG_STYLES = [
  { id: 'dark_studio', name: 'Dark Studio', color: '#1e293b' },
  { id: 'clean_white', name: 'Clean White', color: '#ffffff' },
  { id: 'warm_amber', name: 'Warm Amber', color: '#78350f' },
  { id: 'spotlight', name: 'Spotlight Stage', color: '#090d16' },
  { id: 'pastel_pink', name: 'Pastel Blush', color: '#fbcfe8' },
  { id: 'soft_sage', name: 'Soft Sage', color: '#d1fae5' },
  { id: 'luxury_gold', name: 'Luxury Gold', color: '#b45309' },
  { id: 'transparent', name: 'Transparent', color: 'transparent' }
];

// Composite Selected Background onto Transformed Image
const applyStudioBackground = (transparentFile, styleId) => {
  return new Promise((resolve, reject) => {
    if (styleId === 'transparent') {
      resolve(transparentFile);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(transparentFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const size = Math.max(img.width, img.height, 1080);
      canvas.width = size;
      canvas.height = size;

      // Draw Background
      let gradient;
      switch (styleId) {
        case 'dark_studio':
          gradient = ctx.createRadialGradient(size / 2, size * 0.4, size * 0.1, size / 2, size / 2, size * 0.85);
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(0.5, '#1e293b');
          gradient.addColorStop(1, '#0f172a');
          break;
        case 'clean_white':
          gradient = ctx.createRadialGradient(size / 2, size * 0.3, size * 0.1, size / 2, size / 2, size * 0.85);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.7, '#f1f5f9');
          gradient.addColorStop(1, '#e2e8f0');
          break;
        case 'warm_amber':
          gradient = ctx.createRadialGradient(size / 2, size * 0.4, size * 0.1, size / 2, size / 2, size * 0.85);
          gradient.addColorStop(0, '#78350f');
          gradient.addColorStop(0.6, '#451a03');
          gradient.addColorStop(1, '#1c1917');
          break;
        case 'spotlight':
          gradient = ctx.createRadialGradient(size / 2, size * 0.35, size * 0.05, size / 2, size / 2, size * 0.7);
          gradient.addColorStop(0, '#64748b');
          gradient.addColorStop(0.3, '#1e293b');
          gradient.addColorStop(1, '#020617');
          break;
        case 'pastel_pink':
          gradient = ctx.createRadialGradient(size / 2, size * 0.3, size * 0.1, size / 2, size / 2, size * 0.85);
          gradient.addColorStop(0, '#fdf2f8');
          gradient.addColorStop(0.6, '#fce7f3');
          gradient.addColorStop(1, '#fbcfe8');
          break;
        case 'soft_sage':
          gradient = ctx.createRadialGradient(size / 2, size * 0.3, size * 0.1, size / 2, size / 2, size * 0.85);
          gradient.addColorStop(0, '#f0fdf4');
          gradient.addColorStop(0.6, '#dcfce7');
          gradient.addColorStop(1, '#bbf7d0');
          break;
        case 'luxury_gold':
          gradient = ctx.createRadialGradient(size / 2, size * 0.35, size * 0.08, size / 2, size / 2, size * 0.9);
          gradient.addColorStop(0, '#b45309');
          gradient.addColorStop(0.5, '#78350f');
          gradient.addColorStop(1, '#0f172a');
          break;
        default:
          ctx.fillStyle = '#ffffff';
      }
      ctx.fillStyle = gradient || '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Draw Shadow
      const shadowY = size * 0.74;
      const isLightBg = ['clean_white', 'pastel_pink', 'soft_sage'].includes(styleId);
      const shadowGradient = ctx.createRadialGradient(size / 2, shadowY, 5, size / 2, shadowY, size * 0.38);
      shadowGradient.addColorStop(0, isLightBg ? 'rgba(15, 23, 42, 0.22)' : 'rgba(0, 0, 0, 0.7)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(size / 2, shadowY, size * 0.36, size * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Scaled Image
      const padding = size * 0.16;
      const maxDrawWidth = size - padding * 2;
      const maxDrawHeight = size - padding * 2;
      let drawWidth = img.width;
      let drawHeight = img.height;
      const scale = Math.min(maxDrawWidth / drawWidth, maxDrawHeight / drawHeight);
      drawWidth *= scale;
      drawHeight *= scale;

      const drawX = (size - drawWidth) / 2;
      const drawY = (size - drawHeight) / 2;
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to render backdrop"));
        const studioFile = new File([blob], `studio_${transparentFile.name}`, { type: 'image/jpeg' });
        resolve(studioFile);
      }, 'image/jpeg', 0.95);
    };

    img.onerror = (err) => reject(err);
  });
};

export default function SellerDashboard({ onLogout, onNavigateToStudio, onPublishProduct }) {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [cleanBgFile, setCleanBgFile] = useState(null);
  const [selectedBgStyle, setSelectedBgStyle] = useState('dark_studio');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [productDetails, setProductDetails] = useState({
    title: '',
    category: '',
    description: '',
    priceINR: '',
    tags: []
  });

  const fileInputRef = useRef(null);

  const processRemoveBg = async (file) => {
    if (!REMOVE_BG_KEY) throw new Error("Missing Remove.bg API Key.");
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': REMOVE_BG_KEY },
      body: formData,
    });

    if (!response.ok) throw new Error("Background removal failed.");
    const blob = await response.blob();
    return new File([blob], `bg_removed_${file.name}`, { type: 'image/png' });
  };

  const analyzeWithGemini = async (imageFile) => {
    if (!GEMINI_API_KEY) throw new Error("Missing Gemini API Key.");
    const base64Data = await fileToBase64(imageFile);

    const promptText = `Analyze product image. Output JSON only:
    {
      "title": "Marketing title",
      "category": "E-commerce category",
      "description": "Short description",
      "priceINR": "1499",
      "tags": ["tag1", "tag2"]
    }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: imageFile.type, data: base64Data } }] }]
        })
      }
    );

    if (!response.ok) throw new Error("Gemini AI failed.");
    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { title: 'New Product', category: 'General', description: '', priceINR: '999', tags: [] };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setPublishSuccess(false);
    setIsProcessing(true);
    setOriginalFile(file);
    setOriginalImage(URL.createObjectURL(file));

    try {
      setStatusMessage('Removing background...');
      const transparentFile = await processRemoveBg(file);
      setCleanBgFile(transparentFile);

      setStatusMessage('Applying background studio...');
      const studioImageFile = await applyStudioBackground(transparentFile, selectedBgStyle);
      setProcessedImage(URL.createObjectURL(studioImageFile));

      setStatusMessage('Analyzing product with AI...');
      const details = await analyzeWithGemini(studioImageFile);
      setProductDetails(details);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStyleChange = async (styleId) => {
    setSelectedBgStyle(styleId);
    if (!cleanBgFile) return;

    setIsProcessing(true);
    try {
      setStatusMessage('Updating background studio...');
      const studioImageFile = await applyStudioBackground(cleanBgFile, styleId);
      setProcessedImage(URL.createObjectURL(studioImageFile));
    } catch (err) {
      setErrorMsg('Failed to apply background.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = () => {
    if (!productDetails.title || !processedImage) {
      setErrorMsg("Missing image or product details.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...productDetails,
      image: processedImage,
      created: new Date().toISOString()
    };

    // 1. Save to Local Storage Marketplace
    const existing = JSON.parse(localStorage.getItem('marketplace_products') || '[]');
    localStorage.setItem('marketplace_products', JSON.stringify([newProduct, ...existing]));

    // 2. Trigger parent callback if provided
    if (onPublishProduct) {
      onPublishProduct(newProduct);
    }

    setPublishSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] p-6 space-y-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Seller Studio Pro</h1>
            <p className="text-xs text-slate-400">Image Background Studio & Marketplace Publisher</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onNavigateToStudio} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold">
            View Marketplace
          </button>
          <button onClick={onLogout} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Background Selector + Image Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* BACKGROUND SELECTION OPTION (ALWAYS VISIBLE) */}
            <div>
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Palette className="w-4 h-4" /> 1. Select Background Preset
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BG_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleStyleChange(style.id)}
                    className={`p-2 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 border transition-all ${
                      selectedBgStyle === style.id
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: style.color }} />
                    <span className="truncate w-full text-center">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPLOAD ZONE */}
            {!originalImage ? (
              <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer bg-slate-950/40 transition-all p-6 text-center">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="p-3 rounded-full bg-slate-900 text-amber-400 mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-300">Upload Product Photo</p>
                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or WEBP</p>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-40 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                    <img src={originalImage} alt="Original" className="max-h-full object-contain" />
                  </div>
                  <div className="h-40 rounded-xl bg-slate-950 border border-amber-500/40 p-2 flex items-center justify-center">
                    {processedImage ? (
                      <img src={processedImage} alt="Studio Output" className="max-h-full object-contain" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details & Publish */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" /> Marketplace Listing Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={productDetails.title}
                  onChange={(e) => setProductDetails({ ...productDetails, title: e.target.value })}
                  placeholder="Product Title"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={productDetails.category}
                    onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={productDetails.priceINR}
                    onChange={(e) => setProductDetails({ ...productDetails, priceINR: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productDetails.description}
                  onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Product published successfully to the marketplace!</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!processedImage || isProcessing}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish to Marketplace
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}