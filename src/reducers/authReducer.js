export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_PARTIAL = 'LOGIN_PARTIAL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const REAUTH_REQUEST = 'REAUTH_REQUEST';

export const SET_PIN_REQUEST = 'SET_PIN_REQUEST';
export const SET_PIN_SUCCESS = 'SET_PIN_SUCCESS';
export const SET_PIN_FAILURE = 'SET_PIN_FAILURE';

export const VERIFY_PIN_REQUEST = 'VERIFY_PIN_REQUEST';
export const VERIFY_PIN_SUCCESS = 'VERIFY_PIN_SUCCESS';
export const VERIFY_PIN_FAILURE = 'VERIFY_PIN_FAILURE';

export const OPEN_APP_REQUEST = 'OPEN_APP_REQUEST';
export const OPEN_APP_SUCCESS = 'OPEN_APP_SUCCESS';
export const OPEN_APP_FAILURE = 'OPEN_APP_FAILURE';
export const BACKGROUND_APP = 'BACKGROUND_APP';
export const UPDATE_REQUIRE_PIN = 'UPDATE_REQUIRE_PIN';

//Partial Login Enumerable.
// TODO: Consider unifying with api response by either making API response an enumerable, or making this a set of bools
export const NEED_SET_PIN = 'NEED_SET_PIN';
export const NEED_OTP_VERIFY = 'NEED_OTP_VERIFY';
export const NEED_LOGIN_WITH_PIN = 'NEED_LOGIN_WITH_PIN';


const initialLoginState = {
    isRequesting: false,
    token: null,
    userId: null,
    firstName: null,
    lastName: null,
    transferAccountId: null,
    isVendor: null,
    isSupervendor: null,
    requestFeedbackQuestions: [],
    defaultFeedbackQuestions: [],
    deploymentName: null,
    termsAccepted: null,
    kycActive: null,
    denominations: {},

    secret: null,
    ecdsaPublic: null,
    localServerTimeDelta: null,
    pusherKey: null,
    displayDecimals: null,
    currencySymbol: null,
    currencyConversionRate: 1,
    transferUsages: null,
    NFCPositions: null,
    error: null,
    forgivingDeduct: false,
    supportSigValidation: false,
    partialState: null
};

export const login = (state = initialLoginState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {...state, isRequesting: true};
        case LOGIN_SUCCESS:
            return {...state,
                isRequesting: false,
                token: action.token,
                userId: action.userId,
                firstName: action.firstName,
                lastName: action.lastName,
                transferAccountId: action.transferAccountId,
                isVendor: action.isVendor,
                isSupervendor: action.isSupervendor,
                secret: action.secret,
                ecdsaPublic: action.ecdsaPublic,
                localServerTimeDelta: action.localServerTimeDelta,
                pusherKey: action.pusherKey,
                displayDecimals: action.displayDecimals,
                currencySymbol: action.currencySymbol,
                currencyConversionRate: action.currencyConversionRate,
                requestFeedbackQuestions: action.requestFeedbackQuestions,
                defaultFeedbackQuestions: action.defaultFeedbackQuestions,
                deploymentName: action.deploymentName,
                termsAccepted: action.termsAccepted,
                kycActive: action.kycActive,
                denominations: action.denominations,
                transferUsages: action.transferUsages,
                NFCPositions: action.NFCPositions,
                forgivingDeduct: action.forgivingDeduct,
                supportSigValidation: action.supportSigValidation
            };
        case LOGIN_PARTIAL:
            return {
                ...state,
                isRequesting: false,
                token: null,
                userId: null,
                partialState: action.partialState,
                error: action.error
            };
        case LOGIN_FAILURE:

            try {
                //We've found one of our backend's expected messages

                //This bit here is a hack because incorrect passwords get passed back from the delegator as 200 status codes
                if (typeof action.error === 'string') {
                    var error_message = action.error
                } else {
                    error_message = action.error.response.data.message
                }
            } catch (e) {
                error_message = 'unknown error'
            }

            console.log(error_message)

            return {...state, isRequesting: false, token: null, userId: null, error: error_message};
        case LOGOUT:
            return initialLoginState;
        default:
            return state;
    }
};



export const initialSetPinState = {
    isRequesting: false,
    success: false,
    error: null
};

export const setPin = (state = initialSetPinState, action) => {
    switch (action.type) {
        case SET_PIN_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case SET_PIN_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case SET_PIN_FAILURE:

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

const initialVerifyPinState = {
    isRequesting: false,
    success: false,
    error: null,
};

export const verifyPin = (state = initialVerifyPinState, action) => {
    switch (action.type) {
        case OPEN_APP_REQUEST:
            //When the app is opened, reset pin verification state
            return initialVerifyPinState;
        case VERIFY_PIN_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case VERIFY_PIN_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case VERIFY_PIN_FAILURE:
            return {...state, isRequesting: false, success: false, error: action.error};
        default:
            return state;
    }
};

export const initialAppState = {
    isRequesting: false,
    success: false,
    error: null,
    requirePIN: true,
    backgrounded: true,
};

export const openApp = (state = initialAppState, action) => {
    //TODO: consider renaming this reducer (and saga etc) to APP_STATE_CHANGE or something given we use it on close too
    switch (action.type) {
        case OPEN_APP_REQUEST:
            return {...state, isRequesting: true, success: false};
        case OPEN_APP_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case OPEN_APP_FAILURE:
            return {...state, isRequesting: false, success: false, error: action.error};
        case BACKGROUND_APP:
            return {...state, isRequesting: false, backgrounded: action.backgroundedTime};
        case UPDATE_REQUIRE_PIN:
            return {...state, isRequesting: false, requirePIN: action.requirePIN};
        default:
            return state;
    }
};

// ACTIONS
export const loginRequest = (payload) => (
    {
        type: LOGIN_REQUEST,
        payload,
    }
);

export const logout = () => (
    {
        type: LOGOUT
    }
);

export const setPinRequest = (payload) => (
    {
        type: SET_PIN_REQUEST,
        payload
    }
);

export const verifyPinRequest = (payload) => (
    {
        type: VERIFY_PIN_REQUEST,
        payload
    }
);

export const openAppRequest = () => (
    {
        type: OPEN_APP_REQUEST,
    }
);

export const backgroundApp = (backgrounded) => (
    {
        type: OPEN_APP_REQUEST,
        backgrounded: backgrounded
    }
);

export const updateRequirePIN = (requirePIN) => (
    {
        type: UPDATE_REQUIRE_PIN,
        requirePIN
    }
);