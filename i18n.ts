// i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEN from './locales/en.json'
import translationKA from './locales/ka.json'
import translationRU from './locales/ru.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

const resources = {
  en: {
    translation: translationEN,
  },
  ka: {
    translation: translationKA,
  },
  ru: {
    translation: translationRU,
  },
}

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if detection fails
    defaultNS: 'translation',
    // lng: 'ka', // Removed hardcoded language to allow detector to work
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'finmodel_lang', // Key to store language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: false, // Avoid issues with SSR/Hydration
    }
  })

export default i18n