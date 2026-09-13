import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      login: 'دخول',
      cashier: 'الكاشير',
      orders: 'الطلبات',
      pending: 'المعلقة',
      confirm: 'تأكيد (F12)',
      hold: 'تعليق الفاتورة (F9)',
      total: 'الإجمالي',
      search: 'بحث',
    },
  },
  en: {
    translation: {
      username: 'Username',
      password: 'Password',
      login: 'Login',
      cashier: 'Cashier',
      orders: 'Orders',
      pending: 'Pending',
      confirm: 'Confirm (F12)',
      hold: 'Hold (F9)',
      total: 'Total',
      search: 'Search',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

export default i18n;
export function applyDir(lang: string) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}
