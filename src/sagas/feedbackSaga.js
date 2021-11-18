import { take, fork, put, takeEvery, call, all, cancelled, cancel, race} from 'redux-saga/effects'

import {
    NEW_FEEDBACK_REQUEST,
    NEW_FEEDBACK_SUCCESS,
    NEW_FEEDBACK_FAILURE,
} from '../reducers/feedbackReducer.js';

import { sendFeedbackAPI } from '../api/feedbackAPI'

export function* newFeedback({question, rating, additional_information }) {
    try {
        const feedback_result = yield call(sendFeedbackAPI, question, rating, additional_information);
        yield put({type: NEW_FEEDBACK_SUCCESS, feedback_result});
        // TODO: add logic on when to fire & where to navigate to
    } catch (error) {
        yield put({type: NEW_FEEDBACK_FAILURE, error: error})
    }
}

function* watchSendFeedback() {
    yield takeEvery(NEW_FEEDBACK_REQUEST, newFeedback);
}

export default function* newFeedbackSaga() {
    yield all([
        watchSendFeedback()
    ])
}