import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Camera, Mic, IndianRupee, Sparkles, 
  ArrowRight, Check, RefreshCw, Languages, Search, Star, Loader2, Layers 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- UI Translation Dictionary for All Supported Languages ---
const UI_TRANSLATIONS = {
  hi: {
    appTitle: "स्मार्ट कारीगर",
    appSubtitle: "एआई बाजार लिंक मंच",
    artisanStudio: "कारीगर स्टूडियो",
    marketplace: "फ्लिपकार्ट मार्केटप्लेस",
    step1: "1. भाषा",
    step2: "2. स्टूडियो फोटो",
    step3: "3. एआई वॉयस कैटलॉग",
    step4: "4. उचित मूल्य",
    selectLangTitle: "अपनी भाषा चुनें",
    continueBtn: "आगे बढ़ें",
    studioTitle: "प्रोफेशनल एआई स्टूडियो बैकग्राउंड",
    uploadPhoto: "उत्पाद की फोटो अपलोड करें",
    uploadSubtitle: "खराब बैकग्राउंड हटाकर प्रोफेशनल स्टूडियो लुक दें",
    originalPhoto: "मूल फोटो",
    enhancedPhoto: "प्रोफेशनल स्टूडियो आउटपुट",
    studioPreset: "स्टूडियो बैकग्राउंड चुनें:",
    presetStudio: "स्टूडियो लाइटिंग",
    presetPedestal: "मार्बल पेडेस्टल",
    presetWood: "लकड़ी की मेज",
    presetWhite: "मार्केटप्लेस व्हाइट",
    backBtn: "पीछे",
    nextVoiceBtn: "आगे: एआई वॉयस कैटलॉग",
    voiceTitle: "जेमिनी एआई क्षेत्रीय आवाज और कैटलॉग",
    micInstruct: "बोलने के लिए माइक दबाएं, या विवरण नीचे टाइप करें",
    micListening: "सुन रहे हैं... अब बोलें!",
    inputLabel: "उत्पाद विवरण दर्ज करें",
    inputPlaceholder: "उदाहरण: हस्तनिर्मित लाल बनारसी सिल्क साड़ी जिसमें ज़री का काम है...",
    generateBtn: "कैटलॉग बनाएं",
    aiResultLabel: "एआई जनरेटेड कैटलॉग",
    nextPriceBtn: "आगे: मूल्य कैलकुलेटर",
    priceTitle: "डायनामिक उचित मूल्य कैलकुलेटर",
    craftType: "शिल्प का प्रकार",
    rawMaterial: "कच्ची सामग्री की लागत (₹)",
    laborHours: "काम के घंटे",
    calcPriceBtn: "उचित मूल्य की गणना करें",
    recommendedPrice: "अनुशंसित उचित मूल्य",
    publishBtn: "मार्केटप्लेस पर प्रकाशित करें",
    searchPlaceholder: "साड़ी, मिट्टी के बर्तन, सजावट खोजें...",
    buyNow: "अभी खरीदें",
    confirmOrder: "ऑर्डर की पुष्टि करें"
  },
  en: {
    appTitle: "Smart Artisan",
    appSubtitle: "AI Marketplace Linkage Platform",
    artisanStudio: "Artisan Studio",
    marketplace: "Flipkart Marketplace",
    step1: "1. Language",
    step2: "2. Studio Enhance",
    step3: "3. AI Voice Catalog",
    step4: "4. Fair Price",
    selectLangTitle: "Select Your Preferred Language",
    continueBtn: "Continue",
    studioTitle: "Professional AI Studio Background Enhancement",
    uploadPhoto: "Upload Product Photo",
    uploadSubtitle: "Replaces raw background with professional studio backdrop",
    originalPhoto: "Original Upload",
    enhancedPhoto: "Studio Backdrop Output",
    studioPreset: "Select Studio Theme:",
    presetStudio: "Studio Lighting",
    presetPedestal: "Marble Pedestal",
    presetWood: "Wooden Table",
    presetWhite: "Marketplace White",
    backBtn: "Back",
    nextVoiceBtn: "Next: AI Voice & Description",
    voiceTitle: "Gemini AI Regional Voice & Catalog Creator",
    micInstruct: "Click mic to speak, or type product details in text box below",
    micListening: "Listening... Speak now!",
    inputLabel: "Input Description",
    inputPlaceholder: "Type or speak details here (e.g., Handcrafted pure silk red saree with zari work)...",
    generateBtn: "Generate Catalog",
    aiResultLabel: "AI Generated Catalog",
    nextPriceBtn: "Next: Price Calculator",
    priceTitle: "Dynamic Fair Price Calculator",
    craftType: "Craft Type",
    rawMaterial: "Raw Material Cost (₹)",
    laborHours: "Labor Hours Spent",
    calcPriceBtn: "Calculate Fair Price",
    recommendedPrice: "Recommended Fair Price",
    publishBtn: "Publish to Marketplace",
    searchPlaceholder: "Search sarees, pots, decor...",
    buyNow: "Buy Now",
    confirmOrder: "Confirm Order"
  },
  bn: {
    appTitle: "স্মার্ট কারিগর",
    appSubtitle: "এআই মার্কেটপ্লেস লিঙ্ক প্ল্যাটফর্ম",
    artisanStudio: "কারিগর স্টুডিও",
    marketplace: "ফ্লিপকার্ট মার্কেটপ্লেস",
    step1: "১. ভাষা",
    step2: "২. স্টুডিও এনহ্যান্স",
    step3: "৩. এআই ভয়েস ক্যাটালগ",
    step4: "৪. ন্যায্য মূল্য",
    selectLangTitle: "আপনার পছন্দসই ভাষা নির্বাচন করুন",
    continueBtn: "এগিয়ে যান",
    studioTitle: "প্রফেশনাল এআই স্টুডিও ব্যাকগ্রাউন্ড",
    uploadPhoto: "পণ্যের ছবি আপলোড করুন",
    uploadSubtitle: "স্টুডিও ব্যাকড্রপ দিয়ে সাধারণ ব্যাকগ্রাউন্ড পরিবর্তন করুন",
    originalPhoto: "মূল ছবি",
    enhancedPhoto: "স্টুডিও আউটপুট",
    studioPreset: "স্টুডিও থিম বেছে নিন:",
    presetStudio: "স্টুডিও লাইটিং",
    presetPedestal: "মার্বেল পেডেস্টাল",
    presetWood: "কাঠের টেবিল",
    presetWhite: "মার্কেটপ্লেস হোয়াইট",
    backBtn: "ফিরে যান",
    nextVoiceBtn: "পরবর্তী: এআই ভয়েস ক্যাটালগ",
    voiceTitle: "জেমিনি এআই আঞ্চলিক ভয়েস ও ক্যাটালগ",
    micInstruct: "কথা বলতে মাইকে ক্লিক করুন বা নিচে বিবরণ টাইপ করুন",
    micListening: "শুনছি... এখন বলুন!",
    inputLabel: "পণ্যের বিবরণ দিন",
    inputPlaceholder: "এখানে টাইপ করুন বা বলুন...",
    generateBtn: "ক্যাটালগ তৈরি করুন",
    aiResultLabel: "এআই জেনারেট করা ক্যাটালগ",
    nextPriceBtn: "পরবর্তী: মূল্য ক্যালকুলেটর",
    priceTitle: "ন্যায্য মূল্য ক্যালকুলেটর",
    craftType: "শিল্পের ধরন",
    rawMaterial: "কাঁচামালের খরচ (₹)",
    laborHours: "কাজের সময় (ঘণ্টা)",
    calcPriceBtn: "ন্যায্য মূল্য গণনা করুন",
    recommendedPrice: "সুপারিশকৃত ন্যায্য মূল্য",
    publishBtn: "মার্কেটপ্লেসে প্রকাশ করুন",
    searchPlaceholder: "অনুসন্ধান করুন...",
    buyNow: "এখনই কিনুন",
    confirmOrder: "অর্ডার নিশ্চিত করুন"
  },
  ta: {
    appTitle: "ஸ்மார்ட் காரிகர்",
    appSubtitle: "AI சந்தை இணைப்பு தளம்",
    artisanStudio: "கைவினைஞர் ஸ்டுடியோ",
    marketplace: "பிளிப்கார்ட் சந்தை",
    step1: "1. மொழி",
    step2: "2. ஸ்டுடியோ போட்டோ",
    step3: "3. AI குரல் பட்டியல்",
    step4: "4. நியாயமான விலை",
    selectLangTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    continueBtn: "தொடரவும்",
    studioTitle: "தொழில்முறை AI ஸ்டுடியோ பின்னணி",
    uploadPhoto: "தயாரிப்பு புகைப்படத்தைப் பதிவேற்றவும்",
    uploadSubtitle: "சாதாரண பின்னணியை ஸ்டுடியோ பின்னணியாக மாற்றவும்",
    originalPhoto: "அசல் புகைப்படம்",
    enhancedPhoto: "ஸ்டுடியோ அவுட்புட்",
    studioPreset: "ஸ்டுடியோ தீம் தேர்ந்தெடுக்கவும்:",
    presetStudio: "ஸ்டுடியோ லைட்டிங்",
    presetPedestal: "மார்பிள் பீடம்",
    presetWood: "மர மேஜை",
    presetWhite: "மார்க்கெட்பிளேஸ் வெள்ளை",
    backBtn: "பின்னால்",
    nextVoiceBtn: "அடுத்தது: AI குரல் பட்டியல்",
    voiceTitle: "ஜெமினி AI குரல் & பட்டியல் உருவாக்குநர்",
    micInstruct: "பேச மைக்கை அழுத்தவும், அல்லது கீழே டைப் செய்யவும்",
    micListening: "கேட்கிறது... இப்போது பேசுங்கள்!",
    inputLabel: "தயாரிப்பு விவரம்",
    inputPlaceholder: "விவரங்களை இங்கே தட்டச்சு செய்யவும்...",
    generateBtn: "பட்டியலை உருவாக்கு",
    aiResultLabel: "AI உருவாக்கிய பட்டியல்",
    nextPriceBtn: "அடுத்தது: விலை கால்குலேட்டர்",
    priceTitle: "நியாயமான விலை கால்குலேட்டர்",
    craftType: "கைவினை வகை",
    rawMaterial: "மூலப்பொருள் செலவு (₹)",
    laborHours: "வேலை நேரம் (மணிநேரம்)",
    calcPriceBtn: "விலையைக் கணக்கிடுங்கள்",
    recommendedPrice: "பரிந்துரைக்கப்பட்ட விலை",
    publishBtn: "சந்தையில் வெளியிடுங்கள்",
    searchPlaceholder: "தேடுங்கள்...",
    buyNow: "இப்போதே வாங்குங்கள்",
    confirmOrder: "ஆர்டரை உறுதிப்படுத்தவும்"
  },
  te: {
    appTitle: "స్మార్ట్ కారిగర్",
    appSubtitle: "AI మార్కెట్‌ప్లేస్ లింకేజ్ ప్లాట్‌ఫారమ్",
    artisanStudio: "హస్తకళాకారుల స్టూడియో",
    marketplace: "ఫ్లిప్‌కార్ట్ మార్కెట్‌ప్లేస్",
    step1: "1. భాష",
    step2: "2. స్టూడియో ఫోటో",
    step3: "3. AI వాయిస్ కేటలాగ్",
    step4: "4. సగం ధర",
    selectLangTitle: "మీ భాషను ఎంచుకోండి",
    continueBtn: "ముందుకు సాగండి",
    studioTitle: "ప్రొఫెషనల్ AI స్టూడియో బ్యాక్‌గ్రౌండ్",
    uploadPhoto: "ఉత్పత్తి ఫోటోను అప్‌లోడ్ చేయండి",
    uploadSubtitle: "సాధారణ బ్యాక్‌గ్రౌండ్‌ను స్టూడియో లుక్‌గా మార్చండి",
    originalPhoto: "అసలు ఫోటో",
    enhancedPhoto: "స్టూడియో అవుట్‌పుట్",
    studioPreset: "స్టూడియో థీమ్‌ను ఎంచుకోండి:",
    presetStudio: "స్టూడియో లైటింగ్",
    presetPedestal: "మార్బుల్ పీఠం",
    presetWood: "చెక్క బల్ల",
    presetWhite: "మార్కెట్‌ప్లేస్ వైట్",
    backBtn: "వెనుకకు",
    nextVoiceBtn: "తరువాత: AI వాయిస్ కేటలాగ్",
    voiceTitle: "జెమిని AI ప్రాంతీయ వాయిస్ కేటలాగ్",
    micInstruct: "మాట్లాడటానికి మైక్‌పై క్లిక్ చేయండి",
    micListening: "వింటోంది... ఇప్పుడు మాట్లాడండి!",
    inputLabel: "ఉత్పత్తి వివరాలు నమోదు చేయండి",
    inputPlaceholder: "వివరాలను ఇక్కడ టైప్ చేయండి...",
    generateBtn: "కేటలాగ్ రూపొందించండి",
    aiResultLabel: "AI సృష్టించిన కేటలాగ్",
    nextPriceBtn: "తరువాత: ధర క్యాలిక్యులేటర్",
    priceTitle: "సమర్థవంతమైన ధర క్యాలిక్యులేటర్",
    craftType: "కళ రకం",
    rawMaterial: "ముడి సరుకు ఖర్చు (₹)",
    laborHours: "పని గంటలు",
    calcPriceBtn: "ధరను లెక్కించండి",
    recommendedPrice: "సిఫార్సు చేసిన ధర",
    publishBtn: "మార్కెట్‌ప్లేస్‌లో ప్రచురించండి",
    searchPlaceholder: "వెతకండి...",
    buyNow: "ఇప్పుడే కొనండి",
    confirmOrder: "ఆర్డర్‌ను నిర్ధారించండి"
  },
  mr: {
    appTitle: "स्मार्ट कारागीर",
    appSubtitle: "एआय मार्केटप्लेस प्लॅटफॉर्म",
    artisanStudio: "कारागीर स्टुडिओ",
    marketplace: "फ्लिपकार्ट मार्केटप्लेस",
    step1: "१. भाषा",
    step2: "२. स्टुडिओ फोटो",
    step3: "३. एआय व्हॉइस कॅटलॉग",
    step4: "४. वाजवी किंमत",
    selectLangTitle: "आपली भाषा निवडा",
    continueBtn: "पुढे चला",
    studioTitle: "प्रोफेशनल एआय स्टुडिओ बॅकग्राउंड",
    uploadPhoto: "उत्पादनाचा फोटो अपलोड करा",
    uploadSubtitle: "सामान्य बॅकग्राउंड काढून स्टुडिओ लुक द्या",
    originalPhoto: "मूळ फोटो",
    enhancedPhoto: "स्टुडिओ आउटपुट",
    studioPreset: "स्टुडिओ थीम निवडा:",
    presetStudio: "स्टुडिओ लाइटिंग",
    presetPedestal: "मार्बल पेडस्टल",
    presetWood: "लाकडी टेबल",
    presetWhite: "मार्केटप्लेस व्हाईट",
    backBtn: "मागे",
    nextVoiceBtn: "पुढे: एआय व्हॉइस कॅटलॉग",
    voiceTitle: "जेमिनी एआय व्हॉइस आणि कॅटलॉग",
    micInstruct: "बोलण्यासाठी माइकवर क्लिक करा",
    micListening: "ऐकत आहे... आता बोला!",
    inputLabel: "उत्पादन तपशील प्रविष्ट करा",
    inputPlaceholder: "इथे टाईप करा किंवा बोला...",
    generateBtn: "कॅटलॉग तयार करा",
    aiResultLabel: "एआय जनरेट केलेला कॅटलॉग",
    nextPriceBtn: "पुढे: किंमत कॅल्क्युलेटर",
    priceTitle: "वाजवी किंमत कॅल्क्युलेटर",
    craftType: "कलेचा प्रकार",
    rawMaterial: "कच्च्या मालाचा खर्च (₹)",
    laborHours: "कामाचे तास",
    calcPriceBtn: "किंमत मोजा",
    recommendedPrice: "शिफारस केलेली वाजवी किंमत",
    publishBtn: "मार्केटप्लेसवर प्रकाशित करा",
    searchPlaceholder: "शोधा...",
    buyNow: "आत्ताच खरेदी करा",
    confirmOrder: "ऑर्डरची पुष्टी करा"
  },
  gu: {
    appTitle: "સ્માર્ટ કારીગર",
    appSubtitle: "AI માર્કેટપ્લેસ પ્લેટફોર્મ",
    artisanStudio: "કારીગર સ્ટુડિયો",
    marketplace: "ફ્લિપકાર્ટ માર્કેટપ્લેસ",
    step1: "૧. ભાષા",
    step2: "૨. સ્ટુડિયો ફોટો",
    step3: "૩. AI વોઇસ કેટલોગ",
    step4: "૪. વ્યાજબી કિંમત",
    selectLangTitle: "તમારી ભાષા પસંદ કરો",
    continueBtn: "આગળ વધો",
    studioTitle: "પ્રોફેશનલ AI સ્ટુડિયો બેકગ્રાઉન્ડ",
    uploadPhoto: "પ્રોડક્ટનો ફોટો અપલોડ કરો",
    uploadSubtitle: "સામાન્ય બેકગ્રાઉન્ડ દૂર કરી પ્રોફેશનલ લુક આપો",
    originalPhoto: "મૂળ ફોટો",
    enhancedPhoto: "સ્ટુડિયો આઉટપુટ",
    studioPreset: "સ્ટુડિયો થીમ પસંદ કરો:",
    presetStudio: "સ્ટુડિયો લાઈટિંગ",
    presetPedestal: "માર્બલ પેડેસ્ટલ",
    presetWood: "લાકડાનું ટેબલ",
    presetWhite: "માર્કેટપ્લેસ વ્હાઇટ",
    backBtn: "પાછળ",
    nextVoiceBtn: "આગળ: AI વોઇસ કેટલોગ",
    voiceTitle: "જેમિની AI વોઇસ કેટલોગ",
    micInstruct: "બોલવા માટે માઇક પર ક્લિક કરો",
    micListening: "સાંભળી રહ્યા છીએ... હવે બોલો!",
    inputLabel: "વિગતો દાખલ કરો",
    inputPlaceholder: "અહીં લખો અથવા બોલો...",
    generateBtn: "કેટલોગ બનાવો",
    aiResultLabel: "AI નિર્મિત કેટલોગ",
    nextPriceBtn: "આગળ: કિંમત કેલ્ક્યુલેટર",
    priceTitle: "વ્યાજબી કિંમત કેલ્ક્યુલેટર",
    craftType: "કારીગરીનો પ્રકાર",
    rawMaterial: "કાચા માલનો ખર્ચ (₹)",
    laborHours: "કામના કલાકો",
    calcPriceBtn: "કિંમત ગણો",
    recommendedPrice: "ભલામણ કરેલ કિંમત",
    publishBtn: "માર્કેટપ્લેસ પર પબ્લિશ કરો",
    searchPlaceholder: "શોધો...",
    buyNow: "હમણાં ખરીદો",
    confirmOrder: "ઓર્ડર કન્ફર્મ કરો"
  },
  kn: {
    appTitle: "ಸ್ಮಾರ್ಟ್ ಕಾರೀಗರ",
    appSubtitle: "AI ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    artisanStudio: "ಕುಶಲಕರ್ಮಿ ಸ್ಟುಡಿಯೋ",
    marketplace: "ಫ್ಲಿಪ್‌ಕಾರ್ಟ್ ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
    step1: "1. ಭಾಷೆ",
    step2: "2. ಸ್ಟುಡಿಯೋ ಫೋಟೋ",
    step3: "3. AI ವಾಯ್ಸ್ ಕ್ಯಾಟಲಾಗ್",
    step4: "4. ನ್ಯಾಯಯುತ ಬೆಲೆ",
    selectLangTitle: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    continueBtn: "ಮುಂದುವರಿಯಿರಿ",
    studioTitle: "ವೃತ್ತಿಪರ AI ಸ್ಟುಡಿಯೋ ಹಿನ್ನೆಲೆ",
    uploadPhoto: "ಉತ್ಪನ್ನದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadSubtitle: "ಸಾಧಾರಣ ಹಿನ್ನೆಲೆಯನ್ನು ಸ್ಟುಡಿಯೋ ಲುಕ್‌ಗೆ ಬದಲಾಯಿಸಿ",
    originalPhoto: "ಮೂಲ ಫೋಟೋ",
    enhancedPhoto: "ಸ್ಟುಡಿಯೋ ಔಟ್‌ಪುಟ್",
    studioPreset: "ಸ್ಟುಡಿಯೋ ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ:",
    presetStudio: "ಸ್ಟುಡಿಯೋ ಲೈಟಿಂಗ್",
    presetPedestal: "ಮಾರ್ಬಲ್ ಪೀಠ",
    presetWood: "ಮರದ ಮೇಜು",
    presetWhite: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ವೈಟ್",
    backBtn: "ಹಿಂದೆ",
    nextVoiceBtn: "ಮುಂದೆ: AI ವಾಯ್ಸ್ ಕ್ಯಾಟಲಾಗ್",
    voiceTitle: "ಜೆಮಿನಿ AI ಪ್ರಾದೇಶಿಕ ವಾಯ್ಸ್ ಕ್ಯಾಟಲಾಗ್",
    micInstruct: "ಮಾತನಾಡಲು ಮೈಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    micListening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ!",
    inputLabel: "ಉತ್ಪನ್ನದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    inputPlaceholder: "ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    generateBtn: "ಕ್ಯಾಟಲಾಗ್ ರಚಿಸಿ",
    aiResultLabel: "AI ರಚಿಸಿದ ಕ್ಯಾಟಲಾಗ್",
    nextPriceBtn: "ಮುಂದೆ: ಬೆಲೆ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    priceTitle: "ನ್ಯಾಯಯುತ ಬೆಲೆ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    craftType: "ಕರಕುಶಲ ಮಾದರಿ",
    rawMaterial: "ಕಚ್ಚಾ ವಸ್ತುವಿನ ವೆಚ್ಚ (₹)",
    laborHours: "ಕೆಲಸದ ಗಂಟೆಗಳು",
    calcPriceBtn: "ಬೆಲೆಯನ್ನು ಲೆಕ್ಕಹಾಕಿ",
    recommendedPrice: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಲೆ",
    publishBtn: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸಿ",
    searchPlaceholder: "ಹುಡುಕಿ...",
    buyNow: "ಈಗಲೇ ಖರೀದಿಸಿ",
    confirmOrder: "ಆರ್ಡರ್ ದೃಢೀಕರಿಸಿ"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('seller');

  // Step 1: UI Language Selection State
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Helper function to fetch translation safely
  const t = (key) => UI_TRANSLATIONS[selectedLanguage]?.[key] || UI_TRANSLATIONS.en[key] || key;

  // Step 2: Photo Processing & Option A Studio Canvas Presets
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [studioTheme, setStudioTheme] = useState('pedestal'); // 'lighting', 'pedestal', 'wood', 'white'

  // Step 3: Voice / AI Description State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedCatalog, setTranslatedCatalog] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Step 4: Pricing State
  const [materialCost, setMaterialCost] = useState('500');
  const [laborHours, setLaborHours] = useState('6');
  const [craftType, setCraftType] = useState('Textile / Saree');
  const [suggestedPrice, setSuggestedPrice] = useState(null);

  // Wizard Step Tracker
  const [sellerStep, setSellerStep] = useState(1);

  // Buyer Store State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Handcrafted Banarasi Silk Saree",
      category: "Textiles",
      price: 3499,
      originalPrice: 4999,
      rating: 4.8,
      artisan: "Sunita Devi (Varanasi)",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      description: "Authentic pure silk saree handcrafted with intricate golden zari weave."
    },
    {
      id: 2,
      title: "Traditional Terracotta Clay Pot",
      category: "Pottery",
      price: 899,
      originalPrice: 1299,
      rating: 4.6,
      artisan: "Ramesh Kumar (Rajasthan)",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600",
      description: "Natural cooling terracotta pot handcrafted using age-old pottery wheels."
    }
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const generateAiListing = async (textToProcess) => {
    const text = textToProcess || transcript;
    if (!text.trim()) {
      alert("Please speak or type a description first!");
      return;
    }

    setIsAiProcessing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const langMap = {
        en: 'English',
        hi: 'Hindi (हिंदी)',
        bn: 'Bengali (বাংলা)',
        ta: 'Tamil (தமிழ்)',
        te: 'Telugu (తెలుగు)',
        mr: 'Marathi (मराठी)',
        gu: 'Gujarati (ગુજરાતી)',
        kn: 'Kannada (ಕನ್ನಡ)'
      };

      const targetLangName = langMap[selectedLanguage] || 'Hindi (हिंदी)';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI e-commerce catalog generator for rural Indian artisans.
The artisan provided this text description: "${text}"

Target Output Language: REQUIRED IN ${targetLangName.toUpperCase()}.

Please create an appealing e-commerce listing entirely in ${targetLangName}:
1. Catchy Product Title
2. 2 Bullet points describing craftsmanship and material quality.

Note: Respond ONLY in ${targetLangName} script. Do not write in English.`,
      });

      setTranslatedCatalog(response.text);
    } catch (error) {
      console.error("Gemini AI API Error:", error);
      alert("Error generating catalog. Please check your Gemini API key.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported in this browser. Please type directly into the text box below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      const langMap = { en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN' };
      recognitionRef.current.lang = langMap[selectedLanguage] || 'hi-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setOriginalImage(event.target.result);
    reader.readAsDataURL(file);

    setIsEnhancing(true);

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
      const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY;
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey },
        body: formData,
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const blob = await response.blob();
      setEnhancedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Remove.bg API Error:", error);
      setEnhancedImage(URL.createObjectURL(file));
    } finally {
      setIsEnhancing(false);
    }
  };

  const calculateSuggestedPrice = () => {
    const mat = parseFloat(materialCost) || 0;
    const hrs = parseFloat(laborHours) || 0;
    const totalCost = mat + (hrs * 180);
    setSuggestedPrice(Math.round(totalCost * 1.35));
  };

  const publishProductToMarketplace = () => {
    const newProd = {
      id: Date.now(),
      title: translatedCatalog ? translatedCatalog.split('\n')[0].replace(/[*#]/g, '') : "Authentic Artisan Craft",
      category: craftType.split('/')[0].trim(),
      price: suggestedPrice || 1499,
      originalPrice: (suggestedPrice || 1499) + 500,
      rating: 5.0,
      artisan: "Smart Artisan Studio",
      image: enhancedImage || originalImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      description: translatedCatalog || transcript || "Handcrafted with passion by local artisans."
    };

    setProducts([newProd, ...products]);
    alert("Product published to Marketplace!");
    setActiveTab('buyer');
  };

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCanvasStyle = () => {
    switch (studioTheme) {
      case 'lighting':
        return 'bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 border-slate-700';
      case 'wood':
        return 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-900 border-amber-300';
      case 'white':
        return 'bg-white border-slate-200';
      case 'pedestal':
      default:
        return 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-indigo-700 font-black p-2 rounded-lg shadow text-lg">SA</div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">{t('appTitle')}</h1>
              <p className="text-xs text-indigo-200">{t('appSubtitle')}</p>
            </div>
          </div>

          <div className="flex bg-indigo-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'seller' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('artisanStudio')}</span>
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'buyer' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('marketplace')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'seller' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-200 p-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
                <span className={sellerStep >= 1 ? 'text-indigo-600' : ''}>{t('step1')}</span>
                <span className={sellerStep >= 2 ? 'text-indigo-600' : ''}>{t('step2')}</span>
                <span className={sellerStep >= 3 ? 'text-indigo-600' : ''}>{t('step3')}</span>
                <span className={sellerStep >= 4 ? 'text-indigo-600' : ''}>{t('step4')}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${(sellerStep / 4) * 100}%` }}></div>
              </div>
            </div>

            <div className="p-6">
              {/* STEP 1: UI LANGUAGE SELECTION */}
              {sellerStep === 1 && (
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold mb-4">
                    <Languages className="w-5 h-5" />
                    <h2>{t('selectLangTitle')}</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`p-3 rounded-xl border text-left transition ${
                          selectedLanguage === lang.code
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                            : 'border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        <div className="text-sm">{lang.native}</div>
                        <div className="text-xs text-slate-400">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSellerStep(2)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>{t('continueBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: PHOTO ENHANCEMENT */}
              {sellerStep === 2 && (
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold mb-4">
                    <Camera className="w-5 h-5" />
                    <h2>{t('studioTitle')}</h2>
                  </div>

                  {!originalImage ? (
                    <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition mb-6">
                      <Camera className="w-10 h-10 text-indigo-500 mb-2" />
                      <span className="text-sm font-medium text-slate-700">{t('uploadPhoto')}</span>
                      <span className="text-xs text-slate-400 mt-1">{t('uploadSubtitle')}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mb-2">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{t('studioPreset')}</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'pedestal', label: t('presetPedestal') },
                            { id: 'lighting', label: t('presetStudio') },
                            { id: 'wood', label: t('presetWood') },
                            { id: 'white', label: t('presetWhite') }
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => setStudioTheme(preset.id)}
                              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                                studioTheme === preset.id
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-100 text-center">
                          <span className="text-xs font-semibold text-slate-500 block mb-2">{t('originalPhoto')}</span>
                          <img src={originalImage} alt="Original" className="h-48 object-contain mx-auto rounded-lg" />
                        </div>
                        
                        <div className={`border rounded-xl p-3 text-center relative shadow-lg overflow-hidden transition-all duration-300 ${getCanvasStyle()}`}>
                          <span className={`text-xs font-bold block mb-2 ${studioTheme === 'lighting' ? 'text-slate-200' : 'text-slate-700'}`}>
                            {t('enhancedPhoto')}
                          </span>

                          {isEnhancing ? (
                            <div className="h-48 flex flex-col items-center justify-center text-indigo-500">
                              <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                              <span className="text-xs font-medium">Removing clutter & generating studio lighting...</span>
                            </div>
                          ) : (
                            <div className="h-48 relative flex items-center justify-center">
                              {studioTheme === 'pedestal' && (
                                <div className="absolute bottom-0 w-full h-1/3 bg-slate-300/40 backdrop-blur-sm border-t border-white/50 rounded-b-lg"></div>
                              )}
                              <img 
                                src={enhancedImage} 
                                alt="Studio Enhanced" 
                                className="relative z-10 h-44 object-contain filter drop-shadow-[0_15px_12px_rgba(0,0,0,0.45)]" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-3">
                    <button onClick={() => setSellerStep(1)} className="px-5 py-3 border border-slate-300 rounded-xl text-slate-600 font-medium">
                      {t('backBtn')}
                    </button>
                    <button
                      onClick={() => setSellerStep(3)}
                      disabled={!enhancedImage || isEnhancing}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    >
                      <span>{t('nextVoiceBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VOICE & GEMINI AI */}
              {sellerStep === 3 && (
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold mb-4">
                    <Mic className="w-5 h-5" />
                    <h2>{t('voiceTitle')}</h2>
                  </div>

                  <div className="text-center my-6">
                    <button
                      onClick={toggleListening}
                      className={`p-6 rounded-full transition shadow-lg ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      {isListening ? t('micListening') : t('micInstruct')}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">{t('inputLabel')}</label>
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder={t('inputPlaceholder')}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20 mt-1"
                      />
                    </div>

                    <button
                      onClick={() => generateAiListing()}
                      disabled={isAiProcessing || !transcript.trim()}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2"
                    >
                      {isAiProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>{t('generateBtn')} ({selectedLanguage.toUpperCase()})</span>
                        </>
                      )}
                    </button>

                    <div>
                      <label className="text-xs font-semibold text-indigo-600 uppercase">{t('aiResultLabel')} ({selectedLanguage.toUpperCase()})</label>
                      <textarea
                        value={translatedCatalog}
                        onChange={(e) => setTranslatedCatalog(e.target.value)}
                        placeholder="..."
                        className="w-full border border-indigo-200 bg-indigo-50/40 rounded-xl p-3 text-sm text-indigo-950 font-medium focus:ring-2 focus:ring-indigo-500 outline-none h-32 mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between space-x-3">
                    <button onClick={() => setSellerStep(2)} className="px-5 py-3 border border-slate-300 rounded-xl text-slate-600 font-medium">
                      {t('backBtn')}
                    </button>
                    <button
                      onClick={() => setSellerStep(4)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    >
                      <span>{t('nextPriceBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FAIR PRICE CALCULATOR */}
              {sellerStep === 4 && (
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold mb-4">
                    <IndianRupee className="w-5 h-5" />
                    <h2>{t('priceTitle')}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500">{t('craftType')}</label>
                      <select 
                        value={craftType} 
                        onChange={(e) => setCraftType(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 mt-1"
                      >
                        <option>Textile / Saree</option>
                        <option>Pottery / Clay</option>
                        <option>Woodwork / Carving</option>
                        <option>Metalware / Brass</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">{t('rawMaterial')}</label>
                      <input
                        type="number"
                        value={materialCost}
                        onChange={(e) => setMaterialCost(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">{t('laborHours')}</label>
                      <input
                        type="number"
                        value={laborHours}
                        onChange={(e) => setLaborHours(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <button onClick={calculateSuggestedPrice} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold">
                        {t('calcPriceBtn')}
                      </button>
                    </div>
                  </div>

                  {suggestedPrice && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
                      <span className="text-xs font-semibold text-emerald-700 uppercase">{t('recommendedPrice')}</span>
                      <div className="text-3xl font-extrabold text-emerald-800 mt-1">₹{suggestedPrice}</div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-3">
                    <button onClick={() => setSellerStep(3)} className="px-5 py-3 border border-slate-300 rounded-xl text-slate-600 font-medium">
                      {t('backBtn')}
                    </button>
                    <button
                      onClick={publishProductToMarketplace}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>{t('publishBtn')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div className="space-y-6">
            <div className="bg-amber-400 p-6 rounded-2xl shadow-sm text-amber-950 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="bg-amber-900 text-amber-100 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Direct from Artisans</span>
                <h2 className="text-2xl font-black mt-2">Authentic Handcrafted Marketplace</h2>
                <p className="text-sm text-amber-900/80">Support rural craft clusters with fair pricing</p>
              </div>

              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-amber-700"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['All', 'Textiles', 'Pottery', 'Woodwork', 'Metalware'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-slate-100 overflow-hidden relative">
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{prod.rating}</span>
                      </span>
                    </div>

                    <div className="p-4">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{prod.category}</span>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mt-1">{prod.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">By {prod.artisan}</p>

                      <div className="flex items-baseline space-x-2 mt-3">
                        <span className="text-lg font-black text-slate-900">₹{prod.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button onClick={() => setSelectedProduct(prod)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-sm transition">
                      {t('buyNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
                  >
                    ✕
                  </button>
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="h-56 w-full object-cover rounded-xl mb-4" />
                  <span className="text-xs font-bold text-indigo-600 uppercase">{selectedProduct.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProduct.title}</h3>
                  <p className="text-xs text-slate-500">Artisan: {selectedProduct.artisan}</p>
                  <p className="text-sm text-slate-600 my-3">{selectedProduct.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Total Price</span>
                      <span className="text-2xl font-black text-slate-900">₹{selectedProduct.price}</span>
                    </div>
                    <button 
                      onClick={() => {
                        alert("Order placed successfully!");
                        setSelectedProduct(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm"
                    >
                      {t('confirmOrder')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}