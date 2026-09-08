import React, { useState, useRef } from 'react';
import { 
  Upload, Sparkles, AlertCircle, 
  CheckCircle2, LogOut, ArrowRight, RefreshCw, X, Tag, IndianRupee, Palette, ShoppingBag, Mic, MicOff 
} from 'lucide-react';

const REMOVE_BG_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

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

const applyStudioBackground = (transparentFile, styleId) => {
  return new Promise((resolve, reject) => {
    if (styleId === 'transparent') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(transparentFile);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(transparentFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const CANVAS_SIZE = 1080;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;

      let gradient;
      switch (styleId) {
        case 'dark_studio':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.4, CANVAS_SIZE * 0.1, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.85);
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(0.5, '#1e293b');
          gradient.addColorStop(1, '#0f172a');
          break;
        case 'clean_white':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.3, CANVAS_SIZE * 0.1, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.85);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.7, '#f1f5f9');
          gradient.addColorStop(1, '#e2e8f0');
          break;
        case 'warm_amber':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.4, CANVAS_SIZE * 0.1, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.85);
          gradient.addColorStop(0, '#78350f');
          gradient.addColorStop(0.6, '#451a03');
          gradient.addColorStop(1, '#1c1917');
          break;
        case 'spotlight':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.35, CANVAS_SIZE * 0.05, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.7);
          gradient.addColorStop(0, '#64748b');
          gradient.addColorStop(0.3, '#1e293b');
          gradient.addColorStop(1, '#020617');
          break;
        case 'pastel_pink':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.3, CANVAS_SIZE * 0.1, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.85);
          gradient.addColorStop(0, '#fdf2f8');
          gradient.addColorStop(0.6, '#fce7f3');
          gradient.addColorStop(1, '#fbcfe8');
          break;
        case 'soft_sage':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.3, CANVAS_SIZE * 0.1, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.85);
          gradient.addColorStop(0, '#f0fdf4');
          gradient.addColorStop(0.6, '#dcfce7');
          gradient.addColorStop(1, '#bbf7d0');
          break;
        case 'luxury_gold':
          gradient = ctx.createRadialGradient(CANVAS_SIZE / 2, CANVAS_SIZE * 0.35, CANVAS_SIZE * 0.08, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.9);
          gradient.addColorStop(0, '#b45309');
          gradient.addColorStop(0.5, '#78350f');
          gradient.addColorStop(1, '#0f172a');
          break;
        default:
          ctx.fillStyle = '#ffffff';
      }
      ctx.fillStyle = gradient || '#ffffff';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const shadowY = CANVAS_SIZE * 0.74;
      const isLightBg = ['clean_white', 'pastel_pink', 'soft_sage'].includes(styleId);
      const shadowGradient = ctx.createRadialGradient(CANVAS_SIZE / 2, shadowY, 5, CANVAS_SIZE / 2, shadowY, CANVAS_SIZE * 0.38);
      shadowGradient.addColorStop(0, isLightBg ? 'rgba(15, 23, 42, 0.22)' : 'rgba(0, 0, 0, 0.7)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(CANVAS_SIZE / 2, shadowY, CANVAS_SIZE * 0.36, CANVAS_SIZE * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const padding = CANVAS_SIZE * 0.15;
      const maxDrawWidth = CANVAS_SIZE - padding * 2;
      const maxDrawHeight = CANVAS_SIZE - padding * 2;
      
      const scale = Math.min(maxDrawWidth / img.width, maxDrawHeight / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const drawX = (CANVAS_SIZE - drawWidth) / 2;
      const drawY = (CANVAS_SIZE - drawHeight) / 2;
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      resolve(dataUrl);
    };

    img.onerror = (err) => reject(err);
  });
};

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
  const [isListening, setIsListening] = useState(false);

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

  const translateToEnglishDescription = async (spokenText) => {
    if (!GEMINI_API_KEY) return spokenText;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Translate the following text spoken by a seller into clear, professional, concise English for an e-commerce product description. Output translated description text only without extra comments: "${spokenText}"` }] }]
          })
        }
      );
      if (!response.ok) return spokenText;
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || spokenText;
    } catch {
      return spokenText;
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage("Listening... Speak in any language.");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setStatusMessage("Translating voice input to English...");
      setIsProcessing(true);
      
      const englishDescription = await translateToEnglishDescription(transcript);
      setProductDetails((prev) => ({ ...prev, description: englishDescription }));
      setIsProcessing(false);
      setStatusMessage("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setErrorMsg("Voice input error. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
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

    if (!response.ok) throw new Error("Gemini API failed.");
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

      setStatusMessage('Applying 1:1 studio frame...');
      const studioImageDataUrl = await applyStudioBackground(transparentFile, selectedBgStyle);
      setProcessedImage(studioImageDataUrl);

      setStatusMessage('Analyzing product with AI...');
      const details = await analyzeWithGemini(transparentFile);
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
      const studioImageDataUrl = await applyStudioBackground(cleanBgFile, styleId);
      setProcessedImage(studioImageDataUrl);
    } catch (err) {
      setErrorMsg('Failed to apply background.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setCleanBgFile(null);
    setErrorMsg('');
    setStatusMessage('');
    setPublishSuccess(false);
    setProductDetails({ title: '', category: '', description: '', priceINR: '', tags: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = () => {
    if (!productDetails.title || !processedImage) {
      setErrorMsg("Missing image or product details.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: productDetails.title,
      category: productDetails.category || 'General',
      description: productDetails.description || '',
      price: productDetails.priceINR ? parseFloat(productDetails.priceINR) : 0,
      priceINR: productDetails.priceINR || '0',
      tags: productDetails.tags || [],
      image: processedImage,
      created: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('marketplace_products') || '[]');
    const updatedList = [newProduct, ...existing];
    
    localStorage.setItem('marketplace_products', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));

    if (onPublishProduct) {
      onPublishProduct(newProduct);
    }

    setPublishSuccess(true);
    handleReset();

    setTimeout(() => {
      if (onNavigateToStudio) {
        onNavigateToStudio();
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] p-6 space-y-6">
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
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
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

            {!originalImage ? (
              <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer bg-slate-950/40 transition-all p-6 text-center">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="p-3 rounded-full bg-slate-900 text-amber-400 mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-300">Upload Product Photo</p>
                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or WEBP (Standard 1:1 framing)</p>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                    <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="aspect-square rounded-xl bg-slate-950 border border-amber-500/40 p-2 flex items-center justify-center">
                    {processedImage ? (
                      <img src={processedImage} alt="Studio Output" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                    )}
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
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={productDetails.priceINR}
                      onChange={(e) => setProductDetails({ ...productDetails, priceINR: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">Description</label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                      isListening
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isListening ? 'Listening...' : 'Speak (Auto-Translate)'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={productDetails.description}
                  onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                  placeholder="Describe your product or click the mic button to speak in any language..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Generated Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {productDetails.tags && productDetails.tags.length > 0 ? (
                    productDetails.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-lg font-medium">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">No tags generated yet</span>
                  )}
                </div>
              </div>
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Product published! Redirecting to marketplace...</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!processedImage || isProcessing}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish & View Marketplace
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}