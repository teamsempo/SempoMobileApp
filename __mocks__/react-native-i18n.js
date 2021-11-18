export const getLanguages = jest.fn(); // should return an ARRAY

export default class I18n {
}

I18n.currentLocale = function() {
    return 'en'
};