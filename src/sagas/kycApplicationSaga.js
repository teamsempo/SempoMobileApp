import { put, takeEvery, call, all } from 'redux-saga/effects';

import {
    UPDATE_KYC_DETAILS,
    CREATE_KYC_APPLICATION_REQUEST,
    CREATE_KYC_APPLICATION_SUCCESS,
    CREATE_KYC_APPLICATION_FAILURE,
    LOAD_KYC_APPLICATION_REQUEST,
    LOAD_KYC_APPLICATION_SUCCESS,
    LOAD_KYC_APPLICATION_FAILURE,
    EDIT_KYC_APPLICATION_REQUEST,
    EDIT_KYC_APPLICATION_SUCCESS,
    EDIT_KYC_APPLICATION_FAILURE,
    UPDATE_KYC_APPLICATION_STATE,
    UPLOAD_DOCUMENT_REQUEST,
    UPLOAD_DOCUMENT_SUCCESS,
    UPLOAD_DOCUMENT_FAILURE,
    CREATE_BANK_ACCOUNT_REQUEST,
    CREATE_BANK_ACCOUNT_SUCCESS,
    CREATE_BANK_ACCOUNT_FAILURE,
} from "../reducers/kycApplicationReducer";

import {
    createKYCApplicationAPI,
    loadKYCApplicationAPI,
    editKYCApplicationAPI,
    uploadDocumentAPI,
    createBankAccountAPI,
} from "../api/kycApplicationAPI";

import { handleError, convertURItoBase64 } from "../utils";

function* updateStateFromKYCApplication(data) {
    let kyc_application = data.kyc_application;
    if (kyc_application) {
        yield put({type: UPDATE_KYC_APPLICATION_STATE, kyc_application});
    }
}


// Load KYC Application Saga
function* loadKycApplication({payload}) {
    try {
        const load_result = yield call(loadKYCApplicationAPI, payload);

        yield call(updateStateFromKYCApplication, load_result.data);

        yield put({type: LOAD_KYC_APPLICATION_SUCCESS});

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: LOAD_KYC_APPLICATION_FAILURE, error: error});
    }
}

function* watchLoadKycApplication() {
    yield takeEvery(LOAD_KYC_APPLICATION_REQUEST, loadKycApplication);
}

// Create KYC Application Saga
function* createKycApplication({payload}) {
    try {

        yield put({type: UPDATE_KYC_DETAILS, payload: {flowStep: 6}});  // navigate to the loading/outcome page

        var image_types = ['document_front_base64', 'document_back_base64', 'selfie_base64'];
        // convert images from URI to base64
        for (var i =0; i < image_types.length; i++) {
            let uri = payload.body[image_types[i]];
            if (typeof uri !== 'undefined' && uri !== null) {
                const base64 = yield call(convertURItoBase64, uri);
                payload.body[image_types[i]] = base64;
            }
        }

        const create_result = yield call(createKYCApplicationAPI, payload);

        yield call(updateStateFromKYCApplication, create_result.data);

        yield put({type: CREATE_KYC_APPLICATION_SUCCESS});

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: CREATE_KYC_APPLICATION_FAILURE, error: error});

    }
}

function* watchCreateKycApplication() {
    yield takeEvery(CREATE_KYC_APPLICATION_REQUEST, createKycApplication)
}


// edit KYC Application state Saga
function* editKycApplication({ payload }) {
    try {
        yield put({type: UPDATE_KYC_DETAILS, payload: {flowStep: 6}});  // navigate to the loading/outcome page

        const edit_result = yield call(editKYCApplicationAPI, payload);

        var image_types = ['document_front_base64', 'document_back_base64', 'selfie_base64'];
        // convert images from URI to base64
        for (var i =0; i < image_types.length; i++) {
            let uri = payload.body[image_types[i]];
            if (typeof uri !== 'undefined' && uri !== null) {
                const base64 = yield call(convertURItoBase64, uri);
                payload.body[image_types[i]] = base64;
            }
        }

        yield call(updateStateFromKYCApplication, edit_result.data);

        yield put({type: EDIT_KYC_APPLICATION_SUCCESS});

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: EDIT_KYC_APPLICATION_FAILURE, error: error});
    }
}

function* watchEditKycApplication() {
    yield takeEvery(EDIT_KYC_APPLICATION_REQUEST, editKycApplication);
}


// upload document saga
function* uploadDocument({payload}) {
    try {
        const create_result = yield call(uploadDocumentAPI, payload);

        yield call(updateStateFromKYCApplication, create_result.data);

        yield put({type: UPLOAD_DOCUMENT_SUCCESS})

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: UPLOAD_DOCUMENT_FAILURE, error: error});

    }
}

function* watchUploadDocument() {
    yield takeEvery(UPLOAD_DOCUMENT_REQUEST, uploadDocument)
}

// create bank account saga
function* createBankAccount({payload}) {
    try {
        const create_result = yield call(createBankAccountAPI, payload);

        yield call(updateStateFromKYCApplication, create_result.data);

        yield put({type: EDIT_KYC_APPLICATION_REQUEST, payload: { body: {kyc_status: 'PENDING' }}});  // this is here to complete the KYC application to PENDING STATE.

        yield put({type: CREATE_BANK_ACCOUNT_SUCCESS});

    } catch (fetch_error) {

        const error = yield call(handleError, fetch_error);

        yield put({type: CREATE_BANK_ACCOUNT_FAILURE, error: error});

    }
}

function* watchCreateBankAccount() {
    yield takeEvery(CREATE_BANK_ACCOUNT_REQUEST, createBankAccount)
}


export default function* kycApplicationSaga() {
    yield all([
        watchEditKycApplication(),
        watchLoadKycApplication(),
        watchCreateKycApplication(),
        watchUploadDocument(),
        watchCreateBankAccount(),
    ])
}