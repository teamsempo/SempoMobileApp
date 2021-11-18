import React from 'react';
import {connect} from "react-redux";
import { Text, View } from 'react-native';
import { TextInput as FlatTextInput }  from 'react-native-paper';

import { strings } from '../../../locales/i18n';
import AsyncButton from "../common/AsyncButton";

import {loginRequest} from "../../reducers/authReducer";
import LoginScreenWrapper from "./LoginScreenWrapper"

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (body) => dispatch(loginRequest({body}))
    };
};

class OTPScreen extends React.Component {
    state = {
        otp: '',
        pinTooShort: false,
        pinMissing: false
    };

    handleOTPAttempt() {
        if (this.state.otp.length === 0) {
            this.setState({pinMissing: true})
        } else if (this.state.otp.length < 4) {
            this.setState({pinTooShort: true});
            return
        }

        this.props.loginRequest({
            phone: this.props.route.params.phone,
            region: this.props.route.params.region,
            pin: this.state.otp,
            password: this.state.otp
        });
    }

    onPress() {
        this.handleOTPAttempt()
    }

    render() {

        let error_message;
        if (this.state.pinTooShort) {
            error_message = `${strings('OTP.TooShortError')}`
        } else if (this.state.pinMissing) {
            error_message = `${strings('OTP.MissingError')}`
        } else if (this.props.login.error) {
            error_message = this.props.login.error
        } else {
            error_message = ''
        }

        return (
            <LoginScreenWrapper navigation={this.props.navigation}>
                <View style={{display: 'flex', flexDirection: 'row', width: '100%'}} accessibilityLabel={strings('OTP.Prompt')}>
                    <View style={{width: '100%'}}>
                        <FlatTextInput
                            keyboardType="phone-pad"
                            label={strings('OTP.Prompt')}
                            mode="flat"
                            maxLength={4}
                            value={ this.state.otp }
                            onChangeText={otp => this.setState({ otp })}
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
export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);