import AsyncStorage from '@react-native-community/async-storage';
import { call, put, all, cancelled, takeEvery,select } from 'redux-saga/effects';
import { SEMPO_API_URL, USE_DELEGATOR } from '../config';
import DeviceInfo from 'react-native-device-info';
import Intercom from 'react-native-intercom';
import { Dimensions } from 'react-native'
import { tracker } from '../analytics.js'

import {removeToken, storeToken, storeHostURL, getPIN, storePIN, removePIN } from '../utils';

import { requestApiToken, refreshApiToken, setPINApi, logoutApi } from '../api/authAPI';

import * as RootNavigation from '../RootNavigation.js'

import {
    REAUTH_REQUEST,
    LOGIN_REQUEST,
    LOGIN_PARTIAL,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    SET_PIN_REQUEST,
    SET_PIN_SUCCESS,
    SET_PIN_FAILURE,
    VERIFY_PIN_REQUEST,
    VERIFY_PIN_SUCCESS,
    VERIFY_PIN_FAILURE,
    OPEN_APP_REQUEST,
    OPEN_APP_SUCCESS,
    OPEN_APP_FAILURE,
    NEED_SET_PIN,
    NEED_OTP_VERIFY,
    NEED_LOGIN_WITH_PIN
} from '../reducers/authReducer';

import { checkVersionRequest } from "../actions/versionActions";
import { LOCALE_REFRESH } from "../reducers/localeReducer";
import {getCountryCode} from "../api/geoAPI";

function* errorOnLogin() {
    // this is called if an error occurs during refresh auth or app open
    yield put({type: LOGIN_FAILURE, error: ''});

    yield call(removeToken);

    // yield call(NavigationService.navigate, 'Login');
}

export function* navigateBasedOffLoginState(login_state) {
    // todo: nav to Verification flow.
    // if (login_state.kycActive) {
    //     yield call(NavigationService.navigate, 'VerifyUser', {title: strings('GoBackNav.DefaultTitleText')});
    //     return
    // }
    // yield call(NavigationService.navigate, 'MainApp');
}

function* getVersionAndLocale() {
    yield put({type: LOCALE_REFRESH});

    const version = DeviceInfo.getReadableVersion();
    yield put(checkVersionRequest({body: {version: version}}));
}

function setFirebaseAnalyticsTracker(token_response) {
    const userId = token_response.user_id.toString();
    const androidHash = token_response.android_intercom_hash;
    const name = token_response.first_name + ' ' + token_response.last_name;
    // const deploymentName = token_response.deployment_name.toString();

    if (token_response.terms_accepted) {
        // Setup User Id for Google Analytics
        tracker.setUserId(userId);

        // setup Intercom
        Intercom.registerIdentifiedUser({ userId: userId });
        Intercom.setUserHash(androidHash);
        Intercom.updateUser({
            name: name,
            phone: token_response.phone,
            kyc_status: token_response.kyc_status
        })
    }
}

function getHostURL(token_response) {
    if (USE_DELEGATOR == 1) {
        //TODO: Work out if we only need the first host setting path
        if (token_response.host_url) {
            return  token_response.host_url
        } else {
            let name = (token_response.host_name || token_response.deployment_name);
            return 'https://' + name + '.withsempo.com'
        }
    } else {
        return SEMPO_API_URL;
    }
}

function* handleTokenResponse(token_response) {

    if (token_response.status === 'success') {

        let hostURL = getHostURL(token_response);
        yield call(storeHostURL, hostURL);

        //If the user has just logged in, don't show the lockscreen
        yield put({type: VERIFY_PIN_SUCCESS});

        yield put({
            type: LOGIN_SUCCESS,
            token: token_response.auth_token,
            userId: token_response.user_id,
            transferAccountId: token_response.transfer_account_Id,
            firstName: token_response.first_name,
            lastName: token_response.last_name,
            isVendor: token_response.is_vendor,
            isSupervendor: token_response.is_supervendor,
            requestFeedbackQuestions: token_response.request_feedback_questions,
            defaultFeedbackQuestions: token_response.default_feedback_questions,
            deploymentName: token_response.deployment_name,
            termsAccepted: token_response.terms_accepted,
            kycActive: token_response.kyc_active,
            denominations: token_response.denominations,

            secret: token_response.secret,
            ecdsaPublic: token_response.ecdsa_public,
            localServerTimeDelta: new Date().getTime() - token_response.server_time,
            pusherKey: token_response.pusher_key,
            displayDecimals: token_response.display_decimals,
            currencySymbol: token_response.currency_symbol,
            currencyConversionRate: token_response.currency_conversion_rate,
            transferUsages: token_response.transfer_usages,
            NFCPositions: token_response.NFC_positions,
            forgivingDeduct: token_response.forgiving_deduct,
            supportSigValidation: token_response.support_sig_validation
        });
        // Ugly hack for now
        if (token_response.display_decimals != null){
            yield AsyncStorage.setItem('displayDecimals', token_response.display_decimals.toString());
        }
        else {
            yield AsyncStorage.setItem('displayDecimals', "2");
        }
        
        const getLogin = (state) => state.login;

        const login_state = yield select(getLogin);

        yield navigateBasedOffLoginState(login_state);

        yield call(storeToken, token_response.auth_token);

        yield setFirebaseAnalyticsTracker(token_response);

        yield call(getVersionAndLocale)

    } else {
        yield put({type: LOGIN_FAILURE, error: token_response.message})
    }

}


function getDeviceInfo() {
    const uniqueId = DeviceInfo.getUniqueId();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const {height, width} = Dimensions.get('window');

    return {
        uniqueId, model, brand, width, height
    }
}

function* requestToken({ payload }) {
    try {

        var deviceInfo = getDeviceInfo();

        if (!payload.body.region) {
            var countryCode = yield call(getCountryCode);
            console.log('countryCode is',countryCode);
            payload.body.region = countryCode
        }

        var token_response = yield call(requestApiToken, payload, deviceInfo);

        if (token_response.pin_must_be_set || token_response.otp_verify || token_response.login_with_pin) {
            let hostURL = getHostURL(token_response);
            yield call(storeHostURL, hostURL);

            let screenName;
            let partialState;

            if (token_response.pin_must_be_set) {
                // vendor SET pin
                screenName = 'SetPin';
                partialState = NEED_SET_PIN;
            }

            if (token_response.otp_verify) {
                // First login - OTP code verify
                screenName = 'OTP';
                partialState = NEED_OTP_VERIFY;
            }

            if (token_response.login_with_pin) {
                // login to mobile with PIN
                screenName = 'LoginPin';
                partialState = NEED_LOGIN_WITH_PIN;
            }

            let putObject = {type: LOGIN_PARTIAL, partialState: partialState};

            if (token_response.error_message) {
                putObject.error = token_response.error_message
            }

            console.log("putting object", putObject)

            yield put(putObject);

            RootNavigation.navigate(
                screenName,
                {
                    phone: payload.body.phone,
                    region: payload.body.region,
                    one_time_code: payload.body.pin || payload.body.password
                });


        } else {

            if (token_response.status === 'success') {
                yield call(storePIN, payload.body.pin || payload.body.password);  // successful login, saves PIN on device
            }

            yield handleTokenResponse(token_response);

        }

        return token_response

    } catch(error) {

        yield put({type: LOGIN_FAILURE, error: error})
    } finally {
        if (yield cancelled()) {
            // ... put special cancellation handling code here
        }
    }
}

function* watchLoginRequest() {
    yield takeEvery(LOGIN_REQUEST, requestToken);
}

function* refreshToken() {
    try {
        const token_response = yield call(refreshApiToken);

        yield handleTokenResponse(token_response);

        return token_response
    } catch(error) {
        const getLogin = (state) => state.login;
        const login = yield select(getLogin);

        if (login.token) {
            yield navigateBasedOffLoginState(login)

        } else {
            yield call(errorOnLogin)
        }

        return error
    } finally {
        if (yield cancelled()) {
            // ... put special cancellation handling code here
        }
    }
}

function* watchReAuthRequest() {
    yield takeEvery(REAUTH_REQUEST, refreshToken);
}

export function* logout() {
    yield call(logoutApi);
    yield call(removeToken);
    yield call(removePIN);
    Intercom.logout()
}

function* watchLogoutRequest() {
    const action = yield takeEvery([LOGOUT], logout);
}

function* setPin({ payload }) {
    try {
        const token_response = yield call(setPINApi, payload);

        yield call(storePIN, payload.body.new_pin || payload.body.new_password);  // saves PIN on device

        yield put({type: SET_PIN_SUCCESS});

        yield handleTokenResponse(token_response);

        return token_response
    } catch (error) {
        yield call(removePIN);
        yield put({type: SET_PIN_FAILURE, error: error})
    }
}

function* watchSetPIN() {
    yield takeEvery(SET_PIN_REQUEST, setPin);
}

function* verifyPin({payload}) {
    try {
        const stored_pin = yield call(getPIN);

        if (stored_pin) {
            const verify_pin = payload.body.pin === stored_pin;

            if (verify_pin) {

                yield put({type: VERIFY_PIN_SUCCESS});

                yield call(refreshToken);

            } else {
                yield put({type: VERIFY_PIN_FAILURE, error: 'Incorrect Pin'})

            }
        } else {
            yield call(errorOnLogin);

            yield put({type: VERIFY_PIN_FAILURE, error: 'No pin found on device'})
        }

    } catch (error) {
        yield put({type: VERIFY_PIN_FAILURE, error: error})
    }
}

function* watchVerifyPin() {
    yield takeEvery(VERIFY_PIN_REQUEST, verifyPin)
}

function* openApp() {
    try {

        const getRequirePIN = (state) => state.openApp.requirePIN;
        const requirePIN = yield select(getRequirePIN);
        const pin_on_device = yield call(getPIN);
        const pin_exists_on_device = typeof pin_on_device !== 'undefined' && pin_on_device !== null;

        if (!requirePIN || !pin_exists_on_device) {
            yield call(refreshToken)  // no PIN required or PIN doesn't exist, regular refreshToken flow.
        }

        yield put({type: OPEN_APP_SUCCESS});
    } catch (error) {
        // something went wrong with the app open
        // let's navigate to login screen

        yield call(errorOnLogin);

        yield put({type: OPEN_APP_FAILURE});
    }
}

function* watchOpenApp() {
    yield takeEvery(OPEN_APP_REQUEST, openApp)
}

export default function* authSagas() {
    yield all([
        watchReAuthRequest(),
        watchLoginRequest(),
        watchLogoutRequest(),
        watchSetPIN(),
        watchVerifyPin(),
        watchOpenApp(),
    ])
}