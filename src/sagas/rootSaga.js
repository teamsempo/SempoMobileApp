import { all } from 'redux-saga/effects'

import authSagas from './authSaga'
import localeSagas from './localeSaga'
import newFeedbackSaga from './feedbackSaga'
import newExportSaga from './exportSaga'
import imageUploadSaga from './imageUploadSaga'
import versionSaga from './versionSaga'
import nfcSagas from './nfcSaga'
import transferCardsSagas from './transferCardSaga'
import kycApplicationSaga from './kycApplicationSaga'

import userSagas from './userSaga.js'
import creditTransferSagas from './creditTransferSaga.js'
import transferAccountSagas from "./transferAccountSagas";
import transferCacheSagas from "./transferCacheSaga"

export default function* rootSaga() {
    yield all([
        authSagas(),
        localeSagas(),
        newFeedbackSaga(),
        newExportSaga(),
        imageUploadSaga(),
        userSagas(),
        creditTransferSagas(),
        transferCacheSagas(),
        versionSaga(),
        nfcSagas(),
        transferCardsSagas(),
        kycApplicationSaga(),
        transferAccountSagas()
    ])
}