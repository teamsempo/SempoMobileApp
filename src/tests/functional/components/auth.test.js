import React from 'react';
import { shallow } from 'enzyme';
import PinComponent from '../../../components/auth/GenericPinComponent.js';
import configureMockStore from 'redux-mock-store';

describe('PinComponent', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockStore = configureMockStore([]);
            const component = shallow(<PinComponent store={mockStore} promptText={'Prompt Text'}/>).dive();
            expect(component).toMatchSnapshot();
        });
    });
});

