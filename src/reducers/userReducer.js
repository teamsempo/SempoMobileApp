import { combineReducers } from 'redux';
import { DEEEEEEP } from "./utils";

export const UPDATE_USER_LIST = "UPDATE_USER_LIST";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const USER_BY_PUBLIC_SERIAL_REQUEST = "USER_BY_PUBLIC_SERIAL_REQUEST";
export const USER_BY_PUBLIC_SERIAL_SUCCESS = "USER_BY_PUBLIC_SERIAL_SUCCESS";
export const USER_BY_PUBLIC_SERIAL_FAILURE = "USER_BY_PUBLIC_SERIAL_FAILURE";
export const RESET_USER_BY_PUBLIC_SERIAL = "RESET_USER_BY_PUBLIC_SERIAL";

const byId = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USER_LIST:
            return DEEEEEEP(state, action.users);

        default:
            return state;
    }
};

const initialLoadStatusState = {
    isRequesting: false,
    error: null,
    success: false
};

const loadStatus = (state = initialLoadStatusState, action) => {
    switch (action.type) {
        case LOAD_USER_REQUEST:
            return {...state, isRequesting: true};

        case LOAD_USER_SUCCESS:
            return {...state, isRequesting: false, success: true};

        case LOAD_USER_FAILURE:
            return {...state, isRequesting: false, error: action.error};

        default:
            return state;
    }
};

const initialGetUserFromPublicSerialNumberStatus = {
    isRequesting: false,
    error: null,
    success: false,
    load_result: null,
};

const getUserFromPublicSerialNumberStatus = (state = initialGetUserFromPublicSerialNumberStatus, action) => {
    switch (action.type) {
        case RESET_USER_BY_PUBLIC_SERIAL:
            return initialGetUserFromPublicSerialNumberStatus;

        case USER_BY_PUBLIC_SERIAL_REQUEST:
            return {...state, isRequesting: true};

        case USER_BY_PUBLIC_SERIAL_SUCCESS:
            return {...state, isRequesting: false, success: true, load_result: action.load_result};

        case USER_BY_PUBLIC_SERIAL_FAILURE:
            return {...state, isRequesting: false, error: action.error};

        default:
            return state;
    }
};

export const users = combineReducers({
    byId,
    loadStatus,
    getUserFromPublicSerialNumberStatus,
});


// ACTIONS
export const loadUser = (payload) => (
    {
        type: LOAD_USER_REQUEST,
        payload,
    }
);

export const getUserFromPublicSerialNumber = (payload) => (
    {
        type: USER_BY_PUBLIC_SERIAL_REQUEST,
        payload
    }
);