import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import VerifyLaunchScreen from '../../../components/verification/VerifyLaunchScreen';
import SelfieCameraScreen from '../../../components/verification/SelfieCameraScreen';
import VerifyAccountFlow from '../../../components/verification/VerifyAccountFlow';
import OutcomeScreen from '../../../components/verification/OutcomeScreen';
import DocumentTypeScreen from '../../../components/verification/DocumentTypeScreen';
import DocumentCameraScreen from '../../../components/verification/DocumentCameraScreen';
import CountrySelectionScreen from '../../../components/verification/CountrySelectionScreen';


describe('VerifyLaunchScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<VerifyLaunchScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('SelfieCameraScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<SelfieCameraScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('VerifyAccountFlow', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<VerifyAccountFlow store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('OutcomeScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<OutcomeScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('DocumentTypeScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<DocumentTypeScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('DocumentCameraScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<DocumentCameraScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});

describe('CountrySelectionScreen', () => {
    describe('Rendering', () => {
        it('should match to snapshot', () => {
            const initialState = { }
            const mockStore = configureStore(initialState);
            const component = shallow(<CountrySelectionScreen store={mockStore} />).dive();
            expect(component).toMatchSnapshot()
        });
    });
});
