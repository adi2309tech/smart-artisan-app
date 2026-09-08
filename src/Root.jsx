import { useState, useEffect } from 'react';
import App from './App.jsx';
import SellerDashboard, { SellerLogin } from './SellerDashboard.jsx';
import { ShoppingBag, Store, ArrowLeft, Globe, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';

const translations = {
  en: {
    badge: "Smart Artisan OS v2.4",
    title: "Empowering Local Craftsmanship",
    subtitle: "Select your workspace workspace environment to enter the portal",
    buyerTitle: "Consumer Marketplace",
    buyerDesc: "Discover, authenticate, and acquire handcrafted artisanal goods directly from verified creators.",
    sellerTitle: "Artisan Commerce Hub",
    sellerDesc: "Manage inventory, leverage AI listing tools, track cross-border orders, and review analytics.",
    enterPortal: "Launch Portal",
    buyerMode: "Marketplace View (Consumer)",
    switchRole: "Change Environment",
    backToSelect: "Return to Terminal",
  },
  hi: {
    badge: "स्मार्ट कारीगर ओएस v2.4",
    title: "स्थानीय कारीगरी का सशक्तिकरण",
    subtitle: "पोर्टल में प्रवेश करने के लिए अपना कार्यक्षेत्र वातावरण चुनें",
    buyerTitle: "उपभोक्ता बाज़ार",
    buyerDesc: "सत्यापित निर्माताओं से सीधे हस्तनिर्मित कलाकृतियों की खोज और खरीद करें।",
    sellerTitle: "कारीगर वाणिज्य हब",
    sellerDesc: "इन्वेंट्री प्रबंधित करें, एआई टूल्स का उपयोग करें और ऑर्डर ट्रैक करें।",
    enterPortal: "पोर्टल शुरू करें",
    buyerMode: "बाज़ार दृश्य (उपभोक्ता)",
    switchRole: "वातावरण बदलें",
    backToSelect: "टर्मिनल पर लौटें",
  },
  bn: {
    badge: "স্মার্ট কারিগর ওএস v2.4",
    title: "স্থানীয় কারুশিল্পের ক্ষমতায়ন",
    subtitle: "পোর্টাল অ্যাক্সেস করতে আপনার ওয়ার্কস্পেস নির্বাচন করুন",
    buyerTitle: "ক্রেতা মার্কেটপ্লেস",
    buyerDesc: "যাচাইকৃত কারিগরদের কাছ থেকে সরাসরি হস্তশিল্প খুঁজুন এবং সংগ্রহ করুন।",
    sellerTitle: "কারিগর কমার্স হাব",
    sellerDesc: "ইনভেন্টরি পরিচালনা করুন, এআই সরঞ্জাম ব্যবহার করুন এবং অর্ডার ট্র্যাক করুন।",
    enterPortal: "পোর্টাল চালু করুন",
    buyerMode: "মার্কেটপ্লেস ভিউ (ক্রেতা)",
    switchRole: "এনভায়রনমেন্ট পরিবর্তন করুন",
    backToSelect: "টার্মিনালে ফিরে যান",
  },
  ta: {
    badge: "ஸ்மார்ட் ஆர்ட்டிசன் OS v2.4",
    title: "உள்ளூர் கைவினைத்திறன் மேலாண்மை",
    subtitle: "போர்ட்டலில் நுழைய உங்கள் பணியிட சூழலைத் தேர்ந்தெடுக்கவும்",
    buyerTitle: "நுகர்வோர் சந்தை",
    buyerDesc: "கைவினைப் பொருட்களை நேரடியாகக் கண்டறிந்து வாங்குங்கள்.",
    sellerTitle: "கைவினைஞர் வணிக மையம்",
    sellerDesc: "சரக்குகளை நிர்வகிக்கவும், AI கருவிகளைப் பயன்படுத்தவும்.",
    enterPortal: "போர்ட்டலைத் தொடங்கு",
    buyerMode: "சந்தை பார்வை (நுகர்வோர்)",
    switchRole: "சூழலை மாற்றவும்",
    backToSelect: "முந்தைய பக்கத்திற்குச் செல்",
  }
};

function LanguagePicker({ lang, onLanguageChange }) {
  return (
    <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-full shadow-inner">
      <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      <select
        value={lang}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-transparent font-semibold text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
      >
        <option value="en" className="bg-slate-900 text-slate-200">English (US)</option>
        <option value="hi" className="bg-slate-900 text-slate-200">हिंदी (HI)</option>
        <option value="bn" className="bg-slate-900 text-slate-200">বাংলা (BN)</option>
        <option value="ta" className="bg-slate-900 text-slate-200">தமிழ் (TA)</option>
      </select>
    </div>
  );
}

export default function Root() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.en;

  // Step 1: Role Selection Portal
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Navigation */}
        <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-300/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              SmartArtisan
            </span>
          </div>
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </header>

        {/* Hero & Selection Core */}
        <main className="w-full max-w-4xl mx-auto my-auto py-12 z-10">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              {t.title}
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto font-normal leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Card */}
            <div 
              onClick={() => setRole('buyer')}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/40 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {t.buyerTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal mb-8">
                  {t.buyerDesc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-semibold text-emerald-400">
                <span>{t.enterPortal}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Seller Card */}
            <div 
              onClick={() => setRole('seller')}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {t.sellerTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal mb-8">
                  {t.sellerDesc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-semibold text-indigo-400">
                <span>{t.enterPortal}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </main>

        {/* Enterprise Footer */}
        <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] border-t border-slate-900 pt-6 gap-2 z-10">
          <span>&copy; 2026 SmartArtisan Engine Inc. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Security Protocol</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">API Status</span>
          </div>
        </footer>
      </div>
    );
  }

  // Step 2A: Buyer Portal Shell
  if (role === 'buyer') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">{t.buyerMode}</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <LanguagePicker lang={lang} onLanguageChange={setLang} />
          </div>

          <button 
            onClick={() => setRole(null)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.switchRole}</span>
          </button>
        </nav>
        <App lang={lang} />
      </div>
    );
  }

  // Step 2B: Seller Login Shell
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative">
        <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={() => setRole(null)}
            className="px-3.5 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 flex items-center space-x-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToSelect}</span>
          </button>
        </div>
        
        <div className="absolute top-6 right-6 z-50">
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </div>

        <SellerLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // Step 3: Seller Workspace Shell
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-2 flex items-center justify-end space-x-4">
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </header>
        <SellerDashboard 
          lang={lang}
          onLogout={() => {
            setIsLoggedIn(false);
            setRole(null);
          }} 
          onNavigateToStudio={() => setCurrentView('studio')} 
        />
      </div>
    );
  }

  return <App lang={lang} />;
}