import { checkVersion } from '../../../sagas/versionSaga.js';
import { CHECK_VERSION_SUCCESS, CHECK_VERSION_FAILURE } from '../../../actions/versionActions.js';
import { expectSaga } from 'redux-saga-test-plan';

import { version } from '../../../../__mocks__/mockAxios';

describe.only('checkVersion', () => {

    it('should fail if no version', async () => {
        const payload = { payload: version[0].payload };
        const expectedResult = version[0].result;

        return expectSaga(checkVersion, { payload })
            .put({ type: CHECK_VERSION_FAILURE, error: expectedResult })
            .run();
    });

    it('should get version from API and return success: ok, + reset version action modal', async () => {
        const payload = { payload: version[1].payload };
        const expectedResult = version[1].result;

        return expectSaga(checkVersion, payload )
            .put({ type: CHECK_VERSION_SUCCESS, result: expectedResult })
            .run();
    });

    it('should get version from API and return success: recommend', async () => {
        const payload = { payload: version[2].payload };
        const expectedResult = version[2].result;

        return expectSaga(checkVersion, payload )
            .put({ type: CHECK_VERSION_SUCCESS, result: expectedResult })
            .run();
    });

    it('should get version from API and return success: force', async () => {
        const payload = { payload: version[3].payload };
        const expectedResult = version[3].result;

        return expectSaga(checkVersion, payload )
            .put({ type: CHECK_VERSION_SUCCESS, result: expectedResult })
            .run();
    });
});
