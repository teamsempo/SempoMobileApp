import React from 'react';
import {connect} from "react-redux";
import { Text, View } from 'react-native';
import { TextInput as FlatTextInput }  from 'react-native-paper';

import { strings } from '../../../locales/i18n';
import {tracker} from "../../analytics";
import AsyncButton from "../common/AsyncButton";

import CountryPickerWrapper from "../CountryPickerWrapper";
import {loginRequest} from "../../reducers/authReducer";
import LoginScreenWrapper from "./LoginScreenWrapper"

const mapStateToProps = (state) => {
    return {
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (body) => dispatch(loginRequest({body}))
    };
};

class PhoneNumberScreen extends React.Component {
    state = {
        phoneMissing: false,
        phoneNumber: '',
    };

    attemptLogin() {
        console.log("phone number is", this.state.phoneNumber);

        if (this.state.phoneNumber.length < 5) {
            this.setState({phoneMissing: true});
            return
        }
        console.log("phone number is", this.state.phoneNumber);
        this.props.loginRequest({
            phone: this.state.phoneNumber,
        });
        tracker.logEvent("LoginButton");
    }

    onPress() {
        console.log("onpress triggger")
        this.attemptLogin()
    }

    render() {

        let error_message = '';

        if (this.state.phoneMissing) {
            error_message = `${strings('AuthInput.PhoneMissing')}`
        } else if (this.props.login.error) {
            error_message = this.props.login.error
        } else {
            error_message = ''
        }

        return (
            <LoginScreenWrapper navigation={this.props.navigation}>
                <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '100%'}}>
                        <FlatTextInput
                            keyboardType="phone-pad"
                            label={(strings('AuthInput.PhonePlaceholder'))}
                            mode="flat"
                            maxLength={20}
                            value={ this.state.phoneNumber }
                            onChangeText={phoneNumber => this.setState({ phoneNumber })}
                            style={{backgroundColor: '#FFF', display: 'flex'}}
                        />
                    </View>
                </View>

                <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>
                    { error_message }
                </Text>

                <AsyncButton
                    onPress={() => {
                        this.onPress()
                    }}
                    isLoading={this.props.login.isRequesting}
                    buttonText={strings('ManualPayment.Next').toUpperCase()}
                />
            </LoginScreenWrapper>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberScreen);