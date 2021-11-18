import { put, takeEvery, call, all } from 'redux-saga/effects'
import { schema, arrayOf, normalize } from 'normalizr';
import {handleError} from "../utils";

import { userSchema } from '../schemas'

import {
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,

    USER_BY_PUBLIC_SERIAL_REQUEST,
    USER_BY_PUBLIC_SERIAL_SUCCESS,
    USER_BY_PUBLIC_SERIAL_FAILURE,
} from '../reducers/userReducer.js';

import { loadUserAPI, loadUserFromPublicSerialNumber } from "../api/userAPI";
import {updateStateFromData } from "../reducers/utils";

// Load User Saga
function* loadUser({ payload }) {
    try {
        const load_result = yield call(loadUserAPI);

        yield call(updateStateFromData, load_result.data.user, userSchema);

        yield put({type: LOAD_USER_SUCCESS})

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: LOAD_USER_FAILURE, error: error})
    }
}

function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

// Get User from public serial number
function* getUserFromPublicSerialNumber({ payload }) {
    try {
        const load_result = yield call(loadUserFromPublicSerialNumber, payload);
        yield put({type: USER_BY_PUBLIC_SERIAL_SUCCESS, load_result})

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: USER_BY_PUBLIC_SERIAL_FAILURE, error: error})
    }
}

function* watchGetUserFromPublicSerialNumber() {
    yield takeEvery(USER_BY_PUBLIC_SERIAL_REQUEST, getUserFromPublicSerialNumber)
}

export default function* userSagas() {
    yield all([
        watchLoadUser(),
        watchGetUserFromPublicSerialNumber(),
    ])
}