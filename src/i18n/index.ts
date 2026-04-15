import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import de from './locales/de/translation.json'
import fr from './locales/fr/translation.json'
import es from './locales/es/translation.json'
import it from './locales/it/translation.json'
import nl from './locales/nl/translation.json'
import pl from './locales/pl/translation.json'
import sv from './locales/sv/translation.json'
import pt from './locales/pt/translation.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      it: { translation: it },
      nl: { translation: nl },
      pl: { translation: pl },
      sv: { translation: sv },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'sv', 'pt'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'p4c-language',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
