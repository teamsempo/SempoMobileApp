export const LOCALE_REFRESH = 'LOCALE_REFRESH';
export const LOCALE_REQUEST = 'LOCALE_REQUEST';
export const LOCALE_SUCCESS = 'LOCALE_SUCCESS';
export const LOCALE_FAILURE = 'LOCALE_FAILURE';

export const initialLocaleState = {
    isRetrievingLocale: false,
    locale: null,
    isRTL: null,
};

export const locale = (state = initialLocaleState, action) => {
    switch (action.type) {
        case LOCALE_REFRESH:
            return {...state, isRetrievingLocale: true};
        case LOCALE_REQUEST:
            return {...state, isRetrievingLocale: true};
        case LOCALE_SUCCESS:
            return {...state, isRetrievingLocale: false, locale: action.locale, isRTL: action.isRTL};
        case LOCALE_FAILURE:
            return {...state, isRetrievingLocale: false, locale: null, isRTL: null, error: true};
        default:
            return state;
    }
};


// ACTIONS

export const localeRequest = (locale) => (
    {
        type: LOCALE_REQUEST,
        locale
    }
);