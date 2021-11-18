import { take, fork, put, takeEvery, call, all, cancelled, cancel, race} from 'redux-saga/effects'

import {
    IMAGE_UPLOAD_FAILURE,
    IMAGE_UPLOAD_REQUEST,
    IMAGE_UPLOAD_SUCCESS,
} from '../reducers/imageUploadReducer.js';

import { imageUploadAPI } from '../api/ImageUploadAPI'

function* ImageUpload({imageData, imageType, transferId}) {
    try {
        const upload_result = yield call(imageUploadAPI, imageData, imageType, transferId);
        yield put({type: IMAGE_UPLOAD_SUCCESS, upload_result});
    } catch (error) {
        yield put({type: IMAGE_UPLOAD_FAILURE, error: error})
    }
}

function* watchImageUpload() {
    yield takeEvery(IMAGE_UPLOAD_REQUEST, ImageUpload);
}

export default function* imageUploadSaga() {
    yield all([
        watchImageUpload()
    ])
}