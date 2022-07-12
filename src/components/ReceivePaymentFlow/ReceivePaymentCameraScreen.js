'use strict';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import { createTransferRequest, RESET_NEW_TRANSFER } from '../../reducers/creditTransferReducer'

import { connect } from "react-redux";
import { strings } from '../../../locales/i18n';

const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        transferData: state.creditTransfers.transferData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),
        resetNewTransfer: () => dispatch({type: RESET_NEW_TRANSFER})
    };
};

class ReceivePaymentCameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QRCode: '',
            amount: '',
            checking_qr: false,
            invalid_qr: false,
            insufficient_funds: false,
            prompt: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentDidMount() {
        const { navigation } = this.props;
        this.props.resetNewTransfer();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checking_qr: (nextProps.newTransferStatus.isRequesting),
            invalid_qr: (nextProps.newTransferStatus.error === 'Incorrect Pin'),
            insufficient_funds: (nextProps.newTransferStatus.error ===  'Insufficient funds')
        });
    }

    _handleCheckQrCode(qr_id) {
        this.props.navigation.navigate('EnterPin')
    }

    _handleTransferWithDynamicQRCode(qr_data) {
        this.props.createTransferRequest({
            'qr_data': qr_data,
            'is_sending': this.props.transferData.is_sending,
            'transfer_use': this.props.transferData.is_sending? 'Refund' : this.props.transferData.transfer_use,
            'transfer_amount': this.props.transferData.transfer_amount
        });
    }

    _handleScan = (e) => {
        var data = e.data;
        if (this.state.QRCode !== data && data) {
            this.setState({
                QRCode: data
            });

            if (data.indexOf('-') === -1) {
                // This is a static QR code, for example from an NFC sticker, or it's a not a refund
                this._handleCheckQrCode(data);
            } else {
                this._handleTransferWithDynamicQRCode(data)
            }

        }
    };

    render() {
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 300) / 20);
        const maskColWidth = (width - 300) / 2;

        const prompt = (this.props.transferData.is_sending? strings('ReceivePaymentCameraScreen.RefundPrompt') : strings('ReceivePaymentCameraScreen.PayPrompt'));

        if (this.state.invalid_qr) {
            var error_message = `${strings('ReceivePaymentCameraScreen.InvalidQr')}`
        } else if (this.state.insufficient_funds) {
            error_message = `${strings('ReceivePaymentCameraScreen.InsufficientFunds')}`
        } else if (this.props.newTransferStatus.error) {
            error_message = this.props.newTransferStatus.error.message
        } else {
            error_message = null
        }

        if (this.state.checking_qr) {
            var modal =
                <Modal
                    transparent={true}
                    animationType={'none'}
                    onRequestClose={() => {console.log('close modal')}}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator />
                        </View>
                    </View>
                </Modal>
        } else {
            modal = <View/>;
        }

        return (
            <View style={styles.rootContainer}>
                <TouchableOpacity activeOpacity={1} style={styles.container1} onPress={() => this.setState({prompt: true})}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        autoFocus={RNCamera.Constants.AutoFocus.on}
                        onBarCodeRead={(e) => this._handleScan(e)}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        androidCameraPermissionOptions={{
                            title: `${strings('CameraScreen.permissionDialog')}`,
                            message: `${strings('CameraScreen.permissionDialog')}`,
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                          }}
                        >
                        <View style={styles.maskOutter}>
                            <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
                            <View style={[{ flex: 30 }, styles.maskCenter]}>
                                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                                <View style={[styles.maskInner, {borderColor: (this.props.transferData.is_sending? '#FBADA1' : '#2D9EA0')}]} >
                                    {modal}
                                </View>
                                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                            </View>
                            <View style={[{ flex: maskRowHeight, justifyContent: 'center'}, styles.maskRow, styles.maskFrame]}>
                                {(error_message === null)
                                    ? <Text style={{color: (this.props.transferData.is_sending ? '#FBADA1' : '#2D9EA0'), textAlign: 'center', fontSize: 20, display: (this.state.prompt === true ? 'flex' : 'none')}}>{prompt}</Text>
                                    : <Text style={{color: '#ff0000', textAlign: 'center', fontSize: 20}}>{error_message}</Text> }
                            </View>
                        </View>
                    </RNCamera>
                </TouchableOpacity>
            </View>
        );
        }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReceivePaymentCameraScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    preview: {
        flex: 11,
    },
    promptBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    promptBar: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    // NEW STYLES
    container1: {
        flex: 1,
    },
    cameraView: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        width: 300,
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    maskFrame: {
        backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {
        flexDirection: 'row'
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
});