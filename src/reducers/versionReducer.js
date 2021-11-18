import { combineReducers } from "redux";

import {
    RESET_DISMISS_VERSION_MODAL,
    DISMISS_VERSION_MODAL,
    CHECK_VERSION_SUCCESS,
    CHECK_VERSION_FAILURE,
    CHECK_VERSION_REQUEST
} from '../actions/versionActions.js'

export const initialVersionState = {
    version: null,
    action: null,
    dismissed: false,
};

export const versionDetails = (state = initialVersionState, action) => {
    switch (action.type) {
        case RESET_DISMISS_VERSION_MODAL:
            return {...state, dismissed: false};

        case DISMISS_VERSION_MODAL:
            return {...state, dismissed: true};

        case CHECK_VERSION_SUCCESS:
            return {...state, version: action.result.version, action: action.result.action};

        default:
            return state;
    }
};

export const initialCheckStatusState = {
    isRequesting: false,
    error: null,
    success: false,
};

export const checkStatus = (state = initialCheckStatusState, action) => {
    switch (action.type) {
        case CHECK_VERSION_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};

        case CHECK_VERSION_SUCCESS:
            return {...state, isRequesting: false, success: true};

        case CHECK_VERSION_FAILURE:
            return {...state, isRequesting: false, error: action.error};

        default:
            return state;
    }
};

export const version = combineReducers({
    versionDetails,
    checkStatus,
});