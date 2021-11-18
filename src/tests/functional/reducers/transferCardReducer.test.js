import { initialLoadStatusState, loadStatus } from '../../../reducers/transferCardReducer';
import { LOAD_TRANSFER_CARDS_FAILURE, RESET_TRANSFER_CARDS_DATA, LOAD_TRANSFER_CARDS_REQUEST, LOAD_TRANSFER_CARDS_SUCCESS } from '../../../reducers/transferCardReducer';
describe('loadStatus', () => {
    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_CARDS_FAILURE', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_CARDS_FAILURE })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with RESET_TRANSFER_CARDS_DATA', () => {
        expect(loadStatus(initialLoadStatusState, { type: RESET_TRANSFER_CARDS_DATA })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_CARDS_REQUEST', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_CARDS_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when loadStatus is provided with LOAD_TRANSFER_CARDS_SUCCESS', () => {
        expect(loadStatus(initialLoadStatusState, { type: LOAD_TRANSFER_CARDS_SUCCESS })).toMatchSnapshot();
    });
});

import { singleLoadStatus } from '../../../reducers/transferCardReducer';
import { LOAD_SINGLE_TRANSFER_CARD_REQUEST, LOAD_SINGLE_TRANSFER_CARD_SUCCESS, LOAD_SINGLE_TRANSFER_CARD_FAILURE } from '../../../reducers/transferCardReducer';
describe('singleLoadStatus', () => {
    it('Returns correct state when singleLoadStatus is provided with RESET_TRANSFER_CARDS_DATA', () => {
        expect(singleLoadStatus(initialLoadStatusState, { type: RESET_TRANSFER_CARDS_DATA })).toMatchSnapshot();
    });

    it('Returns correct state when singleLoadStatus is provided with LOAD_SINGLE_TRANSFER_CARD_REQUEST', () => {
        expect(singleLoadStatus(initialLoadStatusState, { type: LOAD_SINGLE_TRANSFER_CARD_REQUEST })).toMatchSnapshot();
    });

    it('Returns correct state when singleLoadStatus is provided with LOAD_SINGLE_TRANSFER_CARD_REQUEST', () => {
        expect(singleLoadStatus(initialLoadStatusState, { type: LOAD_SINGLE_TRANSFER_CARD_SUCCESS })).toMatchSnapshot();
    });

    it('Returns correct state when singleLoadStatus is provided with LOAD_SINGLE_TRANSFER_CARD_REQUEST', () => {
        expect(singleLoadStatus(initialLoadStatusState, { type: LOAD_SINGLE_TRANSFER_CARD_FAILURE })).toMatchSnapshot();
    });
});
