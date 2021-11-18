import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../components/Button.js';

describe('Button', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const mockCallBack = jest.fn();
            const component = shallow(<Button buttonText="SIGN IN" onPress={mockCallBack}/>);
            expect(component).toMatchSnapshot()
            component.find('ForwardRef').simulate('press');
            expect(mockCallBack).toHaveBeenCalled();
        });
    });
});
