import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import FAQScreen from '../../../components/screens/FAQScreen';
import TermsScreen from '../../../components/screens/TermsScreen';
import CheckBalanceScreen from '../../../components/screens/CheckBalanceScreen';


describe('FAQScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { networkStatus: { isConnected: true } }
            const mockStore = configureStore(initialState);
            const component = shallow(<FAQScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });

    describe('TermsScreen', () => {
        describe('Rendering', () => {
            it('should match to snapshot', () => {
                const initialState = { networkStatus: { isConnected: true } }
                const mockStore = configureStore(initialState);
                const component = shallow(<TermsScreen store={mockStore} />).dive();
                expect(component).toMatchSnapshot()
            });
        });
    });

    describe('CheckBalanceScreen', () => {
        describe('Rendering', () => {
            it('should match to snapshot', () => {
                const initialState = {
                    public_serial_number: 54321,
                    NFC_supported: true,
                    NFC_enabled: false,
                    detection_was_on_previously: false,
                    nfc_id: '04349232645B80',
                    amount: 200,
                    checking_nfc: false,
                    invalid_nfc: false,
                    NFC: { TransceiveStatus: true }
                }
                const mockStore = configureStore(initialState);
                const component = shallow(<CheckBalanceScreen store={mockStore} />);
                expect(component).toMatchSnapshot()
            });
        });
    });

});
