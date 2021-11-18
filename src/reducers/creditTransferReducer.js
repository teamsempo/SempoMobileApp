import { combineReducers } from "redux";
import { DEEEEEEP } from "./utils";
import { IMAGE_UPLOAD_SUCCESS } from "./imageUploadReducer";

export const UPDATE_CREDIT_TRANSFER_LIST = "UPDATE_CREDIT_TRANSFER_LIST";

export const LOAD_CREDIT_TRANSFERS_REQUEST = 'LOAD_CREDIT_TRANSFERS_REQUEST';
export const LOAD_CREDIT_TRANSFERS_SUCCESS = 'LOAD_CREDIT_TRANSFERS_SUCCESS';
export const LOAD_CREDIT_TRANSFERS_FAILURE = 'LOAD_CREDIT_TRANSFERS_FAILURE';

export const UPDATE_TRANSFER_DATA = "UPDATE_TRANSFER_DATA";
export const RESET_TRANSFER_DATA = "RESET_TRANSFER_DATA";

export const CREATE_TRANSFER_REQUEST = 'CREATE_TRANSFER_REQUEST';
export const CREATE_TRANSFER_SUCCESS = 'CREATE_TRANSFER_SUCCESS';
export const CREATE_TRANSFER_FAILURE = 'CREATE_TRANSFER_FAILURE';

export const RESET_NEW_TRANSFER = 'RESET_NEW_TRANSFER';

export const RECORD_NFC_CARD_ERROR = 'RECORD_NFC_CARD_ERROR';
export const REMOVE_NFC_CARD_ERROR = 'REMOVE_NFC_CARD_ERROR';

export const byId = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CREDIT_TRANSFER_LIST:
            return DEEEEEEP(state, action.credit_transfers);

        case IMAGE_UPLOAD_SUCCESS:
            if (action.upload_result.data.uploaded_image.credit_transfer_id) {
                let newState = { ...state };
                newState[action.upload_result.data.uploaded_image.credit_transfer_id].attached_images.push(
                    action.upload_result.data.uploaded_image
                );
                return newState
            } else {
                return state
            }

        default:
            return state;
    }
};

export const initialLoadStatusState = {
    isRequesting: false,
    error: null,
    success: false,
    numberAdded: 1
};

export const loadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case LOAD_CREDIT_TRANSFERS_REQUEST:
            return { ...state, isRequesting: true };

        case LOAD_CREDIT_TRANSFERS_SUCCESS:
            return { ...state, isRequesting: false, success: true };

        case LOAD_CREDIT_TRANSFERS_FAILURE:
            return { ...state, isRequesting: false, error: action.error };
        case UPDATE_CREDIT_TRANSFER_LIST:
            return { ...state, numberAdded: Object.keys(action.credit_transfers).length };
        default:
            return state;
    }
};


export const initialTransferDataState = {
    user_id: null,
    transfer_amount: 0,
    transfer_use: null,
    transfer_random_key: null,
    is_sending: false,
    transfer_account_name: null,
    my_matching_transfer_accounts: null,
    my_transfer_account_id: null,
    token_symbol: null,

    // HANDLES PAYMENT FLOW
    counterparty_user_id: null,
    public_identifier: null,  // don't default reset as need for ETH transfers
    temp_transfer_mode: null,  // used for ETH transfers
    default_transfer_mode: null,

    // Catches NFC errors for retry capacity:
    errored_NFC_id: null
};

export const transferData = (state = initialTransferDataState, action) => {
    switch (action.type) {
        case UPDATE_TRANSFER_DATA:
            return DEEEEEEP(state, action.payload);
        case RESET_TRANSFER_DATA:  // DO NOT DEFAULT RESET default_transfer_mode, temp_transfer_mode or public_identifier
            return {
                ...state,
                user_id: null,
                transfer_amount: 0,
                transfer_use: null,
                transfer_random_key: null,
                transfer_account_name: null,
                counterparty_user_id: null,
                my_matching_transfer_accounts: null,
                errored_NFC_id: null
            };
        default:
            return state;
    }
};


export const initialCreateStatusState = {
    isRequesting: false,
    error: null,
    success: false,
    feedback: false,
};

export const createStatus = (state = initialCreateStatusState, action) => {
    switch (action.type) {
        case RESET_NEW_TRANSFER:
            return initialCreateStatusState;

        case CREATE_TRANSFER_REQUEST:
            return { ...state, isRequesting: true, error: null, success: false };

        case CREATE_TRANSFER_SUCCESS:
            if (action.result) {
                var feedback = action.result.feedback === true;
            } else {
                feedback = false
            }
            return { ...state, isRequesting: false, success: true, feedback: feedback };

        case CREATE_TRANSFER_FAILURE:
            return { ...state, isRequesting: false, error: action.error };

        default:
            return state;
    }
};

export const NFCError = (state = {}, action) => {
    switch (action.type) {
        case RECORD_NFC_CARD_ERROR:
            return {
                nfcSerialNumber: action.NFCSerialNumber,
                session: action.session,
                amountDeducted: action.amountDeducted,
                transferData: action.transferData
            };

        case REMOVE_NFC_CARD_ERROR:
            return {};

        default:
            return state;
    }
};

export const creditTransfers = combineReducers({
    byId,
    transferData,
    createStatus,
    loadStatus,
    NFCError
});

// ACTIONS

export const loadCreditTransfers = (per_page, page) => (
    {
        type: LOAD_CREDIT_TRANSFERS_REQUEST,
        payload: {
            query: {
                per_page,
                page
            }
        }
    }
);

export const resetTransferData = () => ({ type: RESET_TRANSFER_DATA });

export const updateTransferData = (payload) => (
    {
        type: UPDATE_TRANSFER_DATA,
        payload,
    }
);

export const createTransferRequest = (payload) => (
    {
        type: CREATE_TRANSFER_REQUEST,
        payload,
    }
);

export const removeNFCCardError = () => (
    {
        type: REMOVE_NFC_CARD_ERROR
    }
)
