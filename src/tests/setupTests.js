import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import mockReactNativeIntercom from '../../__mocks__/react-native-intercom.js';
import mockReactNativeDeviceInfo from '../../__mocks__/react-native-device-info.js';
import mockReactNativeSentry from '../../__mocks__/@sentry/react-native.js';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

import {storeHostURL, storeToken} from "../utils";

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('react-native-intercom', () => mockReactNativeIntercom);
jest.mock('react-native-device-info', () => mockReactNativeDeviceInfo);
jest.mock('@sentry/react-native', () => mockReactNativeSentry);
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    setInternetCredentials: jest.fn(),
    getInternetCredentials: jest.fn(),
    resetInternetCredentials: jest.fn()
  }));

// need to have an auth token + correct host URL
// todo; hostURL config
storeToken('fakeAuthToken').catch();
storeHostURL('https://dev.withsempo.com').catch();

/*

Useful Testing readings:

--> Jest and Enzyme Basics; 4 parts
    --> https://medium.com/react-native-training/learning-to-test-react-native-with-jest-part-1-f782c4e30101

--> testing reducers/actions/sagas
    --> https://blog.callstack.io/unit-testing-react-native-with-the-new-jest-ii-redux-snapshots-for-your-actions-and-reducers-8559f6f8050b

--> Testing Sagas
    --> https://redux-saga.js.org/docs/advanced/Testing.html
    --> https://dev.to/phil/the-best-way-to-test-redux-sagas-4hib
    --> https://medium.com/@gethylgeorge/using-redux-saga-to-handle-side-effects-and-testing-it-using-jest-2dff2d59f899
*/