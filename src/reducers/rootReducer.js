import { combineReducers } from 'redux';

import { login, setPin, openApp, verifyPin } from './authReducer';
import { locale } from './localeReducer'
import { newFeedbackData } from './feedbackReducer'
import { networkStatus } from './networkStatusReducer'
import { newExportRequest } from "./exportReducer";
import { imageUpload } from "./imageUploadReducer"

import { users } from './userReducer.js';
import { transferAccounts } from './transferAccountReducer.js';
import { creditTransfers } from './creditTransferReducer.js';
import { transferCache } from "./transferCacheReducer.js";
import { version } from './versionReducer.js';
import { NFC } from './nfcReducer'
import { transferCards } from './transferCardReducer.js'
import { kycApplication } from './kycApplicationReducer.js';
import { tokens } from "./tokenReducer"

const appReducer = combineReducers({
    // nav,
    login,
    setPin,
    verifyPin,
    openApp,
    locale,
    networkStatus,
    newFeedbackData,
    newExportRequest,
    imageUpload,
    users,
    tokens,
    transferAccounts,
    creditTransfers,
    transferCache,
    version,
    transferCards,
    NFC,
    kycApplication
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        //We don't reset the transfer cache on app reset because it's not saved on server
        let transferCache = state.transferCache;

        state = {};
        state.transferCache = transferCache;
    }
    return appReducer(state, action)
};

export default rootReducer;