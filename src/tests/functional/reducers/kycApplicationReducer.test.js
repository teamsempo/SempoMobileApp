import { createStatus, initialCreateStatusState } from '../../../reducers/kycApplicationReducer';
import { CREATE_KYC_APPLICATION_REQUEST, CREATE_KYC_APPLICATION_SUCCESS, CREATE_KYC_APPLICATION_FAILURE } from '../../../reducers/kycApplicationReducer';

describe('createStatus', () => {
    it('Returns correct state when createStatus is provided with CREATE_KYC_APPLICATION_REQUEST', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_KYC_APPLICATION_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when createStatus is provided with CREATE_KYC_APPLICATION_SUCCESS', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_KYC_APPLICATION_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when createStatus is provided with CREATE_KYC_APPLICATION_FAILURE', () => {
        expect(createStatus(initialCreateStatusState, { type: CREATE_KYC_APPLICATION_FAILURE })).toMatchSnapshot();
    });
});

import { loadStatus, initialLoadStatusState } from '../../../reducers/kycApplicationReducer';
import { LOAD_KYC_APPLICATION_REQUEST, LOAD_KYC_APPLICATION_SUCCESS, LOAD_KYC_APPLICATION_FAILURE } from '../../../reducers/kycApplicationReducer';
describe('loadStatus', () => {
    it('Returns correct state when loadStatus is provided with LOAD_KYC_APPLICATION_REQUEST', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_KYC_APPLICATION_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_KYC_APPLICATION_SUCCESS', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_KYC_APPLICATION_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_KYC_APPLICATION_FAILURE', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_KYC_APPLICATION_FAILURE })).toMatchSnapshot();
    });
});

import { editStatus, initialEditStatusState } from '../../../reducers/kycApplicationReducer';
import { EDIT_KYC_APPLICATION_REQUEST, EDIT_KYC_APPLICATION_SUCCESS, EDIT_KYC_APPLICATION_FAILURE } from '../../../reducers/kycApplicationReducer';
describe('editStatus', () => {
    it('Returns correct state when editStatus is provided with EDIT_KYC_APPLICATION_REQUEST', () => {
        expect(editStatus(initialEditStatusState, { type: EDIT_KYC_APPLICATION_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when editStatus is provided with EDIT_KYC_APPLICATION_SUCCESS', () => {
        expect(editStatus(initialEditStatusState, { type: EDIT_KYC_APPLICATION_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when editStatus is provided with EDIT_KYC_APPLICATION_FAILURE', () => {
        expect(editStatus(initialEditStatusState, { type: EDIT_KYC_APPLICATION_FAILURE })).toMatchSnapshot();
    });
});

import { uploadDocumentStatus, initialUploadDocumentStatus } from '../../../reducers/kycApplicationReducer';
import { UPLOAD_DOCUMENT_REQUEST, UPLOAD_DOCUMENT_SUCCESS, UPLOAD_DOCUMENT_FAILURE } from '../../../reducers/kycApplicationReducer';
describe('uploadDocumentStatus', () => {
    it('Returns correct state when uploadDocumentStatus is provided with UPLOAD_DOCUMENT_REQUEST', () => {
        expect(uploadDocumentStatus(initialUploadDocumentStatus, { type: UPLOAD_DOCUMENT_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when uploadDocumentStatus is provided with UPLOAD_DOCUMENT_SUCCESS', () => {
        expect(uploadDocumentStatus(initialUploadDocumentStatus, { type: UPLOAD_DOCUMENT_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when uploadDocumentStatus is provided with UPLOAD_DOCUMENT_FAILURE', () => {
        expect(uploadDocumentStatus(initialUploadDocumentStatus, { type: UPLOAD_DOCUMENT_FAILURE })).toMatchSnapshot();
    });
});

import { createBankAccountStatus, initialCreateBankAccountStatus } from '../../../reducers/kycApplicationReducer';
import { CREATE_BANK_ACCOUNT_REQUEST, CREATE_BANK_ACCOUNT_SUCCESS, CREATE_BANK_ACCOUNT_FAILURE } from '../../../reducers/kycApplicationReducer';
describe('createBankAccountStatus', () => {
    it('Returns correct state when createBankAccountStatus is provided with CREATE_BANK_ACCOUNT_REQUEST', () => {
        expect(createBankAccountStatus(initialCreateBankAccountStatus, { type: CREATE_BANK_ACCOUNT_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when createBankAccountStatus is provided with CREATE_BANK_ACCOUNT_SUCCESS', () => {
        expect(createBankAccountStatus(initialCreateBankAccountStatus, { type: CREATE_BANK_ACCOUNT_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when createBankAccountStatus is provided with CREATE_BANK_ACCOUNT_FAILURE', () => {
        expect(createBankAccountStatus(initialCreateBankAccountStatus, { type: CREATE_BANK_ACCOUNT_FAILURE })).toMatchSnapshot();
    });
});
