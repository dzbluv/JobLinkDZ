import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'FR' | 'AR';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.browse': { EN: 'Browse Jobs', FR: 'Parcourir', AR: 'تصفح الوظائف' },
  'nav.dashboard': { EN: 'Dashboard', FR: 'Tableau de bord', AR: 'لوحة التحكم' },
  'nav.profile': { EN: 'My Profile', FR: 'Mon Profil', AR: 'ملفي الشخصي' },
  'nav.settings': { EN: 'Settings', FR: 'Paramètres', AR: 'الإعدادات' },
  'nav.login': { EN: 'Login', FR: 'Connexion', AR: 'تسجيل الدخول' },
  'nav.register': { EN: 'Register', FR: 'S\'inscrire', AR: 'إنشاء حساب' },
  
  // Landing / Home
  'hero.title': { EN: 'Find Your Next Dream Job in Algeria', FR: 'Trouvez votre prochain emploi de rêve en Algérie', AR: 'جد وظيفة أحلامك القادمة في الجزائر' },
  'hero.subtitle': { EN: 'Connect with top companies and take your career to the next level.', FR: 'Connectez-vous avec les meilleures entreprises et propulsez votre carrière.', AR: 'تواصل مع كبرى الشركات وارتقِ بمسيرتك المهنية إلى المستوى التالي.' },
  
  // Jobs Page
  'jobs.title': { EN: 'Explore Opportunities', FR: 'Explorer les opportunités', AR: 'استكشف الفرص' },
  'jobs.search': { EN: 'Search jobs...', FR: 'Rechercher des emplois...', AR: 'البحث عن وظائف...' },
  'jobs.filter': { EN: 'Filters', FR: 'Filtres', AR: 'الفلاتر' },
  'jobs.none': { EN: 'No jobs found', FR: 'Aucun emploi trouvé', AR: 'لم يتم العثور على وظائف' },
  
  // Job Card
  'card.details': { EN: 'View Details', FR: 'Voir Détails', AR: 'عرض التفاصيل' },
  'card.apply': { EN: 'Apply Now', FR: 'Postuler', AR: 'قدم الآن' },
  'card.posted': { EN: 'Posted', FR: 'Publié le', AR: 'نشر في' },
  
  // Profile
  'profile.title': { EN: 'Profile Settings', FR: 'Paramètres du profil', AR: 'إعدادات الملف الشخصي' },
  'profile.save': { EN: 'Save Profile', FR: 'Enregistrer', AR: 'حفظ الملف' },
  'profile.skills': { EN: 'Core Strengths', FR: 'Compétences clés', AR: 'المهارات الأساسية' },
  
  // Common
  'common.loading': { EN: 'Loading...', FR: 'Chargement...', AR: 'جاري التحميل...' },
  'common.error': { EN: 'An error occurred', FR: 'Une erreur est survenue', AR: 'حدث خطأ ما' },
  'common.success': { EN: 'Success!', FR: 'Succès !', AR: 'تم بنجاح!' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'AR';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language.toLowerCase();
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
