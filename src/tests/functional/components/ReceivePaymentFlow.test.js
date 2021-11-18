import React from 'react';
import { shallow } from 'enzyme';
import PaymentsUseScreen from '../../../components/ReceivePaymentFlow/PaymentsUseScreen';
import PaymentsAmountScreen from '../../../components/ReceivePaymentFlow/PaymentsAmountScreen';
import TransferAmountDisplay from '../../../components/ReceivePaymentFlow/TransferAmountDisplay';
import TransferCompleteScreen from '../../../components/ReceivePaymentFlow/TransferCompleteScreen';
import EnterPin from '../../../components/ReceivePaymentFlow/EnterPin';
import ReceivePaymentCameraScreen from '../../../components/ReceivePaymentFlow/ReceivePaymentCameraScreen';
import RequestPaymentQrCode from '../../../components/ReceivePaymentFlow/RequestPaymentQrCode';
import RefundScreen from '../../../components/ReceivePaymentFlow/RefundScreen';

import configureMockStore from 'redux-mock-store';

describe('PaymentsUseScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({});
            const component = shallow(<PaymentsUseScreen store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('RefundScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({});
            const component = shallow(<RefundScreen store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('PaymentsAmountScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ creditTransfers: { transferData: [] } });
            const component = shallow(<PaymentsAmountScreen store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('TransferAmountDisplay', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ creditTransfers: { transferData: [] } });
            const component = shallow(<TransferAmountDisplay store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('TransferCompleteScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ creditTransfers: { transferData: [] } });
            const component = shallow(<TransferCompleteScreen store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('EnterPin', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ 
                transferData: { transfer_amount: 5, transfer_use: 'Pizza' }, 
                createStatus: 'success',
                creditTransfers: { transferData: [] }
             });
            const component = shallow(<EnterPin store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('ReceivePaymentCameraScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ 
                transferData: { transfer_amount: 5, transfer_use: 'Pizza' }, 
                createStatus: 'success',
                creditTransfers: { transferData: [] }
             });
            const component = shallow(<ReceivePaymentCameraScreen store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});

describe('ReceivePaymentCameraScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore({ 
                creditTransfers: { transferData: [] }
             });
            const component = shallow(<RequestPaymentQrCode store={mockStore} />);
            expect(component).toMatchSnapshot();
        });
    });
});
