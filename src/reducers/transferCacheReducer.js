import { combineReducers } from 'redux';

export const RESET_TRANSFER_CACHE = 'RESET_TRANSFER_CACHE';
export const ADD_TRANSFER_TO_CACHE = 'ADD_TRANSFER_TO_CACHE';
export const REMOVE_TRANSFER_FROM_CACHE = 'REMOVE_TRANSFER_FROM_CACHE';
export const RESOLVE_TRANSFER_CACHE = 'RESOLVE_TRANSFER_CACHE';
export const RESET_RESOLVE_CACHE_STATUS = 'RESET_RESOLVE_CACHE_STATUS';

const intialCacheState = {
};

export const byUUID = (state = intialCacheState, action) => {
    switch (action.type) {
        case RESET_TRANSFER_CACHE:
            return intialCacheState;

        case ADD_TRANSFER_TO_CACHE:
            return {...state, [action.payload.body.uuid]: action.payload};

        case REMOVE_TRANSFER_FROM_CACHE:
            let duplicatedState = Object.assign({}, state);
            delete duplicatedState[action.uuid];

            return duplicatedState;

        default:
            return state
    }
};

const initialResolveCacheStatus = {
    isRequesting: false,
    error: null,
    success: false,
};

export const resolveStatus = (state = initialResolveCacheStatus, action) => {
    switch (action.type) {
        case RESET_RESOLVE_CACHE_STATUS:
            return initialResolveCacheStatus;

        case RESOLVE_TRANSFER_CACHE:
            return {...state, isRequesting: true, error: null, success: false};

        default:
            return state;
    }
};


export const transferCache = combineReducers({
    byUUID,
    resolveStatus,
});

export const cacheTransfer = (payload) => (
    {
        type: ADD_TRANSFER_TO_CACHE,
        payload
    }
);
export const resolveTransferCache = () => (
    {
        type: RESOLVE_TRANSFER_CACHE
    }
);


