import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    Platform,
    TouchableHighlight,
    TextInput,
    Alert
} from 'react-native';

import base64 from 'react-native-base64';
import { RNCamera } from 'react-native-camera';
import axios from 'axios'
import NfcManager, {NdefParser, NfcTech} from 'react-native-nfc-manager';
import { strings } from "../../../locales/i18n";

class CardScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supported: true,
            enabled: false,
            modalVisible: false,
            domain: '',
            username: '',
            password: '',
            tagID: null,
            qrData: null,
            message: "",
            messageColor: "black",
            isLoading: false,
            loginStatus: strings('CardScanScreen.LoggedOut'), // "Logged Out",
            loginColor: "black",
            loggedIn: false
        }
    }

    componentDidMount() {
        NfcManager.isSupported()
            .then(supported => {
                this.setState({ supported });
                if (supported) {
                    this._startNfc();
                    this._startDetection();
                }
            })
    }

    componentWillUnmount() {
        if (this._stateChangedSubscription) {
            this._stateChangedSubscription.remove();
        }
        this._stopDetection();
    }

    _handleQRCodeScan(data) {

        let qrData = data.data;

        try {
            if (qrData.indexOf("auth:") !== -1) {
                //We're looking at auth data
                let jsonStr = qrData.slice(5,);
                let authData = JSON.parse(jsonStr);
                this.setState({
                        domain: authData.d,
                        username: authData.u,
                        password: authData.p,
                    },
                    () => this._testAuthAPI()
                )

            } else {
                //We're looking at a card public serial number (probably)

                if (qrData.indexOf("/") !== -1) {
                    //Strip messy data
                    qrData = qrData.slice(0, qrData.indexOf("/"));
                }

                this.setState({
                    qrData: qrData,
                    messageColor: "black",
                    message: strings('CardScanScreen.QRScanned')  // QR Scanned
                })
            }
        } catch (e) {
            this.setState({
                messageColor: "red",
                message: strings('CardScanScreen.QRScanError') // "Qr Code Scanning Error"
            })
        }


    }

    _startNfc() {
        NfcManager.start({
            onSessionClosedIOS: () => {
                console.log('ios session closed');
            }
        })
            .then(result => {
                console.log('start OK', result);
            })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            })

        if (Platform.OS === 'android') {
            NfcManager.getLaunchTagEvent()
                .then(tag => {
                    console.log('launch tag', tag);
                    if (tag) {
                        this.setState({ tag });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.isEnabled()
                .then(enabled => {
                    console.log("nfc enabled");
                    this.setState({ enabled });
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.onStateChanged(
                event => {
                    if (event.state === 'on') {
                        this.setState({enabled: true});
                    } else if (event.state === 'off') {
                        this.setState({enabled: false});
                    } else if (event.state === 'turning_on') {
                        // do whatever you want
                    } else if (event.state === 'turning_off') {
                        // do whatever you want
                    }
                }
            )
                .then(sub => {
                    this._stateChangedSubscription = sub;
                    // remember to call this._stateChangedSubscription.remove()
                    // when you don't want to listen to this anymore
                })
                .catch(err => {
                    console.warn(err);
                })
        }
    }

    _onTagDiscovered = tag => {
        this.setState({
            tagID: tag.id,
            messageColor: "black",
            message: strings('CardScanScreen.NFCScanned') // "NFC Scanned"
        });
    }

    _startDetection = () => {
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.log('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }

    _sendDataToServer = () => {
        if (this.state.isLoading) {
            return
        }

        if (!this.state.qrData) {
            this.setState({
                messageColor: "red",
                message: strings('CardScanScreen.QRMissing') // "Missing QR Code"
            });
            return
        }

        if (!this.state.tagID) {
            this.setState({
                messageColor: "red",
                message: strings('CardScanScreen.NFCMissing') // "Missing NFC ID"
            });
            return
        }

        if (!this.state.loggedIn) {
            this.setState({
                messageColor: "red",
                message: strings('CardScanScreen.NotLoggedIn') // "Not Logged In!"
            });
            return
        }

        this._sendDataAPI(this.state.qrData, this.state.tagID)
    };

    _testAuthAPI = () => {
        this.setState({
            loginStatus: strings('CardScanScreen.LoggingIn'), // "Logging In",
            loginColor: "#30a4a6"
        });

        let { username, password } = this.state;

        const authHeader = 'Basic ' + base64.encode(`${username}:${password}`);

        return axios('https://' + this.state.domain + '/api/v1/auth/check/basic/', {
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get',
        })
            .then((response) => {
                this.setState({
                    loginStatus: strings('CardScanScreen.LoggedIn'), // "Logged In!",
                    loginColor: "green",
                    loggedIn: true
                });
                return response.data
            })
            .catch(error => {
                console.log("LoginErr", error)
                this.setState({
                    loginStatus: this._extractErrorMessage(error) || strings('CardScanScreen.LoginError'), // "Login Error",
                    loginColor: "red"
                })
            });

    }

    _sendDataAPI = (public_serial_number, nfc_serial_number) => {

        this.setState({
            qrData: null,
            tagID: null,
            messageColor: "black",
            message: strings('CardScanScreen.Loading'), // "Loading...",
            isLoading: true,
        });

        let { username, password } = this.state;

        const authHeader = 'Basic ' + base64.encode(`${username}:${password}`);

        return axios('https://' + this.state.domain + '/api/v1/transfer_cards/', {
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                public_serial_number,
                nfc_serial_number
            }),
            method: 'post',
        })
            .then((response) => {
                this.setState({
                    messageColor: "green",
                    message: "success!",
                    isLoading: false
                });
                return response.data
            })
            .catch(error => {
                this.setState({
                    messageColor: "red",
                    message: this._extractErrorMessage(error) || strings('CardScanScreen.Error'), // "Error",
                    isLoading: false
                })
            });
    };

    _extractErrorMessage(error) {
        return error.response && error.response.data && error.response.data.message
    }

    render() {
        let {
            tagID,
            domain,
            username,
            password,
            qrData,
            message,
            messageColor,
            modalVisible,
            loginStatus,
            loginColor,
        } = this.state;

        let settingsModal = (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{strings('CardScanScreen.Deployment')}</Text>
                            <TextInput
                                style={{width: 200}}
                                value={domain}
                                onChangeText={domain => this.setState({ domain })}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{strings('CardScanScreen.KoboUsername')}</Text>
                            <TextInput
                                style={{width: 200}}
                                value={username}
                                onChangeText={username => this.setState({ username })}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{strings('CardScanScreen.KoboPassword')}</Text>
                            <TextInput
                                style={{width: 200}}
                                value={password}
                                onChangeText={password => this.setState({ password })}
                            />
                        </View>

                        <TouchableHighlight
                            style={{ ...styles.openButton }}
                            onPress={() => {
                                this.setState({modalVisible: false});
                                this._testAuthAPI()
                            }}
                            accessibilityLabel={strings('SendPaymentCameraScreen.Done')}
                        >
                            <Text style={styles.buttonStyle}>{strings('SendPaymentCameraScreen.Done')}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )

        return (
            <View style={{flex: 1}}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    onBarCodeRead={(d) => {
                        this._handleQRCodeScan(d)
                    }}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                >
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)'
                        }}>

                            <Text style={{ margin: 20, color: tagID? 'green' : 'black' }}>
                                {`${strings('CardScanScreen.NFCID')} ${tagID? tagID : ''}`}
                            </Text>

                            <Text style={{ margin: 20, color: qrData? 'green' : 'black'}}>
                                {`${strings('CardScanScreen.QRCode')} ${qrData? qrData : ''}`}
                            </Text>

                            <Text style={{ margin: 20, color: messageColor }}>
                                {`${message? message : '...'}`}
                            </Text>

                        </View>
                    </View>

                </RNCamera>

                <View style={{
                    position: 'absolute',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'}}
                >
                    <Text
                        style={{padding: 15, fontWeight: "bold", color: loginColor}}
                        onPress={() => {this.setState({modalVisible: true})}}>
                        ⚙️ {loginStatus}
                    </Text>
                </View>

                {settingsModal}

                <TouchableHighlight
                    style={{ ...styles.openButton, padding: 10, borderRadius: 0}}
                    onPress={this._sendDataToServer}
                    accessibilityLabel={strings('SendPaymentCameraScreen.Send')}
                >
                    <Text style={{...styles.buttonStyle, margin: 10}}>{strings('SendPaymentCameraScreen.Send')}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#30a4a6",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default CardScanScreen;

