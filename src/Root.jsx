import { useState, useEffect } from 'react';
import App from './App.jsx';
import SellerDashboard, { SellerLogin } from './SellerDashboard.jsx';
import { ShoppingBag, Store, ArrowLeft, Globe } from 'lucide-react';

// Simple translations dictionary for core navigation
const translations = {
  en: {
    welcome: "Welcome to Smart Artisan",
    chooseRole: "Please select your account type to continue",
    exploreBuyer: "Explore as Buyer",
    buyerDesc: "Browse and purchase authentic handmade crafts",
    loginSeller: "Login as Artisan / Seller",
    sellerDesc: "Access seller portal, studio tools, and manage orders",
    buyerMode: "Shopping Mode (Buyer View)",
    switchRole: "Switch Role",
    backToSelect: "Back to selection",
  },
  hi: {
    welcome: "स्मार्ट कारीगर (Smart Artisan) में आपका स्वागत है",
    chooseRole: "जारी रखने के लिए कृपया अपना खाता प्रकार चुनें",
    exploreBuyer: "खरीदार के रूप में देखें",
    buyerDesc: "प्रामाणिक हस्तनिर्मित शिल्प खोजें और खरीदें",
    loginSeller: "कारीगर / विक्रेता के रूप में लॉगिन करें",
    sellerDesc: "विक्रेता पोर्टल, स्टूडियो टूल एक्सेस करें और ऑर्डर प्रबंधित करें",
    buyerMode: "खरीदारी मोड (खरीदार दृश्य)",
    switchRole: "भूमिका बदलें",
    backToSelect: "चयन पर वापस जाएं",
  },
  bn: {
    welcome: "স্মার্ট কারিগর-এ স্বাগতম",
    chooseRole: "এগিয়ে যেতে আপনার অ্যাকাউন্টের ধরন নির্বাচন করুন",
    exploreBuyer: "ক্রেতা হিসেবে ব্রাউজ করুন",
    buyerDesc: "হাতে তৈরি খাঁটি শিল্পকর্ম খুঁজুন এবং কিনুন",
    loginSeller: "বিক্রেতা হিসেবে লগইন করুন",
    sellerDesc: "বিক্রেতা পোর্টাল, স্টুডিও টুল এবং অর্ডার পরিচালনা করুন",
    buyerMode: "কেনাকাটা মোড (ক্রেতা ভিউ)",
    switchRole: "ভূমিকা পরিবর্তন করুন",
    backToSelect: "নির্বাচনে ফিরে যান",
  },
  ta: {
    welcome: "ஸ்மார்ட் ஆர்ட்டிசன்-க்கு வரவேற்கிறோம்",
    chooseRole: "தொடர கணக்கு வகையைத் தேர்ந்தெடுக்கவும்",
    exploreBuyer: "வாங்குபவராக ஆராயுங்கள்",
    buyerDesc: "கைவினைப் பொருட்களைக் கண்டறிந்து வாங்குங்கள்",
    loginSeller: "விற்பனையாளராக உள்நுழைக",
    sellerDesc: "விற்பனையாளர் தளம் மற்றும் ஆர்டர்களை நிர்வகிக்கவும்",
    buyerMode: "வாங்குதல் பயன்முறை (வாங்குபவர் பார்வை)",
    switchRole: "பங்கை மாற்றவும்",
    backToSelect: "தேர்வுக்குத் திரும்பு",
  }
};

// Global Language Selector Component (Defined outside Root to satisfy ESLint)
function LanguagePicker({ lang, onLanguageChange }) {
  return (
    <div className="flex items-center space-x-1 bg-slate-800 text-slate-200 px-2 py-1 rounded-lg text-xs">
      <Globe className="w-3.5 h-3.5 text-indigo-400" />
      <select
        value={lang}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-transparent font-medium text-xs text-white focus:outline-none cursor-pointer"
      >
        <option value="en" className="bg-slate-900 text-white">English</option>
        <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
        <option value="bn" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
        <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
      </select>
    </div>
  );
}

export default function Root() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [role, setRole] = useState(null); // 'buyer' | 'seller' | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.en;

  // Step 1: Role Selection Screen
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{t.welcome}</h2>
          <p className="text-xs text-slate-500 mb-6">{t.chooseRole}</p>

          <div className="space-y-3">
            <button
              onClick={() => setRole('buyer')}
              className="w-full p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left flex items-center space-x-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700">{t.exploreBuyer}</p>
                <p className="text-[11px] text-slate-500">{t.buyerDesc}</p>
              </div>
            </button>

            <button
              onClick={() => setRole('seller')}
              className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left flex items-center space-x-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-700">{t.loginSeller}</p>
                <p className="text-[11px] text-slate-500">{t.sellerDesc}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2A: Buyer Flow
  if (role === 'buyer') {
    return (
      <div>
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center space-x-3">
            <span>{t.buyerMode}</span>
            <LanguagePicker lang={lang} onLanguageChange={setLang} />
          </div>
          <button 
            onClick={() => setRole(null)}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.switchRole}</span>
          </button>
        </div>
        <App lang={lang} />
      </div>
    );
  }

  // Step 2B: Seller Login Flow
  if (!isLoggedIn) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </div>
        <button 
          onClick={() => setRole(null)}
          className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToSelect}</span>
        </button>
        <SellerLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // Step 3: Seller Dashboard / Studio
  if (currentView === 'dashboard') {
    return (
      <div>
        <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-end space-x-3 text-xs">
          <LanguagePicker lang={lang} onLanguageChange={setLang} />
        </div>
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
