import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Modal,
} from 'react-native'

import {connect} from "react-redux";

import Styles from '../../Styles';

import { getUserFromPublicSerialNumber, RESET_USER_BY_PUBLIC_SERIAL } from "../../reducers/userReducer";

import { RNCamera } from "react-native-camera";
import { strings } from "../../../locales/i18n";
import CurrencyAmount from '../CurrencyAmount'
import {chargeNFCCard, closeNFCRead} from "../../reducers/nfcReducer";
import NfcManager from "react-native-nfc-manager";

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        users: state.users,
        NFCTransceiveStatus: state.NFC.TransceiveStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserFromPublicSerialNumber: (query) => dispatch(getUserFromPublicSerialNumber({query})),
        resetCheckBalance: () => dispatch({type: RESET_USER_BY_PUBLIC_SERIAL}),
        chargeNFCCard: (chargeAmount) => dispatch(chargeNFCCard(chargeAmount, null)),
        cancelNFCRead: () => dispatch(closeNFCRead())
    };
};

class CheckBalanceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            public_serial_number: '',
            NFC_supported: true,
            NFC_enabled: false,
            detection_was_on_previously: false,
            nfc_id: '',
            amount: '',
            checking_nfc: false,
            invalid_nfc: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentDidMount() {
        NfcManager.isSupported()
            .then(NFC_supported => {
                this.setState({ NFC_supported });
                if (NFC_supported) {
                    this._startNfc();
                }
            })
    }

    componentWillUnmount() {
        this.props.resetCheckBalance();
        this._stopDetection();
        this.props.cancelNFCRead();
    }

    _handleScan = (e) => {
        try {
            if (this.state.public_serial_number !== e.data) {
                this.setState({ public_serial_number: e.data });
                this.props.getUserFromPublicSerialNumber({
                    public_serial_number: e.data
                })
            }
        }
        catch(err) {
            console.log(err)
        }
    };

    _startNfc() {
        NfcManager.start({

        }).then(result => {
            console.log('start OK', result);
        })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            })


        NfcManager.isEnabled()
            .then(NFC_enabled => {
                this.setState({ NFC_enabled });

                if (NFC_enabled) {
                    this._startDetection()
                }

            })
            .catch(err => {
                console.log(err);
            })

        NfcManager.onStateChanged(
            event => {
                if (event.state === 'on') {
                    this.setState({NFC_enabled: true});
                    this._startDetection()
                } else if (event.state === 'off') {
                    this.setState({NFC_enabled: false});
                    this._stopDetection()
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

    _startDetection = () => {
        this.setState({detection_was_on_previously: true});
        this.props.chargeNFCCard(0);
    };

    _stopDetection = () => {
        NfcManager.stop().then(result => {
            console.log('stop OK', result)
        })
            .catch(error => {
                console.warn('stop fail', error)
            })
    };

    render() {

        if (this.props.users.getUserFromPublicSerialNumberStatus.success === true) {
            var content =
                <View style={{paddingHorizontal: 50, paddingVertical: 20}}>
                    <Text
                        style={styles.title}>{this.props.users.getUserFromPublicSerialNumberStatus.load_result.message}</Text>
                    <Text style={styles.title}>Balance: <CurrencyAmount
                        amount={this.props.users.getUserFromPublicSerialNumberStatus.load_result.data.balance / 100}/></Text>
                </View>
        } else if (this.props.NFCTransceiveStatus.success === true) {
             content =
                <View style={{paddingHorizontal: 50, paddingVertical: 20}}>
                    <Text style={styles.title}>Balance: <CurrencyAmount
                        amount={this.props.NFCTransceiveStatus.balance / 100}/>
                    </Text>
                </View>
        } else if (this.props.users.getUserFromPublicSerialNumberStatus.error !== null) {
            content = <View><Text style={styles.title}>{this.props.users.getUserFromPublicSerialNumberStatus.error.message}</Text></View>
        } else {
            content = null
        }

        return (
            <View style={Styles.rootContainer}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    onBarCodeRead={(e) => this._handleScan(e)}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    permissionDialogTitle={`${strings('CameraScreen.permissionDialog')}`}
                    permissionDialogMessage={`${strings('CameraScreen.permissionDialog')}`}
                />
                {content}
                {(this.props.users.getUserFromPublicSerialNumberStatus.isRequesting
                    || this.props.NFCTransceiveStatus.isReading)?
                    <Modal
                        transparent={true}
                        animationType={'none'}>
                        <View style={styles.modalBackground}>
                            <View style={styles.activityIndicatorWrapper}>
                                <ActivityIndicator />
                            </View>
                        </View>
                    </Modal>
                    : null }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckBalanceScreen);

const styles = StyleSheet.create({
    preview: {
        flex: 11,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    title: {
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor: '#F7F7F7'
    },
    balance: {
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});