import React, { useState, useRef } from 'react';
import { 
  Upload, Sparkles, Image as ImageIcon, AlertCircle, 
  CheckCircle2, LogOut, ArrowRight, RefreshCw, X, Tag, IndianRupee 
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

// Helper: Composite Professional Studio Background behind transparent PNG
const applyStudioBackground = (transparentFile) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(transparentFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set standard high-res square dimensions for e-commerce studio look
      const size = Math.max(img.width, img.height, 1080);
      canvas.width = size;
      canvas.height = size;

      // 1. Render Professional Dark Studio Radial Gradient
      const gradient = ctx.createRadialGradient(
        size / 2, size * 0.4, size * 0.1,  // Center spotlight origin
        size / 2, size / 2, size * 0.8     // Radial expansion
      );
      gradient.addColorStop(0, '#2d3748');   // Soft top spotlight highlight
      gradient.addColorStop(0.5, '#1a202c'); // Neutral mid-tone studio gray
      gradient.addColorStop(1, '#0f172a');   // Dark rich outer edge

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // 2. Draw Soft Grounding Shadow beneath product
      const shadowY = size * 0.72;
      const shadowGradient = ctx.createRadialGradient(
        size / 2, shadowY, 10,
        size / 2, shadowY, size * 0.35
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(size / 2, shadowY, size * 0.35, size * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Product Image centered with padding
      const padding = size * 0.15;
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

      // Convert Canvas to File Blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to render professional studio backdrop."));
          return;
        }
        const studioFile = new File([blob], `studio_${transparentFile.name}`, { type: 'image/jpeg' });
        resolve(studioFile);
      }, 'image/jpeg', 0.95);
    };

    img.onerror = (err) => reject(err);
  });
};

// -----------------------------------------------------------------------------
// SELLER LOGIN COMPONENT
// -----------------------------------------------------------------------------
export function SellerLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Seller Studio</h1>
          <p className="text-xs text-slate-400">Sign in to manage inventory and AI image processing</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@store.com"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// MAIN SELLER DASHBOARD COMPONENT
// -----------------------------------------------------------------------------
export default function SellerDashboard({ onLogout, onNavigateToStudio }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Extracted Product Metadata State
  const [productDetails, setProductDetails] = useState({
    title: '',
    category: '',
    description: '',
    priceINR: '',
    tags: []
  });

  const fileInputRef = useRef(null);

  // 1. Strict Remove.bg Handler
  const processRemoveBg = async (file) => {
    if (!REMOVE_BG_KEY) {
      throw new Error("Missing remove.bg API key. Please configure VITE_REMOVE_BG_API_KEY.");
    }

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.errors?.[0]?.title || `Remove.bg API failed with status ${response.status}`);
    }

    const blob = await response.blob();
    return new File([blob], `bg_removed_${file.name}`, { type: 'image/png' });
  };

  // 2. Gemini Vision AI Handler
  const analyzeWithGemini = async (imageFile) => {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key. Please configure VITE_GEMINI_API_KEY.");
    }

    const base64Data = await fileToBase64(imageFile);

    const promptText = `Analyze this studio product image and output strictly a JSON object with:
    {
      "title": "A short marketing title",
      "category": "E-commerce category (e.g., Apparel, Footwear, Electronics)",
      "description": "2-sentence compelling description",
      "priceINR": "Estimated market price in Indian Rupees (number only)",
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error("Gemini AI analysis failed. Check your API key and permissions.");
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Could not parse AI vision response.");
    }
  };

  // 3. Combined Pipeline Executor (Remove.bg -> Studio Canvas -> Gemini)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setIsProcessing(true);
    setOriginalImage(URL.createObjectURL(file));
    setProcessedImage(null);
    setProductDetails({ title: '', category: '', description: '', priceINR: '', tags: [] });

    try {
      // Step A: Strict Background Removal via Remove.bg
      setStatusMessage('Removing original background via Remove.bg API...');
      const transparentFile = await processRemoveBg(file);

      // Step B: Render Professional Studio Backdrop
      setStatusMessage('Applying professional studio backdrop & lighting...');
      const studioImageFile = await applyStudioBackground(transparentFile);
      setProcessedImage(URL.createObjectURL(studioImageFile));

      // Step C: Gemini AI Vision Analysis
      setStatusMessage('Analyzing product details with Gemini AI...');
      const details = await analyzeWithGemini(studioImageFile);
      setProductDetails(details);

      setStatusMessage('Studio Processing Complete!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Image processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setErrorMsg('');
    setStatusMessage('');
    setProductDetails({ title: '', category: '', description: '', priceINR: '', tags: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] p-6 space-y-6">
      {/* Header Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Seller Studio</h1>
            <p className="text-xs text-slate-400">Remove.bg + Studio Backdrop + Gemini AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStudio}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Switch View
          </button>
          <button
            onClick={onLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Studio Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" /> Upload Product Image
            </h2>

            {!originalImage ? (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all p-6 text-center group">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:scale-110 transition-all mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-300">Click to upload product image</p>
                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP (Max 10MB)</p>
                <p className="text-[10px] text-amber-400/80 mt-3 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                  Auto-generates Studio Background & Lighting
                </p>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400">Original Upload</span>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                      <img src={originalImage} alt="Original" className="max-h-full object-contain rounded" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Studio Result
                    </span>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/30 flex items-center justify-center p-2 shadow-lg shadow-amber-500/5">
                      {processedImage ? (
                        <img src={processedImage} alt="Studio Output" className="max-h-full object-contain rounded" />
                      ) : (
                        <div className="text-center p-2">
                          {isProcessing ? (
                            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                          ) : (
                            <span className="text-[10px] text-slate-500">Processing Studio Look...</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Upload Different Image
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Auto-Generated Product Data (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 h-full">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Generated Listing Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  readOnly
                  value={productDetails.title}
                  placeholder="Title will be automatically generated..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    readOnly
                    value={productDetails.category}
                    placeholder="Category"
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Estimated Price (INR)</label>
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      readOnly
                      value={productDetails.priceINR}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Marketing Description</label>
                <textarea
                  rows={3}
                  readOnly
                  value={productDetails.description}
                  placeholder="AI generated product description will appear here..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Generated Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {productDetails.tags && productDetails.tags.length > 0 ? (
                    productDetails.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-lg font-medium"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">No tags generated yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                disabled={!productDetails.title}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Product Listing
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}