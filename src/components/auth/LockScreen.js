import React from 'react'
import {Text, Alert } from 'react-native'

import {connect} from "react-redux";

import {logout, verifyPinRequest} from "../../reducers/authReducer";
import { strings } from "../../../locales/i18n";
import GenericPinComponent from "./GenericPinComponent"

const mapStateToProps = (state) => {
    return {
        verifyPin: state.verifyPin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
        resetState: () => dispatch({type: 'RESET'}),
        verifyPinRequest: (body) => dispatch(verifyPinRequest({body})),
    };
};

function LockScreen({verifyPin, verifyPinRequest, logout, resetState}) {
    const _logout = () => {
        logout();
        resetState()
    };

    const _signOutAlert = () => {
        Alert.alert(
            `${strings('AuthButton.LogOutText')}`,
            `${strings('AuthButton.AuthPrompt')}`,
            [
                { text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => console.log('cancel'), style: 'cancel'},
                { text: strings('AuthButton.LogOutText'), onPress: () => _logout()}
            ],
        );
    };

    let clearButton = (
        <Text onPress={() => _signOutAlert()}>{strings('SendPaymentCameraScreen.Cancel')}</Text>
    );

    let promptText;
    if (verifyPin.error) {
        promptText = strings('EnterPinLogin.IncorrectPin')
    } else {
        promptText = strings('EnterPinLogin.EnterPinPrompt')
    }

    return (
        <GenericPinComponent
            authState={verifyPin}
            submitPin={(pin) => verifyPinRequest({pin})}
            clearButton={clearButton}
            promptText={promptText}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen);
