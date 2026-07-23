"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { 
  Leaf, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, Activity,
  HelpCircle, Wind, Flame, Mountain, Feather, Droplets, Brain, Eye, Moon, Languages
} from "lucide-react";

// 🚀 15 BILINGUAL AYUSH QUESTIONS (English & Hindi)
const QUIZ_QUESTIONS = [
  // --- PHYSICAL TRAITS ---
  {
    en: { category: "Physical Traits", question: "How would you describe your natural body frame?", helpText: "Think about your natural build since childhood. Look at the thickness of your wrists and ankles." },
    hi: { category: "शारीरिक लक्षण", question: "आपके शरीर का ढांचा और हड्डियां कैसी हैं?", helpText: "बचपन से अपनी शारीरिक बनावट के बारे में सोचें। अपनी कलाइयों और टखनों की मोटाई देखें।" },
    options: [
      { en: "Thin, lean, prominent joints. Hard to gain weight.", hi: "पतला शरीर, नसें और हड्डियां उभरी हुई। वजन आसानी से नहीं बढ़ता।", dosha: "vata", icon: Feather, color: "text-primary-500" },
      { en: "Medium, well-proportioned. Gain/lose weight easily.", hi: "मध्यम शरीर। वजन आसानी से बढ़ता और घटता है।", dosha: "pitta", icon: Activity, color: "text-orange-500" },
      { en: "Broad, large, heavy bones. Gain weight easily.", hi: "चौड़ा और भारी शरीर। वजन बहुत आसानी से बढ़ जाता है।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Physical Traits", question: "What is the natural texture and temperature of your skin?", helpText: "How does your skin feel naturally, without applying any lotion? Does it react strongly to weather?" },
    hi: { category: "शारीरिक लक्षण", question: "आपकी त्वचा (Skin) की बनावट कैसी है?", helpText: "बिना किसी लोशन या क्रीम के आपकी त्वचा कैसी महसूस होती है? मौसम का इस पर क्या प्रभाव पड़ता है?" },
    options: [
      { en: "Dry, rough, thin, and tends to feel cold.", hi: "रूखी, खुरदरी, पतली और ठंडी।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Warm, sensitive, prone to redness, freckles, or acne.", hi: "गर्म, संवेदनशील, मुहांसे या लाल चकत्ते वाली।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Thick, oily, smooth, and naturally cool.", hi: "मोटी, तैलीय (Oily), मुलायम और ठंडी।", dosha: "kapha", icon: Droplets, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Physical Traits", question: "How would you describe your natural hair?", helpText: "Think about your hair's natural state before any chemical treatments or styling." },
    hi: { category: "शारीरिक लक्षण", question: "आपके प्राकृतिक बाल कैसे हैं?", helpText: "बालों में कोई केमिकल या कलर लगाने से पहले उनकी प्राकृतिक स्थिति के बारे में सोचें।" },
    options: [
      { en: "Dry, brittle, thin, or tends to be frizzy/curly.", hi: "रूखे, पतले, कमजोर या बहुत घुंघराले।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Fine, straight, prone to early thinning or graying.", hi: "सीधे, मुलायम, जल्दी सफेद होने वाले या झड़ने वाले।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Thick, dense, wavy, and naturally shiny.", hi: "घने, मोटे, लहरदार और प्राकृतिक रूप से चमकदार।", dosha: "kapha", icon: Droplets, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Physical Traits", question: "How would you describe your eyes?", helpText: "Look at the size, shape, and how often they feel dry or sensitive." },
    hi: { category: "शारीरिक लक्षण", question: "आपकी आंखें कैसी हैं?", helpText: "आंखों के आकार और चमक को देखें। क्या वे जल्दी रूखी या लाल हो जाती हैं?" },
    options: [
      { en: "Small, dry, active, and constantly moving.", hi: "छोटी, रूखी, चंचल और लगातार घूमने वाली।", dosha: "vata", icon: Eye, color: "text-primary-500" },
      { en: "Piercing, sharp, sensitive to bright sunlight.", hi: "तेज रोशनी के प्रति संवेदनशील, तीखी नजर और जल्दी लाल होने वाली।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Large, calm, attractive with thick eyelashes.", hi: "बड़ी, शांत, आकर्षक और घनी पलकों वाली।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Physical Traits", question: "How does your body typically manage weight?", helpText: "Think about how your weight fluctuates over the years without extreme dieting." },
    hi: { category: "शारीरिक लक्षण", question: "आपका शरीर वजन को कैसे प्रबंधित करता है?", helpText: "बिना किसी खास डाइट के आपका वजन कैसे बदलता है?" },
    options: [
      { en: "I struggle to put on weight; I am naturally very lean.", hi: "वजन बढ़ाना बहुत मुश्किल है; मैं प्राकृतिक रूप से बहुत दुबला/दुबली हूं।", dosha: "vata", icon: Feather, color: "text-primary-500" },
      { en: "My weight fluctuates moderately but is easy to control.", hi: "वजन घटता-बढ़ता रहता है, लेकिन इसे नियंत्रित करना आसान है।", dosha: "pitta", icon: Activity, color: "text-orange-500" },
      { en: "I gain weight very easily and find it extremely hard to lose.", hi: "वजन बहुत जल्दी बढ़ता है और कम करना बहुत मुश्किल होता है।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },

  // --- PHYSIOLOGICAL TRAITS ---
  {
    en: { category: "Digestion & Metabolism", question: "How is your appetite and digestion?", helpText: "Agni (digestive fire) determines how your stomach reacts. What happens if you skip a meal?" },
    hi: { category: "पाचन और चयापचय", question: "आपकी भूख और पाचन शक्ति कैसी है?", helpText: "अग्नि (पाचन अग्नि) तय करती है कि आपका पेट कैसा प्रतिक्रिया करता है। यदि आप खाना छोड़ देते हैं तो क्या होता है?" },
    options: [
      { en: "Irregular. Sometimes hungry, sometimes skip meals. Prone to bloating.", hi: "अनियमित। कभी बहुत भूख लगती है, कभी बिल्कुल नहीं। गैस और कब्ज की शिकायत रहती है।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Strong and sharp. I get irritable or acidic if I miss a meal.", hi: "बहुत तेज भूख लगती है। खाना न मिलने पर चिड़चिड़ापन या एसिडिटी होती है।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Slow and steady. I can easily skip a meal without feeling weak.", hi: "धीमी लेकिन स्थिर। मैं बिना कमजोरी महसूस किए आसानी से भोजन छोड़ सकता/सकती हूं।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Digestion & Metabolism", question: "How are your typical bowel movements?", helpText: "Think about your standard daily routine and consistency." },
    hi: { category: "पाचन और चयापचय", question: "आपका मल त्याग (Bowel movements) कैसा है?", helpText: "अपनी दैनिक दिनचर्या और मल की स्थिति के बारे में सोचें।" },
    options: [
      { en: "Irregular, hard, dry, or tendency towards constipation.", hi: "अनियमित, कड़ा, सूखा या कब्ज की शिकायत रहती है।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Frequent, soft, or tendency towards loose motions.", hi: "दिन में कई बार, नरम, या पतले दस्त होने की प्रवृत्ति होती है।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Regular, heavy, but sometimes slow or sluggish.", hi: "नियमित, लेकिन कभी-कभी मल त्याग में समय लगता है या भारीपन महसूस होता है।", dosha: "kapha", icon: Droplets, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Digestion & Metabolism", question: "How much do you typically sweat?", helpText: "Think about how your body reacts to moderate physical activity or a hot summer day." },
    hi: { category: "पाचन और चयापचय", question: "आपको आमतौर पर कितना पसीना आता है?", helpText: "गर्मियों के दिन या व्यायाम करते समय शरीर कैसे प्रतिक्रिया करता है?" },
    options: [
      { en: "Very little, even in hot weather.", hi: "बहुत कम, तेज गर्मी में भी ज्यादा पसीना नहीं आता।", dosha: "vata", icon: Feather, color: "text-primary-500" },
      { en: "Profusely. I sweat easily and it may have a strong odor.", hi: "बहुत ज्यादा पसीना आता है, और उसमें तेज गंध हो सकती है।", dosha: "pitta", icon: Droplets, color: "text-orange-500" },
      { en: "Moderately. Usually only when exercising or working hard.", hi: "मध्यम। आम तौर पर केवल तभी जब व्यायाम या कड़ी मेहनत करते हैं।", dosha: "kapha", icon: Activity, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Sleep & Energy", question: "What is your typical sleep pattern like?", helpText: "Think about how easily you fall asleep, how often you wake up at night, and how you feel in the morning." },
    hi: { category: "नींद और ऊर्जा", question: "आपकी नींद का पैटर्न कैसा है?", helpText: "आप कितनी आसानी से सो जाते हैं, और सुबह कैसा महसूस करते हैं?" },
    options: [
      { en: "Light, interrupted. I struggle to fall or stay asleep.", hi: "कच्ची नींद, बीच-बीच में टूटती है। सोने में कठिनाई होती है।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Sound but short. I sleep well but wake up alert.", hi: "गहरी लेकिन कम समय की। अच्छी नींद आती है और सुबह जल्दी आंख खुलती है।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Deep, heavy, prolonged. I find it difficult to wake up.", hi: "बहुत गहरी और लंबी नींद। सुबह उठने में आलस और कठिनाई होती है।", dosha: "kapha", icon: Moon, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Sleep & Energy", question: "How does climate and weather affect your body?", helpText: "Which extreme weather condition makes you feel the most uncomfortable?" },
    hi: { category: "नींद और ऊर्जा", question: "मौसम का आपके शरीर पर क्या प्रभाव पड़ता है?", helpText: "कौन सा मौसम आपको सबसे अधिक असहज करता है?" },
    options: [
      { en: "I highly dislike cold, dry, or windy weather.", hi: "मुझे ठंडा, रूखा और तेज हवा वाला मौसम बिल्कुल पसंद नहीं है।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "I highly dislike hot weather, humidity, and strong sun.", hi: "मुझे तेज गर्मी, उमस और चिलचिलाती धूप बिल्कुल पसंद नहीं है।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "I highly dislike cold, damp, or rainy weather.", hi: "मुझे ठंडा, नम (सर्द-गरम) या बरसात का मौसम बिल्कुल पसंद नहीं है।", dosha: "kapha", icon: Droplets, color: "text-emerald-500" },
    ]
  },

  // --- PSYCHOLOGICAL TRAITS ---
  {
    en: { category: "Mind & Emotions", question: "How do you typically react to sudden stress?", helpText: "When faced with an unexpected problem or a tight deadline, what is your immediate emotional reaction?" },
    hi: { category: "मन और भावनाएं", question: "अचानक तनाव (Stress) आने पर आप कैसे प्रतिक्रिया करते हैं?", helpText: "जब कोई अचानक समस्या आ जाए, तो आपकी पहली प्रतिक्रिया क्या होती है?" },
    options: [
      { en: "I become anxious, worried, fearful, or overwhelmed.", hi: "मैं घबरा जाता/जाती हूं, बहुत चिंता या डर लगने लगता है।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "I become frustrated, angry, irritated, or try to take control.", hi: "मुझे गुस्सा आता है, चिड़चिड़ापन होता है और मैं स्थिति को नियंत्रित करने की कोशिश करता हूं।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "I become withdrawn, silent, calm, or avoid the conflict.", hi: "मैं शांत हो जाता/जाती हूं, चुप रहता हूं या टकराव से बचता हूं।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Mind & Emotions", question: "How is your memory and learning style?", helpText: "Think back to your school days or when learning a new skill at work. How quickly do you grasp info?" },
    hi: { category: "मन और भावनाएं", question: "आपकी याददाश्त और सीखने का तरीका कैसा है?", helpText: "आप नई चीजों को कितनी जल्दी समझते और याद रखते हैं?" },
    options: [
      { en: "I grasp things very quickly, but also forget them quickly.", hi: "मैं चीजें बहुत जल्दी सीख लेता हूं, लेकिन उन्हें जल्दी भूल भी जाता हूं।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "I have a sharp memory and understand logical concepts easily.", hi: "मेरी याददाश्त तेज है और मैं लॉजिक (तर्क) को आसानी से समझ लेता हूं।", dosha: "pitta", icon: Brain, color: "text-orange-500" },
      { en: "I learn slowly, but once I learn something, I never forget it.", hi: "मैं धीरे-धीरे सीखता हूं, लेकिन एक बार सीखने के बाद कभी नहीं भूलता।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Mind & Emotions", question: "How would you describe your natural speech pattern?", helpText: "When you are excited or explaining something, how do you talk?" },
    hi: { category: "मन और भावनाएं", question: "आपके बोलने का तरीका कैसा है?", helpText: "जब आप उत्साहित होते हैं या कुछ समझा रहे होते हैं, तो आप कैसे बोलते हैं?" },
    options: [
      { en: "Fast, talkative, sometimes disorganized or jumping topics.", hi: "बहुत तेज, बातूनी, और कभी-कभी एक विषय से दूसरे विषय पर कूदने वाला।", dosha: "vata", icon: Feather, color: "text-primary-500" },
      { en: "Clear, sharp, precise, and sometimes argumentative/direct.", hi: "स्पष्ट, सटीक, तेज और कभी-कभी बहस करने वाला या सीधा।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Slow, calm, sweet, and thoughtful. I take my time.", hi: "धीमा, शांत, मीठा और सोच-समझकर बोलने वाला।", dosha: "kapha", icon: Mountain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Mind & Emotions", question: "What is your general emotional temperament?", helpText: "What is your baseline mood when nothing is actively bothering you?" },
    hi: { category: "मन और भावनाएं", question: "आपका सामान्य भावनात्मक स्वभाव कैसा रहता है?", helpText: "जब कुछ भी परेशान नहीं कर रहा होता है, तो आपका मूड कैसा रहता है?" },
    options: [
      { en: "Restless, enthusiastic, constantly changing ideas.", hi: "बेचैन, ऊर्जावान, हमेशा नए विचारों के बारे में सोचने वाला।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Driven, goal-oriented, perfectionist, easily annoyed.", hi: "लक्ष्य पर केंद्रित, परफेक्शनिस्ट (सब कुछ सही चाहने वाला) और जल्दी गुस्सा होने वाला।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Peaceful, content, tolerant, and highly affectionate.", hi: "शांत, संतुष्ट, सहनशील और दूसरों से प्रेम करने वाला।", dosha: "kapha", icon: Brain, color: "text-emerald-500" },
    ]
  },
  {
    en: { category: "Mind & Emotions", question: "What kind of dreams do you mostly remember having?", helpText: "Dreams are a reflection of your subconscious Dosha balance." },
    hi: { category: "मन और भावनाएं", question: "आपको आमतौर पर किस तरह के सपने याद रहते हैं?", helpText: "सपने आपके अवचेतन दोष संतुलन (Dosha balance) का प्रतिबिंब होते हैं।" },
    options: [
      { en: "Flying, falling, running, feeling fearful or restless.", hi: "उड़ना, गिरना, दौड़ना, डर या बेचैनी महसूस करने वाले सपने।", dosha: "vata", icon: Wind, color: "text-primary-500" },
      { en: "Fire, violence, anger, problem-solving, or colorful scenes.", hi: "आग, गुस्सा, हिंसा, समस्या सुलझाना या बहुत रंगीन दृश्य।", dosha: "pitta", icon: Flame, color: "text-orange-500" },
      { en: "Water, romance, slow-moving peaceful scenes, or hardly dream.", hi: "पानी, रोमांस, शांत दृश्य, या बहुत कम सपने देखना।", dosha: "kapha", icon: Droplets, color: "text-emerald-500" },
    ]
  }
];

export default function PrakritiAssessment() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clinicData, setClinicData] = useState<{ name: string; hospital: any } | null>(null);

  // 🚀 LANGUAGE & QUIZ STATE
  const [language, setLanguage] = useState<"en" | "hi" | null>(null);
  const [step, setStep] = useState(0); 
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchTokenValidity = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://erpveda.vercel.app";
        const res = await axios.get(`${apiUrl}/patients/assessment/${token}`);
        setClinicData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "This assessment link is invalid or has already been completed.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTokenValidity();
  }, [token]);

  const handleLanguageSelect = (lang: "en" | "hi") => {
    setLanguage(lang);
    setStep(1); // Jump to Welcome Screen
  };

  const handleAnswer = (dosha: "vata" | "pitta" | "kapha") => {
    const newScores = { ...scores, [dosha]: scores[dosha] + 1 };
    setScores(newScores);
    setShowHelp(false);

    if (step === QUIZ_QUESTIONS.length) {
      submitAssessment(newScores);
    } else {
      setStep(step + 1);
    }
  };

  const submitAssessment = async (finalScores: { vata: number, pitta: number, kapha: number }) => {
    setIsSubmitting(true);
    try {
      const total = finalScores.vata + finalScores.pitta + finalScores.kapha;
      const percentages = {
        vata: Math.round((finalScores.vata / total) * 100),
        pitta: Math.round((finalScores.pitta / total) * 100),
        kapha: Math.round((finalScores.kapha / total) * 100),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://erpveda.vercel.app";
      await axios.post(`${apiUrl}/patients/assessment/${token}`, percentages);
      
      setStep(99); 
    } catch (err) {
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 size={40} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading secure session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-rose-100 p-4 rounded-full mb-6">
          <AlertCircle size={40} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Link Expired</h1>
        <p className="text-slate-500 max-w-sm">{error}</p>
      </div>
    );
  }

  const progressPercentage = step === 0 ? 0 : ((step - 1) / QUIZ_QUESTIONS.length) * 100;
  const currentQuestion = step > 0 && step <= QUIZ_QUESTIONS.length ? QUIZ_QUESTIONS[step - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      
      <div className="w-full max-w-md mt-4 md:mt-12 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative min-h-[550px] flex flex-col">
        
        {/* Progress Bar */}
        {step > 0 && step <= QUIZ_QUESTIONS.length && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}

        {/* 🚀 STEP 0: LANGUAGE SELECTION */}
        {step === 0 && !language && (
          <div className="flex flex-col items-center text-center p-10 flex-1 justify-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-sky-100">
              <Languages size={32} className="text-sky-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
              Choose your language
            </h1>
            <p className="text-slate-500 mb-8 text-sm">
              कृपया अपनी भाषा चुनें / Please select your preferred language.
            </p>
            
            <div className="w-full space-y-4">
              <button 
                onClick={() => handleLanguageSelect("en")}
                className="w-full bg-white border-2 border-slate-200 hover:border-sky-500 text-slate-800 p-5 rounded-2xl font-black shadow-sm active:scale-95 transition-all text-lg"
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageSelect("hi")}
                className="w-full bg-white border-2 border-slate-200 hover:border-sky-500 text-slate-800 p-5 rounded-2xl font-black shadow-sm active:scale-95 transition-all text-lg font-hindi"
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: WELCOME SCREEN (TRANSLATED) */}
        {step === 1 && language && (
          <div className="flex flex-col items-center text-center p-10 flex-1 justify-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
              <Leaf size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase mb-3">
              {clinicData?.hospital?.name || "Ayurvedic Hospital"}
            </h2>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
              {language === 'en' ? `Hello, ${clinicData?.name?.split(' ')[0]}!` : `नमस्ते, ${clinicData?.name?.split(' ')[0]}!`}
            </h1>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-10 text-left">
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                {language === 'en' 
                  ? "To provide you with highly personalized Ayurvedic care, we need to understand your Dosha Profile (Prakriti)."
                  : "आपको सर्वश्रेष्ठ आयुर्वेदिक चिकित्सा प्रदान करने के लिए, हमें आपके शरीर की प्रकृति (वात, पित्त, कफ) को समझना होगा।"
                }
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> {language === 'en' ? "Based on standard AYUSH guidelines." : "आयुष (AYUSH) मंत्रालय के दिशा-निर्देशों पर आधारित।"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> {language === 'en' ? "Comprehensive 15-question analysis." : "15 प्रश्नों का विस्तृत नैदानिक विश्लेषण।"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> {language === 'en' ? "Sent directly to your doctor's screen." : "सीधे आपके डॉक्टर की स्क्रीन पर भेजा जाएगा।"}</li>
              </ul>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {language === 'en' ? "Start Clinical Assessment" : "प्रकृति परीक्षण शुरू करें"} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEPS 2-16: BILINGUAL QUIZ QUESTIONS */}
        {currentQuestion && language && (
          <div className="p-6 md:p-8 flex-1 flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black bg-primary-50 text-primary-600 px-3 py-1 rounded-full uppercase tracking-widest border border-primary-100 flex items-center gap-1.5">
                <Activity size={12}/> {currentQuestion[language].category}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {language === 'en' ? 'Question' : 'प्रश्न'} {step - 1} / {QUIZ_QUESTIONS.length}
              </span>
            </div>
            
            <h2 className="text-xl font-extrabold text-slate-800 mb-3 leading-snug">
              {currentQuestion[language].question}
            </h2>

            {/* Need Help Toggle */}
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-sky-600 mb-6 transition-colors w-fit"
            >
              <HelpCircle size={14} /> {language === 'en' ? "Unsure what this means?" : "सवाल समझ नहीं आया?"}
            </button>

            {showHelp && (
              <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs font-bold text-sky-800 leading-relaxed">
                  {currentQuestion[language].helpText}
                </p>
              </div>
            )}
            
            <div className="space-y-3 mt-auto mb-4">
              {currentQuestion.options.map((option: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.dosha)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-[0.98] group shadow-sm flex items-center gap-4"
                >
                  <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-emerald-100 shrink-0 transition-colors ${option.color}`}>
                    <option.icon size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-800 leading-relaxed pr-2">
                    {option[language]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING SUBMISSION STATE */}
        {isSubmitting && (
           <div className="flex flex-col items-center text-center p-10 flex-1 justify-center animate-in fade-in duration-300">
             <Loader2 size={40} className="animate-spin text-emerald-600 mb-6" />
             <h2 className="text-xl font-black text-slate-800 mb-2">
               {language === 'en' ? "Analyzing Clinical Data..." : "डेटा का विश्लेषण किया जा रहा है..."}
             </h2>
             <p className="text-slate-500 text-sm">
               {language === 'en' ? "Processing your unique Vata, Pitta, and Kapha ratios." : "आपके वात, पित्त और कफ के स्तर की गणना की जा रही है।"}
             </p>
           </div>
        )}

        {/* STEP 99: SUCCESS SCREEN */}
        {step === 99 && (
          <div className="flex flex-col items-center text-center p-10 flex-1 justify-center bg-emerald-600 text-white animate-in zoom-in-95 duration-500">
            <div className="bg-white/20 p-4 rounded-full mb-6 backdrop-blur-sm shadow-inner">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-4 tracking-tight">
              {language === 'en' ? "Profile Generated!" : "प्रोफ़ाइल जनरेट हो गई!"}
            </h1>
            <p className="text-emerald-100 mb-8 leading-relaxed text-sm font-medium">
              {language === 'en' 
                ? "Your clinical Prakriti profile has been securely attached to your medical record." 
                : "आपकी नैदानिक प्रकृति रिपोर्ट सुरक्षित रूप से आपके मेडिकल रिकॉर्ड से जोड़ दी गई है।"}
            </p>
            <div className="bg-emerald-700/50 border border-emerald-500/50 p-4 rounded-2xl flex items-start gap-3">
              <Sparkles size={24} className="text-amber-300 shrink-0 mt-0.5"/>
              <p className="text-xs text-left text-emerald-50 font-medium">
                {language === 'en' 
                  ? "The doctor will review these results to prescribe a diet and treatment plan tailored specifically to your body type. You may now wait in the reception."
                  : "डॉक्टर आपके शरीर की प्रकृति के अनुसार आपको सही आहार और उपचार बताएंगे। कृपया अब आप रिसेप्शन में प्रतीक्षा करें।"}
              </p>
            </div>
          </div>
        )}

      </div>

      <p className="text-[10px] text-slate-400 mt-8 uppercase font-black tracking-widest flex items-center gap-1.5 opacity-60">
        <Leaf size={12}/> {language === 'hi' ? "Veda ERP क्लिनिकल इंटेलिजेंस द्वारा संचालित" : "Powered by Veda ERP Clinical Intelligence"}
      </p>

    </div>
  );
}