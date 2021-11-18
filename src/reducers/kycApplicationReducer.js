import { DEEEEEEP } from "./utils";
import { combineReducers } from "redux";

export const UPDATE_KYC_DETAILS = 'UPDATE_KYC_DETAILS';
export const RESET_KYC_DETAILS = 'RESET_KYC_DETAILS';
export const UPDATE_KYC_APPLICATION_STATE = 'UPDATE_KYC_APPLICATION_STATE';

export const CREATE_KYC_APPLICATION_REQUEST = 'CREATE_KYC_APPLICATION_REQUEST';
export const CREATE_KYC_APPLICATION_SUCCESS = 'CREATE_KYC_APPLICATION_SUCCESS';
export const CREATE_KYC_APPLICATION_FAILURE = 'CREATE_KYC_APPLICATION_FAILURE';

export const LOAD_KYC_APPLICATION_REQUEST = 'LOAD_KYC_APPLICATION_REQUEST';
export const LOAD_KYC_APPLICATION_SUCCESS = 'LOAD_KYC_APPLICATION_SUCCESS';
export const LOAD_KYC_APPLICATION_FAILURE = 'LOAD_KYC_APPLICATION_FAILURE';

export const EDIT_KYC_APPLICATION_REQUEST = 'EDIT_KYC_APPLICATION_REQUEST';
export const EDIT_KYC_APPLICATION_SUCCESS = 'EDIT_KYC_APPLICATION_SUCCESS';
export const EDIT_KYC_APPLICATION_FAILURE = 'EDIT_KYC_APPLICATION_FAILURE';

export const UPLOAD_DOCUMENT_REQUEST = 'UPLOAD_DOCUMENT_REQUEST';
export const UPLOAD_DOCUMENT_SUCCESS = 'UPLOAD_DOCUMENT_SUCCESS';
export const UPLOAD_DOCUMENT_FAILURE = 'UPLOAD_DOCUMENT_FAILURE';

export const CREATE_BANK_ACCOUNT_REQUEST = 'CREATE_BANK_ACCOUNT_REQUEST';
export const CREATE_BANK_ACCOUNT_SUCCESS = 'CREATE_BANK_ACCOUNT_SUCCESS';
export const CREATE_BANK_ACCOUNT_FAILURE = 'CREATE_BANK_ACCOUNT_FAILURE';


// --- used for handling local state (device)
const initialKycDetails = {
    flowStep: 1,
    country: null,
    documentType: null,
    documentFrontUri: null, // image
    documentBackUri: null, // image
    selfieUri: null, // image

    // OLD flow.
    userDetails: null,
    addressDetails: null,
    paymentDetails: null,
};

const kycDetails = (state = initialKycDetails, action) => {
    switch (action.type) {
        case UPDATE_KYC_DETAILS:
            return DEEEEEEP(state, action.payload);
        case RESET_KYC_DETAILS:
            return initialKycDetails;
        default:
            return state;
    }
};

// --- used for handling server side state
const kycApplicationState = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_KYC_APPLICATION_STATE:
            return DEEEEEEP(state, action.kyc_application);
        default:
            return state;
    }
};

const initialCreateStatusState = {
    isRequesting: false,
    error: null,
    success: false,
};

export const createStatus = (state = initialCreateStatusState, action) => {
    switch (action.type) {
        case CREATE_KYC_APPLICATION_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case CREATE_KYC_APPLICATION_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case CREATE_KYC_APPLICATION_FAILURE:
            return {...state, isRequesting: false, error: action.error};
        default:
            return state;
    }
};

const initialLoadStatusState = {
    isRequesting: false,
    error: null,
    success: false
};

export const loadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case LOAD_KYC_APPLICATION_REQUEST:
            return {...state, isRequesting: true};

        case LOAD_KYC_APPLICATION_SUCCESS:
            return {...state, isRequesting: false, success: true};

        case LOAD_KYC_APPLICATION_FAILURE:
            return {...state, isRequesting: false, error: action.error};

        default:
            return state;
    }
};

export const initialEditStatusState = {
    isRequesting: false,
    error: null,
    success: false,
};

export const editStatus = (state = initialEditStatusState, action) => {
    switch (action.type) {
        case EDIT_KYC_APPLICATION_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case EDIT_KYC_APPLICATION_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case EDIT_KYC_APPLICATION_FAILURE:
            return {...state, isRequesting: false, error: action.error};
        default:
            return state;
    }
};

export const initialUploadDocumentStatus = {
    isUploading: false,
    error: null,
    success: false
};

export const uploadDocumentStatus = (state = initialUploadDocumentStatus, action) => {
    switch (action.type) {
        case UPLOAD_DOCUMENT_REQUEST:
            return {...state, isUploading: true};

        case UPLOAD_DOCUMENT_SUCCESS:
            return {...state, isUploading: false, success: true};

        case UPLOAD_DOCUMENT_FAILURE:
            return {...state, isUploading: false, error: action.error};

        default:
            return state;
    }
};


export const initialCreateBankAccountStatus = {
    isRequesting: false,
    error: null,
    success: false,
};

export const createBankAccountStatus = (state = initialCreateBankAccountStatus, action) => {
    switch (action.type) {
        case CREATE_BANK_ACCOUNT_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case CREATE_BANK_ACCOUNT_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case CREATE_BANK_ACCOUNT_FAILURE:
            return {...state, isRequesting: false, error: action.error};
        default:
            return state;
    }
};


export const kycApplication = combineReducers({
    kycDetails,
    kycApplicationState,
    uploadDocumentStatus,
    createBankAccountStatus,
    createStatus,
    loadStatus,
    editStatus,
});


// Actions
export const resetKYCDetails = (payload) => (
    {
        type: RESET_KYC_DETAILS,
        payload
    }
);

export const updateKYCDetails = (payload) => (
    {
        type: UPDATE_KYC_DETAILS,
        payload,
    }
);

export const loadKYCApplicationRequest = (payload) => (
    {
        type: LOAD_KYC_APPLICATION_REQUEST,
        payload
    }
);

export const createKYCApplication = (payload) => (
    {
        type: CREATE_KYC_APPLICATION_REQUEST,
        payload
    }
);

export const editKYCApplicationRequest = (payload) => (
    {
        type: EDIT_KYC_APPLICATION_REQUEST,
        payload
    }
);

export const uploadDocument = (payload) => (
    {
        type: UPLOAD_DOCUMENT_REQUEST,
        payload
    }
);

export const createBankAccount = (payload) => (
    {
        type: CREATE_BANK_ACCOUNT_REQUEST,
        payload
    }
);