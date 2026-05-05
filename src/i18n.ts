import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Settings": "Settings",
      "Manage your account preferences and security settings.": "Manage your account preferences and security settings.",
      "Profile": "Profile",
      "Notifications": "Notifications",
      "Job Alerts": "Job Alerts",
      "Security": "Security",
      "Appearance": "Appearance",
      "Language": "Language",
      "Current Password": "Current Password (Hidden for security)",
      "New Password": "New Password",
      "Change Password": "Change Password",
      "Theme": "Theme",
      "Light": "Light",
      "Dark": "Dark"
    }
  },
  fr: {
    translation: {
      "Settings": "Paramètres",
      "Manage your account preferences and security settings.": "Gérez vos préférences de compte et vos paramètres de sécurité.",
      "Profile": "Profil",
      "Notifications": "Notifications",
      "Job Alerts": "Alertes d'emploi",
      "Security": "Sécurité",
      "Appearance": "Apparence",
      "Language": "Langue",
      "Current Password": "Mot de passe actuel (Masqué pour sécurité)",
      "New Password": "Nouveau mot de passe",
      "Change Password": "Changer le mot de passe",
      "Theme": "Thème",
      "Light": "Clair",
      "Dark": "Sombre"
    }
  },
  ar: {
    translation: {
      "Settings": "الإعدادات",
      "Manage your account preferences and security settings.": "إدارة تفضيلات حسابك وإعدادات الأمان.",
      "Profile": "الملف الشخصي",
      "Notifications": "الإشعارات",
      "Job Alerts": "تنبيهات الوظائف",
      "Security": "الأمان",
      "Appearance": "المظهر",
      "Language": "اللغة",
      "Current Password": "كلمة المرور الحالية (مخفية للأمان)",
      "New Password": "كلمة المرور الجديدة",
      "Change Password": "تغيير كلمة المرور",
      "Theme": "السمة",
      "Light": "فاتح",
      "Dark": "داكن"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
