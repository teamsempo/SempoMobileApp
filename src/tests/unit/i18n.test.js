import { getShorthandLocale, storedLocale, translations, lanuageUtils, changeLanguage } from "../../../locales/i18n.js";
import { storeLocale } from '../../utils.js';
import I18n, { getLanguages } from '../../../__mocks__/react-native-i18n.js';

describe('getShorthandLocale', () => {
    it('return a parsed locale', () => {
        const tests = [
            ['en', 'en'],
            ['en-US', 'en'],
        ];
        tests.forEach(([locale, formatted]) => {
            expect(getShorthandLocale([locale])).toEqual(formatted)
        })
    })
});

describe('storedLocale', () => {
    it('fallbacks to english if no locale stored or found on device', () => {
        getLanguages.mockImplementation(() => null);
        return storedLocale().then(result => {
            expect(result).toEqual({"LocaleIsStored": 'en', "isRTL": false})
        })
    });

    it('translation exists for device preference', () => {
        const randomTranslation = translations[Math.floor(Math.random() * translations.length)];
        const expected = getShorthandLocale([randomTranslation]);
        getLanguages.mockImplementation(() => [expected]); // mocking I18n getLanguages fn
        return storedLocale().then(result => {
            expect(result).toEqual({"LocaleIsStored": expected, "isRTL": lanuageUtils(expected)})
        })
    });

    it('storedLocale already exists on device', () => {
        const randomTranslation = translations[Math.floor(Math.random() * translations.length)];
        const expected = getShorthandLocale([randomTranslation]);
        storeLocale(expected) // store locale on device
        return storedLocale().then(result => {
            expect(result).toEqual({"LocaleIsStored": expected, "isRTL": lanuageUtils(expected)})
        })
    })
});

describe('changeLanguage', () => {
    it('save a translation on device', () => {
        const randomTranslation = translations[Math.floor(Math.random() * translations.length)];
        const expected = getShorthandLocale([randomTranslation]);

        const result = changeLanguage(randomTranslation);
        expect(result).toEqual({"LocaleIsStored": expected, "isRTL": lanuageUtils(expected)})
    });

    it('no translation', () => {
        const result = changeLanguage('gr');
        expect(result).toEqual('No translation for: gr')
    })
});


/**
 * Returns the number of nested Keys in our JSON Locales File.
 * @param locale
 * @returns {Promise<any[]>}
 */
function getSize(locale) {
    let objectSize = function(obj) { var size = 0, key; for (key in obj) { if (obj.hasOwnProperty(key)) size++;} return size};

    return Promise.all([import(`../../../locales/${locale}.json`).then((obj) => {
        let flattenedObject = Object.assign({}, ...function _flatten(o) { return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({[k]: o[k]})))}(obj));
        return objectSize(flattenedObject)
    })])
}

describe('translation files', () => {
    const nonEnglishTranslations = translations.filter(x => x.length ===2 && x !== 'en');
    var englishFileLength = null;

    it('calculate english file length', async () => {
        englishFileLength = await getSize('en').then(result => {return result[0]})
    });

    nonEnglishTranslations.forEach((locale) => {
        it(`check locale: ${locale}`, () => {
            return getSize(locale).then(result => {
                return expect(result[0]).toEqual(englishFileLength)
            });
        })
    })
});