import { byId } from '../../../reducers/transferAccountReducer';
import { UPDATE_TRANSFER_ACCOUNTS, UPDATE_TRANSFER_ACCOUNT_BALANCE, UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS } from '../../../reducers/transferAccountReducer';
describe('byId', () => {
    it('Returns correct state when byId is provided with UPDATE_TRANSFER_ACCOUNTS', () => {
        expect(byId({}, { type: UPDATE_TRANSFER_ACCOUNTS })).toMatchSnapshot();
    });

    it('Returns correct state when byId is provided with UPDATE_TRANSFER_ACCOUNT_BALANCE', () => {
        expect(byId({}, { type: UPDATE_TRANSFER_ACCOUNT_BALANCE, credit_transfer: {} })).toMatchSnapshot();
    });

    it('Returns correct state when byId is provided with UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS', () => {
        expect(byId({}, { type: UPDATE_TRANSFER_ACCOUNTS_CREDIT_TRANSFERS, credit_transfer_list: [] })).toMatchSnapshot();
    });
});

import { loadStatus, initialLoadStatusState } from '../../../reducers/transferAccountReducer';
import { LOAD_TRANSFER_ACCOUNTS_REQUEST, LOAD_TRANSFER_ACCOUNTS_SUCCESS, LOAD_TRANSFER_ACCOUNTS_FAILURE } from '../../../reducers/transferAccountReducer';
describe('loadStatus', () => {
    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_ACCOUNTS_REQUEST', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_ACCOUNTS_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_ACCOUNTS_SUCCESS', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_ACCOUNTS_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_ACCOUNTS_FAILURE', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_ACCOUNTS_FAILURE })).toMatchSnapshot();
    });
});
