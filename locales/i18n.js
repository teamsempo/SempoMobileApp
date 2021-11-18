import ReactNative, {AsyncStorage, I18nManager, Alert} from 'react-native';
import I18n, {getLanguages } from 'react-native-i18n';

import {storeLocale, getLocale} from '../src/utils';


// Import all locales
import en from './en.json';
import ar from './ar.json';
import fr from './fr.json';
import bi from './bi.json';
import es from './es.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
    en,
    ar,
    fr,
    bi,
    es
};

export const translations = ['en', 'ar', 'fr', 'bi', 'en-US', 'en-AU', 'es'];

export function getShorthandLocale(locale) {
    if (typeof locale === undefined || !locale) {
        return null
    }

    if (Array.isArray(locale)) {
        // if array get first item
        locale = locale[0]
    }

    if (locale.length === 5) {
        return locale.slice(0, 2).toString();
    }

    return locale
}

export const storedLocale = async () => {
    const LocaleIsStored = await getLocale();
    if (LocaleIsStored) {
        // DEFAULT TO THE SAVED LOCALE

        I18n.locale = LocaleIsStored;
        const isRTL = lanuageUtils(LocaleIsStored);

        return {LocaleIsStored, isRTL}
    } else {
        // GET DEVICE PREFERENCES

        const currentLocale = await getLanguages();
        const LocaleIsStored = getShorthandLocale(currentLocale);

        if (translations.indexOf(LocaleIsStored) !== -1) {
            // DEVICE PREF LOCALE EXISTS

            I18n.locale = LocaleIsStored;
            const isRTL = lanuageUtils(LocaleIsStored);
            storeLocale(LocaleIsStored);
            return {LocaleIsStored, isRTL}
        } else {
            // FALLBACK TO ENGLISH
            const LocaleIsStored = 'en';
            I18n.locale = LocaleIsStored;
            const isRTL = lanuageUtils('en');
            return {LocaleIsStored, isRTL}
        }
    }
};

export const changeLanguage = (itemValue) => {
    if (translations.indexOf(itemValue) === -1) {
        // translation doesn't exist, don't save
        return `No translation for: ${itemValue}`
    }

    const LocaleIsStored = getShorthandLocale(itemValue);  // double check it's ISO 2

    I18n.locale = LocaleIsStored;
    const isRTL = lanuageUtils(LocaleIsStored);
    storeLocale(LocaleIsStored);
    return {LocaleIsStored, isRTL}
};

const currentLocale = I18n.currentLocale().toString();
// const currentLocale = storedLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;


export function lanuageUtils(locale) {
    I18n.locale = locale;
    const currentLocale = I18n.currentLocale();
    const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

    // Allow RTL alignment in RTL languages
    ReactNative.I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    return isRTL;
}

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
    return I18n.t(name, params);
};

export default I18n;