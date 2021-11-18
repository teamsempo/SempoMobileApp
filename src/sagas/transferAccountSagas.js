import { put, takeEvery, call, all } from 'redux-saga/effects'
import {handleError} from "../utils";

import { transferAccountSchema } from '../schemas'

import {
    LOAD_TRANSFER_ACCOUNTS_REQUEST,
    LOAD_TRANSFER_ACCOUNTS_SUCCESS,
    LOAD_TRANSFER_ACCOUNTS_FAILURE
} from '../reducers/transferAccountReducer.js'

import {loadTransferAccountsAPI} from "../api/transferAccountAPI";
import {updateStateFromData} from "../reducers/utils";

function* loadTransferAccounts() {
    try {
        const load_result = yield call(loadTransferAccountsAPI);

        yield call(updateStateFromData, load_result.data.transfer_accounts, transferAccountSchema);

        yield put({type: LOAD_TRANSFER_ACCOUNTS_SUCCESS})

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: LOAD_TRANSFER_ACCOUNTS_FAILURE, error: error})
    }
}

function* watchLoadTransferAccounts() {
    yield takeEvery(LOAD_TRANSFER_ACCOUNTS_REQUEST, loadTransferAccounts)
}

export default function* transferAccountSagas() {
    yield all([
        watchLoadTransferAccounts(),
    ])
}