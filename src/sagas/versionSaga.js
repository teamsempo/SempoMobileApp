import { put, takeEvery, call, all, select } from 'redux-saga/effects'
import { handleError}  from "../utils";

import {
    CHECK_VERSION_REQUEST,
    checkVersionSuccess,
    checkVersionFailure,
    resetVersionModal,
} from '../actions/versionActions.js';

import { checkVersionAPI } from '../api/versionAPI.js'

export function* checkVersion({ payload }) {
    try {
        const result = yield call(checkVersionAPI, payload);

        if (result.action === 'ok') {
            // reset dismissed version modal state
            yield put(resetVersionModal())
        }

        yield put(checkVersionSuccess(result))

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);
        
        yield put(checkVersionFailure(error))
    }
}

function* watchCheckVersion() {
    yield takeEvery(CHECK_VERSION_REQUEST, checkVersion);
}

export default function* versionSaga() {
    yield all([
        watchCheckVersion(),
    ])
}