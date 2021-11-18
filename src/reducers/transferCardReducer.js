import {combineReducers} from "redux";

export const RESET_TRANSFER_CARDS_DATA = 'RESET_TRANSFER_CARDS_DATA';
export const LOAD_TRANSFER_CARDS_REQUEST = 'LOAD_TRANSFER_CARDS_REQUEST';
export const LOAD_TRANSFER_CARDS_SUCCESS = 'LOAD_TRANSFER_CARDS_SUCCESS';
export const LOAD_TRANSFER_CARDS_FAILURE = 'LOAD_TRANSFER_CARDS_FAILURE';

export const LOAD_SINGLE_TRANSFER_CARD_REQUEST = 'LOAD_SINGLE_TRANSFER_CARD_REQUEST';
export const LOAD_SINGLE_TRANSFER_CARD_SUCCESS = 'LOAD_SINGLE_TRANSFER_CARD_SUCCESS';
export const LOAD_SINGLE_TRANSFER_CARD_FAILURE = 'LOAD_SINGLE_TRANSFER_CARD_FAILURE';

export const initialLoadStatusState = {
    isRequesting: false,
    success: false,
    error: null
};

export const loadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case RESET_TRANSFER_CARDS_DATA:
            return initialLoadStatusState;
        case LOAD_TRANSFER_CARDS_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case LOAD_TRANSFER_CARDS_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case LOAD_TRANSFER_CARDS_FAILURE:
            try {
                var error_message = action.error.response.data.message
            } catch (e) {
                error_message = 'unknown error'
            }

            return {...state, isRequesting: false, error: error_message};
        default:
            return state;
    }
};



export const singleLoadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case RESET_TRANSFER_CARDS_DATA:
            return initialLoadStatusState;
        case LOAD_SINGLE_TRANSFER_CARD_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case LOAD_SINGLE_TRANSFER_CARD_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case LOAD_SINGLE_TRANSFER_CARD_FAILURE:
            try {
                var error_message = action.error.response.data.message
            } catch (e) {
                error_message = 'unknown error'
            }

            return {...state, isRequesting: false, error: error_message};
        default:
            return state;
    }
};

const byNFCSerialNumber = (state = {}, action) => {
    switch (action.type) {
        case LOAD_TRANSFER_CARDS_SUCCESS:
            let bySerialNumber = {};
            action.result.data.transfer_cards.map(card => {bySerialNumber[card.nfc_serial_number] = card});

            return bySerialNumber;

        case LOAD_SINGLE_TRANSFER_CARD_SUCCESS:
            let new_card = {};
            new_card[action.result.data.transfer_card.nfc_serial_number] = action.result.data.transfer_card

            return {...state, ...new_card };

        case RESET_TRANSFER_CARDS_DATA:
            return {};

        default:
            return state;
    }
};


export const transferCards = combineReducers({
    byNFCSerialNumber,
    loadStatus,
    singleLoadStatus
});


// Actions

export const loadTransferCards = () => (
    {
        type: LOAD_TRANSFER_CARDS_REQUEST
    }
);