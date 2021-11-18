import { newExport } from '../../../sagas/exportSaga'
import { mockApi } from '../../../../__mocks__/mockAxios';

import { expectSaga } from 'redux-saga-test-plan';
import {
    NEW_EXPORT_SUCCESS,
    NEW_EXPORT_FAILURE,
} from '../../../reducers/exportReducer';

describe.only('exportSaga', () => {
    it('Should call the API with an email and yield NEW_EXPORT_SUCCESS', async () => {
        const dateRange = 'all';
        const email = 'francine@catmail.com';

        return expectSaga(newExport, { dateRange, email })
            .put({ type: NEW_EXPORT_SUCCESS, file_url: 'www.google.com' })
            .run();
    });

    it('Should call the API with no email and yield NEW_EXPORT_FAILURE', async () => {
        const dateRange = 'all';
        const email = '';

        return expectSaga(newExport, { dateRange, email })
            .put({ type: NEW_EXPORT_FAILURE, error: { message: 'Something went wrong.', status: undefined } })
            .run();
    });
});

