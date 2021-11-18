import React from 'react';
import { shallow } from 'enzyme';
import KeypadComponent from '../../../components/Keypad.js';
import configureMockStore from 'redux-mock-store';

describe('PinComponent', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const submitFunction = jest.fn();
            const pinFunction = jest.fn();

            const inputButtons = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 'S'],
            ];
            const component = shallow(
                <KeypadComponent
                    value={''}
                    inputButtons={inputButtons}
                    onChange={(pin) => pinFunction(pin)}
                    onSubmit={() => submitFunction()}
                />
            ).dive();
            expect(component).toMatchSnapshot();
            const button = component.find("InputButton")
            const oneKey = button.at(0);
            const fourKey = button.at(3);
            const eightKey = button.at(7);
            const s_key = button.at(8);
            oneKey.simulate('press');
            fourKey.simulate('press');
            eightKey.simulate('press');
            oneKey.simulate('press');

            expect(submitFunction).not.toHaveBeenCalled();
            s_key.simulate('press');
            expect(submitFunction).toHaveBeenCalled();

            expect(pinFunction.mock.calls[0][0]).toBe('1');
            expect(pinFunction.mock.calls[1][0]).toBe('4');
            expect(pinFunction.mock.calls[2][0]).toBe('8');
            expect(pinFunction.mock.calls[3][0]).toBe('1');
        });
    });
});

