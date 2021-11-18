import { newFeedback } from '../../../sagas/feedbackSaga'
import { mockApi } from '../../../../__mocks__/mockAxios';

import { expectSaga } from 'redux-saga-test-plan';
import {
    RESET_NEW_FEEDBACK_DATA,
    NEW_FEEDBACK_REQUEST,
    NEW_FEEDBACK_SUCCESS,
    NEW_FEEDBACK_FAILURE
} from '../../../reducers/feedbackReducer';

describe.only('newFeedback', () => {
    it('Should call the API with valid data and return NEW_FEEDBACK_SUCCESS', async () => {
        const question = 'Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?';
        const rating = '5';
        const additional_information = '';

        return expectSaga(newFeedback, { question, rating, additional_information })
            .put({ type: NEW_FEEDBACK_SUCCESS, feedback_result: { message: 'Thank you for your feedback!' } })
            .run();
    });

    it('API failure should return a NEW_FEEDBACK_FAILURE', async () => {
        const question = 'Hey Axios, can you trigger a failure for me? Thanks!';
        const rating = '5';
        const additional_information = '';
        
        return expectSaga(newFeedback, { question, rating, additional_information })
            .put.like({ action: { type: NEW_FEEDBACK_FAILURE } })
            .run();
    });
});
