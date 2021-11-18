import { take, fork, put, takeEvery, call, all, cancelled, cancel, race} from 'redux-saga/effects'

import {
    LOAD_TRANSFER_CARDS_REQUEST,
    LOAD_TRANSFER_CARDS_SUCCESS,
    LOAD_TRANSFER_CARDS_FAILURE,
    LOAD_SINGLE_TRANSFER_CARD_REQUEST,
    LOAD_SINGLE_TRANSFER_CARD_SUCCESS,
    LOAD_SINGLE_TRANSFER_CARD_FAILURE
} from '../reducers/transferCardReducer.js';

import { loadTransferCardsAPI, loadSingleTransferCardAPI } from '../api/transferCardAPI'

export function* loadTransferCards() {
    try {
        const result = yield call(loadTransferCardsAPI);
        yield put({type: LOAD_TRANSFER_CARDS_SUCCESS, result});
    } catch (error) {
        yield put({type: LOAD_TRANSFER_CARDS_FAILURE, error: error})
    }
}

export function* loadSingleTransferCard(nfc_serial_number) {
    try {
        const result = yield call(loadSingleTransferCardAPI, nfc_serial_number);
        yield put({type: LOAD_SINGLE_TRANSFER_CARD_SUCCESS, result});

        return true
    } catch (error) {
        yield put({type: LOAD_SINGLE_TRANSFER_CARD_FAILURE, error: error})
        return false
    }
}


export function* watchLoadTransferCards() {
    yield takeEvery(LOAD_TRANSFER_CARDS_REQUEST, loadTransferCards);
}


export default function* transferCardsSagas() {
    yield all([
        watchLoadTransferCards()
    ])
}