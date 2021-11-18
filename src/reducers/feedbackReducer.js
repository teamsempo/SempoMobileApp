export const RESET_NEW_FEEDBACK_DATA = 'RESET_NEW_FEEDBACK_DATA';
export const NEW_FEEDBACK_REQUEST = 'NEW_FEEDBACK_REQUEST';
export const NEW_FEEDBACK_SUCCESS = 'NEW_FEEDBACK_SUCCESS';
export const NEW_FEEDBACK_FAILURE = 'NEW_FEEDBACK_FAILURE';

export const initialNewFeedbackState = {
    isRequesting: false,
    success: false,
    error: null
};

export const newFeedbackData = (state = initialNewFeedbackState, action) => {
    switch (action.type) {
        case RESET_NEW_FEEDBACK_DATA:
            return initialNewFeedbackState;
        case NEW_FEEDBACK_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case NEW_FEEDBACK_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case NEW_FEEDBACK_FAILURE:

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


// Actions

export const newFeedback = ({question, rating, additional_information}) => (
    {
        type: NEW_FEEDBACK_REQUEST,
        question,
        rating,
        additional_information,
    }
);