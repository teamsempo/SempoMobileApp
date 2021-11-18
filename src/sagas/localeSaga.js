import { call, put, all, cancelled, takeEvery } from 'redux-saga/effects';

import { removeLocale } from '../utils';
import { storedLocale, changeLanguage } from '../../locales/i18n.js'

import {
    LOCALE_REFRESH,
    LOCALE_REQUEST,
    LOCALE_SUCCESS,
    LOCALE_FAILURE,
} from '../reducers/localeReducer';

function* watchRefreshLocale() {
    yield takeEvery(LOCALE_REFRESH, refreshLocale);
}

export function* refreshLocale() {
    try {
        const locale_request = yield call(storedLocale);

        if (locale_request) {
            // SAVE LOCALE, isRTL

            yield put({
                type: LOCALE_SUCCESS,
                locale: locale_request.LocaleIsStored,
                isRTL: locale_request.isRTL,
            });

            return locale_request
        }
    } catch(error) {
        yield put({type: LOCALE_FAILURE});
        yield call(removeLocale);
        return error
    } finally {
        if (yield cancelled()) {
            // ... put special cancellation handling code here
        }
    }
}

function* watchChangeLocale() {
    yield takeEvery(LOCALE_REQUEST, changeLocale);
}

export function* changeLocale({locale}) {
    try {
        const locale_request = yield call(changeLanguage, locale);

        if (locale_request) {
            // SAVE LOCALE, isRTL

            yield put({
                type: LOCALE_SUCCESS,
                locale: locale_request.itemValue,
                isRTL: locale_request.isRTL,
            });

            return locale_request
        }
    } catch(error) {
        yield put({type: LOCALE_FAILURE});
        yield call(removeLocale);
        return error
    } finally {
        if (yield cancelled()) {
            // ... put special cancellation handling code here
        }
    }
}

export default function* localeSagas() {
    yield all([
        refreshLocale(),
        watchRefreshLocale(),
        watchChangeLocale(),
    ])
}