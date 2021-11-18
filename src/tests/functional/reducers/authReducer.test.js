import { login, setPin, verifyPin, openApp, initialLoginState, initialSetPinState, initialVerifyPinState, initialAppState } from '../../../reducers/authReducer';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_PARTIAL, LOGIN_FAILURE, LOGOUT } from '../../../reducers/authReducer';
import { SET_PIN_REQUEST, SET_PIN_SUCCESS, SET_PIN_FAILURE } from '../../../reducers/authReducer';
import { OPEN_APP_REQUEST, VERIFY_PIN_REQUEST, VERIFY_PIN_SUCCESS, VERIFY_PIN_FAILURE } from '../../../reducers/authReducer';
import { OPEN_APP_SUCCESS, OPEN_APP_FAILURE, BACKGROUND_APP, UPDATE_REQUIRE_PIN} from '../../../reducers/authReducer';

describe('AuthReducer',() => {
    it('Returns correct state when login is provided with LOGIN_REQUEST', () => {
        expect(login(initialLoginState, {type: LOGIN_REQUEST})).toMatchSnapshot();
    });

    it('Returns correct state when login is provided with LOGIN_SUCCESS', () => {
        expect(login(initialLoginState, {type: LOGIN_SUCCESS})).toMatchSnapshot();
    });

    it('Returns correct state when login is provided with LOGIN_PARTIAL', () => {
        expect(login(initialLoginState, {type: LOGIN_PARTIAL})).toMatchSnapshot();
    });

    it('Returns correct state when login is provided with LOGIN_FAILURE', () => {
        expect(login(initialLoginState, {type: LOGIN_FAILURE})).toMatchSnapshot();
    });

    it('Returns correct state when login is provided with LOGIN_FAILURE', () => {
        expect(login(initialLoginState, {type: LOGIN_FAILURE})).toMatchSnapshot();
    });

    it('Returns correct state when login is provided with LOGOUT', () => {
        expect(login(initialLoginState, {type: LOGOUT})).toMatchSnapshot();
    });
});

describe('setPin',() => {
    it('Returns correct state when setPin is provided with SET_PIN_REQUEST', () => {
        expect(setPin(initialSetPinState, {type: SET_PIN_REQUEST})).toMatchSnapshot();
    });

    it('Returns correct state when setPin is provided with SET_PIN_SUCCESS', () => {
        expect(setPin(initialSetPinState, {type: SET_PIN_SUCCESS})).toMatchSnapshot();
    });

    it('Returns correct state when setPin is provided with SET_PIN_FAILURE', () => {
        expect(setPin(initialSetPinState, {type: SET_PIN_FAILURE})).toMatchSnapshot();
    });
});

describe('verifyPin',() => {
    it('Returns correct state when verifyPin is provided with OPEN_APP_REQUEST', () => {
        expect(verifyPin(initialVerifyPinState, {type: OPEN_APP_REQUEST})).toMatchSnapshot();
    });

    it('Returns correct state when verifyPin is provided with VERIFY_PIN_REQUEST', () => {
        expect(verifyPin(initialVerifyPinState, {type: VERIFY_PIN_REQUEST})).toMatchSnapshot();
    });

    it('Returns correct state when verifyPin is provided with VERIFY_PIN_SUCCESS', () => {
        expect(verifyPin(initialVerifyPinState, {type: VERIFY_PIN_SUCCESS})).toMatchSnapshot();
    });

    it('Returns correct state when verifyPin is provided with VERIFY_PIN_FAILURE', () => {
        expect(verifyPin(initialVerifyPinState, {type: VERIFY_PIN_FAILURE})).toMatchSnapshot();
    });
});

describe('openApp',() => {
    it('Returns correct state when openApp is provided with OPEN_APP_REQUEST', () => {
        expect(openApp(initialAppState, {type: OPEN_APP_REQUEST})).toMatchSnapshot();
    });

    it('Returns correct state when openApp is provided with OPEN_APP_SUCCESS', () => {
        expect(openApp(initialAppState, {type: OPEN_APP_SUCCESS})).toMatchSnapshot();
    });

    it('Returns correct state when openApp is provided with OPEN_APP_FAILURE', () => {
        expect(openApp(initialAppState, {type: OPEN_APP_FAILURE})).toMatchSnapshot();
    });

    it('Returns correct state when openApp is provided with BACKGROUND_APP', () => {
        expect(openApp(initialAppState, {type: BACKGROUND_APP})).toMatchSnapshot();
    });

    it('Returns correct state when openApp is provided with UPDATE_REQUIRE_PIN', () => {
        expect(openApp(initialAppState, {type: UPDATE_REQUIRE_PIN})).toMatchSnapshot();
    });
});
