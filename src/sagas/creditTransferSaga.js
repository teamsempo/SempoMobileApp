import {all, call, put, takeEvery} from 'redux-saga/effects'
import {normalize} from 'normalizr'
import {handleError} from "../utils";

import {
    CREATE_TRANSFER_FAILURE,
    CREATE_TRANSFER_REQUEST,
    CREATE_TRANSFER_SUCCESS,
    LOAD_CREDIT_TRANSFERS_FAILURE,
    LOAD_CREDIT_TRANSFERS_REQUEST,
    LOAD_CREDIT_TRANSFERS_SUCCESS,
} from '../reducers/creditTransferReducer.js';

import {UPDATE_TRANSFER_ACCOUNT_BALANCE, UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS} from '../reducers/transferAccountReducer.js';

import {loadTransfersAPI, newTransferAPI} from '../api/transferAPI.js'
import {creditTransferSchema} from "../schemas";

import {REMOVE_TRANSFER_FROM_CACHE} from "../reducers/transferCacheReducer";
import {updateStateFromData, updateStateFromNormalizedData, updateStateFromResult} from "../reducers/utils";

function* updateStateFromCreditTransfer(result) {

    //Schema expects a list of credit transfer objects
    if (result.data.credit_transfers) {
        var credit_transfer_list = result.data.credit_transfers
    } else {
        credit_transfer_list = [result.data.credit_transfer]
    }

    const normalizedData = normalize(credit_transfer_list, creditTransferSchema);

    yield updateStateFromNormalizedData(normalizedData)

    //TODO: This seems kinda out of place with the way the rest of the state updates work? Also random str comp?
    if (result.message === 'Payment Successful') {
        // a single transfer was just created!
        // we need to add the newly created credit_transfer id
        // to the associated transfer_account object credit_transfer array
        yield put({type: UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS, credit_transfer_list});
    }

}

// Load transfers saga
function* loadTransfers({ payload }) {

    try {
        const load_result = yield call(loadTransfersAPI, payload);

        yield call(
            updateStateFromData,
            load_result.data.credit_transfers,
            creditTransferSchema
        );

        yield put({type: LOAD_CREDIT_TRANSFERS_SUCCESS})

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: LOAD_CREDIT_TRANSFERS_FAILURE, error: error})
    }
}

function* watchLoadTransfers() {
    yield takeEvery(LOAD_CREDIT_TRANSFERS_REQUEST, loadTransfers);
}


function* createTransfer({ payload }) {

    try {
        const result = yield call(newTransferAPI, payload);

        yield call(updateStateFromCreditTransfer, result);

        yield put({type: CREATE_TRANSFER_SUCCESS, result});

        yield put({
            type: UPDATE_TRANSFER_ACCOUNT_BALANCE,
            credit_transfer: result.data.credit_transfer
        });

        let uuid = result.data.credit_transfer.uuid;
        if (uuid) {
            yield put({type: REMOVE_TRANSFER_FROM_CACHE, uuid})
        }

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: CREATE_TRANSFER_FAILURE, error: error});

    }
}

function* watchCreateTransfer() {
    yield takeEvery(CREATE_TRANSFER_REQUEST, createTransfer);
}

// function* addPusherTransfer({ payload }) {
//     try {
//
//         let result = Object({data: Object({credit_transfers: payload})});
//
//         yield call(updateStateFromCreditTransfer, result);
//
//         yield put({type: CREATE_TRANSFER_SUCCESS, result});
//
//     } catch (fetch_error) {
//
//         const error = yield call(handleError, fetch_error);
//
//         yield put({type: CREATE_TRANSFER_FAILURE, error: error});
//
//     }
// }


export default function* creditTransferSagas() {
    yield all([
        watchLoadTransfers(),
        watchCreateTransfer(),
    ])
}