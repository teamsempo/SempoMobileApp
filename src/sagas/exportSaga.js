import { put, takeEvery, call, all } from 'redux-saga/effects'
import { handleError}  from "../utils";

import {
    NEW_EXPORT_REQUEST,
    NEW_EXPORT_SUCCESS,
    NEW_EXPORT_FAILURE,
} from '../reducers/exportReducer.js';

import { exportAPI } from '../api/exportAPI'

export function* newExport({ date_range, email }) {
    try {
        const result = yield call(exportAPI, date_range, email);
        yield put({type: NEW_EXPORT_SUCCESS, file_url: result.file_url});
    } catch (fetch_error) {
        const error = yield call(handleError, fetch_error);
        yield put({type: NEW_EXPORT_FAILURE, error: error})
    }
}

function* watchNewExport() {
    yield takeEvery(NEW_EXPORT_REQUEST, newExport);
}

export default function* newExportSaga() {
    yield all([
        watchNewExport()
    ])
}