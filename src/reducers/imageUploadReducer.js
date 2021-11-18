export const RESET_IMAGE_UPLOAD = 'RESET_IMAGE_UPLOAD';
export const IMAGE_UPLOAD_REQUEST = 'IMAGE_UPLOAD_REQUEST';
export const IMAGE_UPLOAD_SUCCESS = 'IMAGE_UPLOAD_SUCCESS';
export const IMAGE_UPLOAD_FAILURE = 'IMAGE_UPLOAD_FAILURE';

export const initialImageUploadState = {
    isRequesting: false,
    success: false,
    imageData: null,
    error: null
};

export const imageUpload = (state = initialImageUploadState, action) => {
    switch (action.type) {
        case RESET_IMAGE_UPLOAD:
            return initialNewFeedbackState;
        case IMAGE_UPLOAD_REQUEST:
            return {...state, isRequesting: true, error: null, success: false};
        case IMAGE_UPLOAD_SUCCESS:
            return {...state, isRequesting: false, success: true};
        case IMAGE_UPLOAD_FAILURE:

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

export const newImageUpload = (imageData, imageType, transferId = null) => (
    {
        type: IMAGE_UPLOAD_REQUEST,
        imageData: imageData,
        imageType: imageType,
        transferId: transferId
    }
);