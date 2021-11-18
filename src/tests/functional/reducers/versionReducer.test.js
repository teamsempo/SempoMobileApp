import { versionDetails, initialVersionState, checkStatus, initialCheckStatusState } from '../../../reducers/versionReducer.js';
import { checkVersionRequest, checkVersionSuccess, checkVersionFailure, resetVersionModal, dismissVersionModal } from '../../../actions/versionActions.js';
import { version } from '../../../../__mocks__/mockAxios';

describe('localeReducer',() => {

    describe('versionDetails', () => {
        it('returns the same state on an unhandled action', () => {
            expect(versionDetails(initialVersionState, {type: '_NULL'})).toMatchSnapshot();
        });

        it('returns reset state', () => {
            expect(versionDetails(initialVersionState, resetVersionModal())).toMatchSnapshot();
        });

        it('returns dismiss state', () => {
            expect(versionDetails(initialVersionState, dismissVersionModal())).toMatchSnapshot();
        });

        it('returns version success state', () => {
            expect(versionDetails(initialVersionState, checkVersionSuccess(version[1].result))).toMatchSnapshot();
        })
    });

    describe('checkStatus', () => {
        // request, success, failure
        it('returns the same state on an unhandled action', () => {
            expect(checkStatus(initialCheckStatusState, {type: '_NULL'})).toMatchSnapshot()
        });

        it('returns request state', () => {
            expect(checkStatus(initialCheckStatusState, checkVersionRequest({payload: version[1].payload}))).toMatchSnapshot()
        });

        it('returns success state', () => {
            expect(checkStatus(initialCheckStatusState, checkVersionSuccess(version[1].result))).toMatchSnapshot()
        });

        it('returns failure state', () => {
            expect(checkStatus(initialCheckStatusState, checkVersionFailure(version[0].result))).toMatchSnapshot()
        })
    })
});