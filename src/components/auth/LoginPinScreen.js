import React from 'react'
import {connect} from "react-redux";

import {loginRequest} from "../../reducers/authReducer";
import { strings } from "../../../locales/i18n";
import GenericPinComponent from "./GenericPinComponent"

const mapStateToProps = (state) => {
    return {
        login: state.login,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (body) => dispatch(loginRequest({body}))
    };
};

function LoginPinScreen({login, loginRequest, route}) {

    let promptText;
    if (login.error) {
        promptText = strings('EnterPinLogin.IncorrectPin')
    } else {
        promptText = strings('EnterPinLogin.EnterPinPrompt')
    }

    return (
        <GenericPinComponent
            authState={login}
            submitPin={(pin) => loginRequest({
                phone: route.params.phone,
                region: route.params.region,
                pin: pin,
                password: pin
            })}
            promptText={promptText}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPinScreen);
