// ACTIONS
export const CHECK_VERSION_REQUEST = 'CHECK_VERSION_REQUEST';
export const CHECK_VERSION_SUCCESS = 'CHECK_VERSION_SUCCESS';
export const CHECK_VERSION_FAILURE = 'CHECK_VERSION_FAILURE';

export const DISMISS_VERSION_MODAL = 'DISMISS_VERSION_MODAL';
export const RESET_DISMISS_VERSION_MODAL = 'RESET_DISMISS_VERSION_MODAL';


// Action Creators

export const checkVersionRequest = (payload) => {
    return {
        type: CHECK_VERSION_REQUEST,
        payload
    }
};

export const checkVersionSuccess = (result) => {
    return {
        type: CHECK_VERSION_SUCCESS,
        result
    }
};

export const checkVersionFailure = (error) => {
    return {
        type: CHECK_VERSION_FAILURE,
        error: error
    }
};

export const resetVersionModal = () => {
    return {
        type: RESET_DISMISS_VERSION_MODAL
    }
};

export const dismissVersionModal = () => {
    return {
        type: DISMISS_VERSION_MODAL
    }
};