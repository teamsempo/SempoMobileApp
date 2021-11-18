export const RESET_EXPORT = 'RESET_EXPORT';
export const NEW_EXPORT_REQUEST = 'NEW_EXPORT_REQUEST';
export const NEW_EXPORT_SUCCESS = 'NEW_EXPORT_SUCCESS';
export const NEW_EXPORT_FAILURE = 'NEW_EXPORT_FAILURE';

export const initialExportState = {
    isRequesting: false,
    success: false,
    error: null,
    file_url: null,
};

export const newExportRequest = (state = initialExportState, action) => {
    switch (action.type) {
        case RESET_EXPORT:
            return initialExportState;
        case NEW_EXPORT_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case NEW_EXPORT_SUCCESS:
            return {...state, isRequesting: false, success: true, file_url: action.file_url};
        case NEW_EXPORT_FAILURE:

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

export const newExport = ({date_range, email}) => (
    {
        type: NEW_EXPORT_REQUEST,
        date_range,
        email
    }
);
