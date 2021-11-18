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
        login: state.login,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (body) => dispatch(loginRequest({body}))
    };
};

const InputView = ({pinViewAnim, inputPin, pinLength, bgColor, activeBgColor, styles, bgOpacity}) => {
    const tilt = pinViewAnim.interpolate({
        inputRange : [0, 0.2, 0.4, 0.6, 0.8, 1],
        outputRange: [0, -50, 50, -25, 25, 0],
    });

    let inputPinLength = inputPin.toString().length;

    console.log("Pin is", inputPin)

    const inactiveInput = (index) => {
        return <Animated.View
            key={"passwordItem-" + index}
            style={[styles[1], {
                backgroundColor: bgColor,
                opacity        : bgOpacity,
                // borderWidth: 4,
                // borderColor: "#20232a",
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

class GenericPinComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: '',
            pinViewAnim: new Animated.Value(0),
        };
        this.keyboardOnPress = this.keyboardOnPress.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidUpdate(prevProps){
        //We WERE doing a pin auth request, but we no longer are, and there has been an error with our attempt
        if (prevProps.authState.isRequesting && ! this.props.authState.isRequesting && this.props.authState.error) {
            this.clear()
        }
    }

    clear() {
        console.log("clearing")
        this.setState({
            pin: '',
        }, () => console.log("setstate pin", this.state.pin));
        Vibration.vibrate(500, false);
    }

    keyboardOnPress = (val) => {
        let currentLength = val.toString().length;
        if (this.props.pinLength === currentLength) {
            this.setState({
                pin: val,
            }, () => {
                this._submitPin();
            });
        } else if (this.props.pinLength > currentLength) {
            this.setState({
                pin: val,
            });
        }
    };

    _submitPin() {
        this.props.submitPin(this.state.pin, this)
    }

    render() {
        const {
            authState,
            promptText,
            clearButton,
            backspaceButton,
            pinLength,
            inputBgColor,
            inputActiveBgColor,
            inputBgOpacity
        } = this.props;

        let clearButtonDict;

        if (clearButton) {
            clearButtonDict = {
                value: 'C',
                display: clearButton
            };
        } else {
            clearButtonDict = {
                value: 'C',
                display:<Text onPress={() => this.clear()}>{strings('SetPin.ClearPin')}</Text>
            };
        }

        let backspaceButtonDict;

        if (backspaceButton) {
            backspaceButtonDict = {
                value: 'B',
                display: backspaceButton
            };
        } else {
            backspaceButtonDict = {
                value: 'B',
                display: <Icon name="backspace" size={20} color="#3D454C"/>
            };
        }

        const inputButtons = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [clearButtonDict, 0, backspaceButtonDict]
        ];

        return (
            <View style={Styles.rootContainer}>

                <View style={styles.pinDisplayContainer}>

                    <Text style={styles.pinPrompt}>{promptText}</Text>

                    <InputView
                        bgOpacity={inputBgOpacity}
                        pinLength={pinLength}
                        bgColor={inputBgColor}
                        activeBgColor={inputActiveBgColor}
                        inputPin={this.state.pin}
                        pinViewAnim={this.state.pinViewAnim}
                        styles={[styles.passwordInputView, styles.passwordInputViewItem, styles.passwordInputViewItemActive]}
                    />

                </View>

                <LoadingSpinnerOverlay loading={authState.isRequesting}/>

                <Keypad
                    value={this.state.pin}
                    inputButtons={inputButtons}
                    onChange={(pin) => this.keyboardOnPress(pin)}
                    onSubmit={() => this._submitPin()}/>
            </View>
        )
    }
}

GenericPinComponent.defaultProps = {
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
GenericPinComponent.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(GenericPinComponent);

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