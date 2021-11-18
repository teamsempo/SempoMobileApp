import { combineReducers } from "redux";

export const RESET_TRANSCEIVE_NFC_STATUS = 'RESET_TRANSCEIVE_NFC_STATUS';

export const CHARGE_NFC_CARD_REQUEST = 'CHARGE_NFC_CARD_REQUEST';
export const CHARGE_NFC_CARD_SUCCESS = 'CHARGE_NFC_CARD_SUCCESS';
export const CHARGE_NFC_CARD_FAILURE = 'CHARGE_NFC_CARD_FAILURE';
export const SET_NFC_STAGE = 'SET_NFC_STAGE';

export const NFC_READ_ACTIVE = 'NFC_READ_ACTIVE';

export const CLOSE_NFC_READ = 'CLOSE_NFC_READ';


const initialTransceiveStatus = {
    isOpen: false,
    isReading: false,
    error: null,
    success: false,
    nfcId: null,
    balance: null,
    nfcStage: 0
};

export const TransceiveStatus = (state = initialTransceiveStatus, action) => {
    switch (action.type) {

        case RESET_TRANSCEIVE_NFC_STATUS:
            return initialTransceiveStatus;

        case NFC_READ_ACTIVE:
            return {...state, isReading: true, nfcStage: 0};

        case CLOSE_NFC_READ:
            return {...state, isReading: false, isOpen: false, nfcStage: 0};

        case CHARGE_NFC_CARD_REQUEST:
            return {...state, isOpen: true, error: null, success: false, nfcStage: 0};


        case CHARGE_NFC_CARD_SUCCESS:
            return {...state,
                success: true, nfcId: action.nfcId, balance: action.balance};

        case CHARGE_NFC_CARD_FAILURE:
            return {...state,
                error: action.error, nfcId: null, balance: null, nfcStage: 0};

        case SET_NFC_STAGE:
            return {...state, nfcStage: action.nfcStage};

        default:
            return state;
    }
};

export const NFC = combineReducers({
    TransceiveStatus
});

// ACTIONS
export const chargeNFCCard = (chargeAmount, symbol) => {
    return (
    {
        type: CHARGE_NFC_CARD_REQUEST,
        chargeAmount,
        symbol
    }
)};

export const closeNFCRead = () => {
    return (
    {
        type: CLOSE_NFC_READ
    }
)};

export const resetNFCStatus = () => {
    return (
        {
            type: RESET_TRANSCEIVE_NFC_STATUS
        }
    )};