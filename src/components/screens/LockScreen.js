import React from 'react'
import {StyleSheet, Text, View, Animated, I18nManager, Vibration, Dimensions, Easing, Alert } from 'react-native'
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types'

import Styles from "../../Styles";
import Keypad from '../Keypad.js'
import {loginRequest, logout, setPinRequest, verifyPinRequest} from "../../reducers/authReducer";
import LoadingSpinnerOverlay from "../LoadingSpinnerOverlay.js";
import { strings } from "../../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        verifyPin: state.verifyPin,
        setPin: state.setPin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
        resetState: () => dispatch({type: 'RESET'}),
        verifyPinRequest: (body) => dispatch(verifyPinRequest({body})),
        setPinRequest: (body) => dispatch(setPinRequest({body})),
        loginRequest: (body) => dispatch(loginRequest({body})),
    };
};

const InputView = ({pinViewAnim, inputPinLength, pinLength, bgColor, activeBgColor, styles, bgOpacity}) => {
    const tilt = pinViewAnim.interpolate({
        inputRange : [0, 0.2, 0.4, 0.6, 0.8, 1],
        outputRange: [0, -50, 50, -25, 25, 0],
    });

    const inactiveInput = (index) => {
        return <Animated.View
            key={"passwordItem-" + index}
            style={[styles[1], {
                backgroundColor: bgColor,
                opacity        : bgOpacity,
            }]}/>;
    };

    const activeInput = (index) => {
        return <Animated.View
            key={"passwordItem-" + index}
            style={[styles[2], {
                backgroundColor: activeBgColor,
                opacity        : 1,
            }]}/>
    };
    const ShowInput = (pinLength) => {
        let table = [];
        for (let i = 0; i < pinLength; i++) {
            if (inputPinLength <= i) {
                table.push(inactiveInput(i))
            } else {
                table.push(activeInput(i))
            }
        }
        return table
    };

    return (
        <Animated.View style={[styles[0], {
            transform    : [{translateX: tilt}],
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }]}>
            {ShowInput(pinLength)}
        </Animated.View>
    )

};

class LockScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setPinVal: '',
            pin: '',
            error: false,
            inputPinLength: Object.assign([]),
            pinViewAnim: new Animated.Value(0),
        };
        this.keyboardOnPress = this.keyboardOnPress.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.verifyPin !== this.props.verifyPin) {
            if (this.props.verifyPin.success === false && !this.props.verifyPin.isRequesting) {
                this.clear()
            }
        }
    }

    clear() {
        this.setState({
            pin: '',
            inputPinLength: Object.assign([]),
            error: true,
        });
        Vibration.vibrate(500, false);
    }

    keyboardOnPress = (val) => {
        const valLength = val.toString().length;
        if (this.props.pinLength === valLength) {
            this.setState({
                pin: val,
                inputPinLength: valLength
            }, () => {
                this._checkPin();
            });
        } else {
            this.setState({
                pin: val,
                inputPinLength: valLength
            });
        }
    };

    _checkPin() {
        if (this.props.set) {
            // set PIN flow

            if (this.state.setPinVal === '') {
                // set the PIN in state. clear keyboard.
                this.setState({setPinVal: this.state.pin, pin: '', inputPinLength: Object.assign([])})
            } else if (this.state.pin === this.state.setPinVal) {
                // PIN in state == PIN provided
                // set new PIN on server and device
                this.props.setPinRequest({
                    region: this.props.region,
                    phone: this.props.phone,
                    one_time_code: this.props.otp,
                    new_pin: this.state.pin,
                })
            } else {
                // PIN in state is different. clear keyboard
                this.setState({error: true, pin: '', inputPinLength: Object.assign([])}, () => setTimeout(() => this.setState({error: false}), 3000))
            }

        } else if (this.props.login) {
            // login with PIN
            this.props.loginRequest({phone: this.props.phone, password: this.state.pin, region: this.props.region});

        } else if (this.props.verify) {
            // verify the PIN matches PIN on device
            this.props.verifyPinRequest({
                pin: this.state.pin,
            })

        }
    }

    _logout() {
        this.props.logout();
        this.props.resetState()
    }

    _signOutAlert() {
        Alert.alert(
            `${strings('AuthButton.LogOutText')}`,
            `${strings('AuthButton.AuthPrompt')}`,
            [
                { text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => console.log('cancel'), style: 'cancel'},
                { text: strings('AuthButton.LogOutText'), onPress: () => this._logout()}
                ],
        );
    }

    render() {
        const { pinLength, inputBgColor, inputActiveBgColor, inputBgOpacity, set, verifyPin, setPin } = this.props;

        const inputButtons = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [
                {value: 'C', display: <Text onPress={() => this._signOutAlert()}>{strings('SendPaymentCameraScreen.Cancel')}</Text>},
                0,
                {value: 'B', display: <Icon name="backspace" size={20} color="#3D454C"/>}
            ]
        ];

        const setPrompt = this.state.setPinVal !== '' ? strings('LockScreen.RenterPasscode') : strings('LockScreen.SetPasscode');
        const promptText = set ? setPrompt : strings('LockScreen.Prompt');

        return (
            <View style={Styles.rootContainer}>

                <View style={styles.pinDisplayContainer}>

                    <Text style={styles.pinPrompt}>{(this.state.error ? strings('LockScreen.ErrorPrompt') : promptText)}</Text>

                    <InputView
                        bgOpacity={inputBgOpacity}
                        pinLength={pinLength}
                        activeBgColor={inputActiveBgColor}
                        inputPinLength={this.state.inputPinLength}
                        pinViewAnim={this.state.pinViewAnim}
                        bgColor={inputBgColor}
                        styles={[styles.passwordInputView, styles.passwordInputViewItem, styles.passwordInputViewItemActive]}
                    />

                </View>

                <LoadingSpinnerOverlay loading={set ? setPin.isRequesting : verifyPin.isRequesting}/>

                <Keypad value={this.state.pin} inputButtons={inputButtons} onChange={(pin) => this.keyboardOnPress(pin)} onSubmit={() => this._checkPin()}/>
            </View>
        )
    }
}

LockScreen.defaultProps = {
    otp                  : null,
    region               : null,
    phone                : null,
    login                : false,
    set                  : false,
    verify               : true,
    deleteText           : "DEL",
    buttonBgColor        : '#FFF',
    buttonTextColor      : '#333',
    inputBgColor         : '#333',
    inputActiveBgColor   : '#333',
    returnType           : 'string',
    inputBgOpacity       : 0.1,
    disabled             : false,
    clear                : false,
    pinLength: 4,
};
LockScreen.propTypes = {
    disabled             : PropTypes.bool,
    deleteText           : PropTypes.string,
    returnType           : PropTypes.string,
    buttonBgColor        : PropTypes.string,
    buttonTextColor      : PropTypes.string,
    inputBgColor         : PropTypes.string,
    inputActiveBgColor   : PropTypes.string,
    inputBgOpacity       : PropTypes.number,
    pinLength            : PropTypes.number.isRequired,
    clear                : PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promptContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinDisplayContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },

    passwordInputView          : {
        alignSelf    : 'center',
    },
    passwordInputViewItem      : {
        alignItems    : 'center',
        justifyContent: 'center',
        height        : 35,
        margin        : 5,
        width         : 35,
        borderRadius  : 35 / 2,
    },
    passwordInputViewItemActive: {
        alignItems    : 'center',
        justifyContent: 'center',
        height        : 35,
        width         : 35,
        margin        : 5,
        borderRadius  : 35 / 2,
    },
    pinPrompt: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        margin: 10,
        position: 'absolute',
        top: 40,
    }
});