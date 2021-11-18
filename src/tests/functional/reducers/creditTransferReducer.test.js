import { initialLoadStatusState, loadStatus } from '../../../reducers/creditTransferReducer';
import { LOAD_CREDIT_TRANSFERS_REQUEST, LOAD_CREDIT_TRANSFERS_SUCCESS, LOAD_CREDIT_TRANSFERS_FAILURE, UPDATE_CREDIT_TRANSFER_LIST } from '../../../reducers/creditTransferReducer';
describe('loadStatus', () => {
    it('Returns correct state when loadStatus is provided with LOAD_CREDIT_TRANSFERS_REQUEST', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_CREDIT_TRANSFERS_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_CREDIT_TRANSFERS_SUCCESS', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_CREDIT_TRANSFERS_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_CREDIT_TRANSFERS_FAILURE', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_CREDIT_TRANSFERS_FAILURE })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with UPDATE_CREDIT_TRANSFER_LIST', () => {
        expect(loadStatus(initialLoadStatusState, { type: UPDATE_CREDIT_TRANSFER_LIST, credit_transfers: {} })).toMatchSnapshot();
    });
});

import { initialTransferDataState, transferData } from '../../../reducers/creditTransferReducer';
import { UPDATE_TRANSFER_DATA, RESET_TRANSFER_DATA } from '../../../reducers/creditTransferReducer';
describe('transferData', () => {
    it('Returns correct state when transferData is provided with UPDATE_TRANSFER_DATA', () => {
        expect(transferData(initialTransferDataState, { type: UPDATE_TRANSFER_DATA })).toMatchSnapshot();
    });

    it('Returns correct state when transferData is provided with RESET_TRANSFER_DATA', () => {
        expect(transferData(initialTransferDataState, { type: RESET_TRANSFER_DATA })).toMatchSnapshot();
    });
});

import { initialCreateStatusState, createStatus } from '../../../reducers/creditTransferReducer';
import { RESET_NEW_TRANSFER, CREATE_TRANSFER_REQUEST, CREATE_TRANSFER_SUCCESS, CREATE_TRANSFER_FAILURE } from '../../../reducers/creditTransferReducer';
describe('createStatus', () => {
    it('Returns correct state when createStatus is provided with RESET_NEW_TRANSFER', () => {
        expect(createStatus(initialCreateStatusState, { type: RESET_NEW_TRANSFER })).toMatchSnapshot();
    });

    it('Returns correct state when createStatus is provided with CREATE_TRANSFER_REQUEST', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_TRANSFER_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when createStatus is provided with CREATE_TRANSFER_SUCCESS', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_TRANSFER_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when createStatus is provided with CREATE_TRANSFER_FAILURE', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_TRANSFER_FAILURE })).toMatchSnapshot();
    });
});

import { byId } from '../../../reducers/creditTransferReducer';
import { IMAGE_UPLOAD_SUCCESS } from '../../../reducers/creditTransferReducer';
describe('byId', () => {
    it('Returns correct state when byId is provided with UPDATE_CREDIT_TRANSFER_LIST', () => {
        expect(byId({}, { type: UPDATE_CREDIT_TRANSFER_LIST })).toMatchSnapshot();
    });

    it('Returns correct state when byId is provided with IMAGE_UPLOAD_SUCCESS', () => {
        expect(byId({}, { type: IMAGE_UPLOAD_SUCCESS })).toMatchSnapshot();
    });
});

import { NFCError } from '../../../reducers/creditTransferReducer';
import { RECORD_NFC_CARD_ERROR, REMOVE_NFC_CARD_ERROR } from '../../../reducers/creditTransferReducer';
describe('NFCError', () => {
    it('Returns correct state when NFCError is provided with RECORD_NFC_CARD_ERROR', () => {
        expect(NFCError({}, { type: RECORD_NFC_CARD_ERROR })).toMatchSnapshot();
    });

    it('Returns correct state when NFCError is provided with REMOVE_NFC_CARD_ERROR', () => {
        expect(NFCError({}, { type: REMOVE_NFC_CARD_ERROR })).toMatchSnapshot();
    });
});

import { loadCreditTransfers } from '../../../reducers/creditTransferReducer';
describe('loadCreditTransfers', () => {
    it('Returns correct state when loadCreditTransfers is provided with LOAD_CREDIT_TRANSFERS_REQUEST', () => {
        expect(loadCreditTransfers({}, { type: LOAD_CREDIT_TRANSFERS_REQUEST })).toMatchSnapshot();
    });
});

import { resetTransferData } from '../../../reducers/creditTransferReducer';
describe('resetTransferData', () => {
    it('Returns correct state when resetTransferData is provided with UPDATE_TRANSFER_DATA', () => {
        expect(resetTransferData({}, { type: UPDATE_TRANSFER_DATA })).toMatchSnapshot();
    });
});

import { createTransferRequest } from '../../../reducers/creditTransferReducer';
describe('createTransferRequest', () => {
    it('Returns correct state when createTransferRequest is provided with CREATE_TRANSFER_REQUEST', () => {
        expect(createTransferRequest({}, { type: CREATE_TRANSFER_REQUEST })).toMatchSnapshot();
    });
});

import { removeNFCCardError } from '../../../reducers/creditTransferReducer';
describe('removeNFCCardError', () => {
    it('Returns correct state when removeNFCCardError is provided with REMOVE_NFC_CARD_ERROR', () => {
        expect(removeNFCCardError({}, { type: REMOVE_NFC_CARD_ERROR })).toMatchSnapshot();
    });
});
