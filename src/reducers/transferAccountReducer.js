import { combineReducers } from 'redux';
import { addCreditTransferIdsToTransferAccount } from './utils'
import {DEEEEEEP} from "./utils";

export const LOAD_TRANSFER_ACCOUNTS_REQUEST = "LOAD_TRANSFER_ACCOUNTS_REQUEST";
export const LOAD_TRANSFER_ACCOUNTS_SUCCESS = "LOAD_TRANSFER_ACCOUNTS_SUCCESS";
export const LOAD_TRANSFER_ACCOUNTS_FAILURE = "LOAD_TRANSFER_ACCOUNTS_FAILURE";


export const UPDATE_TRANSFER_ACCOUNTS = "UPDATE_TRANSFER_ACCOUNTS";
export const UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS = "UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS";
export const UPDATE_TRANSFER_ACCOUNT_BALANCE = "UPDATE_TRANSFER_ACCOUNT_BALANCE";

export const byId = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TRANSFER_ACCOUNTS:
            return DEEEEEEP(state, action.transfer_accounts);

        case UPDATE_TRANSFER_ACCOUNT_BALANCE:
            let new_state = {...state};

            let {
                sender_transfer_account_id,
                recipient_transfer_account_id,
                transfer_amount
            } = action.credit_transfer;

            if (new_state[sender_transfer_account_id]) {
                new_state[sender_transfer_account_id].balance -= transfer_amount
            }

            if (new_state[recipient_transfer_account_id]) {
                new_state[recipient_transfer_account_id].balance += transfer_amount
            }
            return DEEEEEEP(state, new_state);

        case UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS:
            var newState = {};

            action.credit_transfer_list.map(transfer => {
                if (transfer.transfer_type === 'DISBURSEMENT') {
                    let updatedTransferAccount = {[transfer.recipient_transfer_account.id]: {credit_receives: [transfer.id]}};
                    newState = {...newState, ...updatedTransferAccount};

                } else if (transfer.transfer_type === 'WITHDRAWAL') {
                    let updatedTransferAccount = {[transfer.sender_transfer_account.id]: {credit_sends: [transfer.id]}};
                    newState = {...newState, ...updatedTransferAccount};

                }
            });

            return addCreditTransferIdsToTransferAccount(state, newState);

        default:
            return state;
    }
};

export const initialLoadStatusState = {
    isRequesting: false,
    error: null,
    success: false,
};

export const loadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case LOAD_TRANSFER_ACCOUNTS_REQUEST:
            return {...state, isRequesting: true};

        case LOAD_TRANSFER_ACCOUNTS_SUCCESS:
            return {...state, isRequesting: false, success: true};

        case LOAD_TRANSFER_ACCOUNTS_FAILURE:
            return {...state, isRequesting: false, error: action.error};

        default:
            return state;
    }
};

export const transferAccounts = combineReducers({
    byId,
    loadStatus
});

// ACTIONS
export const loadTransferAccounts = () => (
    {
        type: LOAD_TRANSFER_ACCOUNTS_REQUEST
    }
);