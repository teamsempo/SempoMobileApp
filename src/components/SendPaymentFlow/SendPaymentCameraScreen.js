'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Alert,
    Vibration,
    Clipboard,
    Linking,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import { newFeedback, RESET_NEW_FEEDBACK_DATA } from '../../reducers/feedbackReducer'
import { updateTransferData, createTransferRequest, RESET_NEW_TRANSFER, RESET_TRANSFER_DATA } from '../../reducers/creditTransferReducer.js'
import { getUserFromPublicSerialNumber, RESET_USER_BY_PUBLIC_SERIAL } from "../../reducers/userReducer";
import {chargeNFCCard, closeNFCRead, resetNFCStatus} from "../../reducers/nfcReducer";
import NfcManager from "react-native-nfc-manager";

import { connect } from "react-redux";
import { strings } from '../../../locales/i18n';
import { trim, parseEthQRCode } from '../../utils';

import CameraModal from './CameraModal.js'
import {tracker} from "../../analytics";
import PaymentModeSwitcher from "../PaymentModeSwitcher";
import ExitToHome from "../ExitToHome"

const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        login: state.login,
        newFeedbackData: state.newFeedbackData,
        transferData: state.creditTransfers.transferData,
        NFCTransceiveStatus: state.NFC.TransceiveStatus,
        tokens: state.tokens.byId,
        transferAccounts: state.transferAccounts.byId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserFromPublicSerialNumber: (query) => dispatch(getUserFromPublicSerialNumber({query})),
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),
        resetNewTransfer: () => {
            console.log("resetting new transfer")
            dispatch({type: RESET_NEW_TRANSFER});
            dispatch({type: RESET_NEW_FEEDBACK_DATA});
            dispatch({type: RESET_TRANSFER_DATA});
            dispatch({type: RESET_USER_BY_PUBLIC_SERIAL});
        },
        newFeedback: (payload) => dispatch(newFeedback(payload)),
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
        chargeNFCCard: (chargeAmount) => dispatch(chargeNFCCard(chargeAmount, null)),
        cancelNFCRead: () => dispatch(closeNFCRead()),
        resetNFCStatus: () => dispatch(resetNFCStatus())
    };
};

class SendPaymentCameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanData: '',
            transfer_account_name: '',
            recipient_transfer_account_id: '',
            transfer_amount: '',
            transfer_use: '',
            transfer_random_key: '',
            modalVisible: false,
            feedbackModalVisible: false,
            offlineModalVisible: false,
            getFeedback: false,
            checkBalanceFeedback: false,
            getAdditionalFeedback: false,
            question: '',
            rating: null,
            additional_information: '',
            handleScan: true,
            public_serial_number: '',
            checkBalance: false,
            vendorScan: false,
            NFC_supported: false,
            NFC_enabled: false,
            detection_was_on_previously: false,
            nfc_id: '',
            amount: '',
            checking_nfc: false,
            invalid_nfc: false,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;

        // Component doesn't mount or unmount through standard nav so we need these event listeners.
        this._unsubscribeFocus = navigation.addListener('focus', () => {
            this.cleanUp();
        });

        this._unsubscribeBlur = navigation.addListener('blur', () => {
            this.cleanUp();
            this.closeNFC();
        });

        this.cleanUp();

        NfcManager.isSupported()
            .then(NFC_supported => {
                this.setState({ NFC_supported });
                if (NFC_supported) {
                    this._startNfc();
                }
            });
        tracker.logEvent("SendPaymentCameraScreen");
    }

    cleanUp() {
        this.props.resetNewTransfer();
        this.props.resetNFCStatus();
    }

    closeNFC() {
        if (this.state.NFC_supported) {
            this._stopDetection();
            this.props.cancelNFCRead();
        }
    }

    componentWillUnmount() {
        this._unsubscribeFocus();
        this._unsubscribeBlur();
        this.cleanUp();
        this.closeNFC();
    }

    componentDidUpdate(prevProps) {
        if (this.props.NFCTransceiveStatus.success !== prevProps.NFCTransceiveStatus.success) {
            this.setState({
                checkBalance: this.props.NFCTransceiveStatus.success
            });

            if (this.props.NFCTransceiveStatus.success) {
                this.setModalVisible(true);
            }
        }

        if (this.state.NFC_enabled &&
            !this.props.NFCTransceiveStatus.isOpen &&
            !this.props.NFCTransceiveStatus.success) {
            this.props.chargeNFCCard(0)
        }
    }

    _startNfc() {
        NfcManager.start({})
            .then(result => {
                console.log('start OK', result);
            })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            });

        NfcManager.isEnabled()
            .then(NFC_enabled => {
                this.setState({ NFC_enabled });
                if (NFC_enabled) {
                    this._startDetection()
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    _startDetection = () => {
        this.setState({detection_was_on_previously: true});
        this.props.chargeNFCCard(0);
    };

    _stopDetection = () => {
        try {
            NfcManager.cancelTechnologyRequest()
                .then(result => {
                    console.log('stop OK', result)
                })
                .catch(error => {
                    console.warn('nfc stop fail', error)
                })
        }
        catch(err) {
            console.log('stop fail', err)
        }
    };

    _handleAdditionalInformation(additional_information) {
        this.setState({additional_information})
    }

    _handleCheckBalanceFeedback() {
        this.setState({checkBalanceFeedback: true})
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _handleCompletePayment() {
        if (this.props.newTransferStatus.feedback === true) {
            this.setState({getFeedback: !this.state.getFeedback});
        } else {
            this._resetModal()
        }
    }

    _handleFeedbackRating(question, rating) {
        if (rating >= 1) {
            tracker.logEvent("Fedback", {question, rating});
            this.props.newFeedback({'question': question,'rating': rating, 'additional_information': ''});
            // this.setModalVisible(!this.state.modalVisible);
            // this._resetModal()
        } else {
            this.setState({question: question, rating: rating, getAdditionalFeedback: true})
        }
    }

    _sendFeedback() {
        let { question, rating } = this.state;
        tracker.logEvent("Fedback", {question, rating});
        this.props.newFeedback({'question': this.state.question, 'rating': this.state.rating, 'additional_information': this.state.additional_information})
    }

    _resetNewTransfer() {
        this.setModalVisible(!this.state.modalVisible);
        this.setState({scanData: '', handleScan: true});
        this.props.resetNewTransfer()
    }

    _resetModal() {
        let transfer = this.props.newTransferStatus;
        let feedback = this.props.newFeedbackData;

        this.setState({
            checkBalance: false,
            public_serial_number: null,
            checkBalanceFeedback: false,
            getAdditionalFeedback: false,
            additional_information: '',
            vendorScan: false,
        }, () => console.log('resetModal STATE', this.state));

        this.props.resetNFCStatus();

        if (transfer.isRequesting === true || feedback.isRequesting === true) {
            // DO NOTHING
            return null
        } else if (this.state.rating !== null && feedback.success !== true) {
            // CAPTURE RATING, THEN EXIT.
            // This triggers when a user completes a transfer and leaves negative feedback, but exits before submitting
            this._sendFeedback();
            this.props.navigation.popToTop();
            this._resetNewTransfer();
        } else if (transfer.success === true || feedback.success === true) {
            // EXIT TO HOME
            this.props.navigation.popToTop();
            this._resetNewTransfer()

        } else {
            // RESET SCANNER
            this._resetNewTransfer()
        }
    }

    _handleScan = (e) => {
        if (this.state.handleScan) {
            try {
                var data = e.data.trim();  // trim removes spaces around a string

                var address = null;
                if (data.length === 42 && data.search(/[ghijklmnopqrstuvwyz]/i) === -1) {
                    address = data
                } else if (data.slice(0, 9) === 'ethereum:') {
                    address = data.slice(9,)
                }

                if (address) {
                    // parse any query params

                    let parsedObject = parseEthQRCode(address);

                    if (Object.keys(parsedObject).length === 1) {
                        // it's just a normal wallet address

                        if (this.props.transferData.public_identifier !== parsedObject.address) {
                            this.props.updateTransferData({public_identifier: parsedObject.address, temp_transfer_mode: 'send'});
                            Vibration.vibrate(150, false);
                        }

                    } else {
                        // it's probably an online qr code (vendor)
                        if (this.state.scanData !== data) {
                            let my_matching_transfer_accounts = this.findMatchingTransferAccounts(parsedObject.s)
                            this.props.updateTransferData({
                                public_identifier: parsedObject.address,  // should be eth address.
                                transfer_amount: parseFloat(parsedObject.amount) * 100,
                                transfer_account_name: parsedObject.n,
                                transfer_use: parsedObject.tu,
                                user_id: parsedObject.u,
                                token_symbol: parsedObject.s,
                                transfer_random_key: parsedObject.r,
                                my_matching_transfer_accounts: my_matching_transfer_accounts
                            });

                            if (my_matching_transfer_accounts.length === 1) {
                                this.props.updateTransferData({
                                    my_transfer_account_id: my_matching_transfer_accounts[0]
                                });
                            }
                            this.setState({scanData: data});
                            this.setModalVisible(!this.state.modalVisible);
                            Vibration.vibrate(150, false);
                        }
                    }

                } else if (data.length === 6 && !isNaN(parseInt(data))) {
                    // it's a public_serial_number - balance check
                    if (this.state.public_serial_number !== data) {
                        this.setState({ public_serial_number: data, checkBalance: true });
                        this.props.getUserFromPublicSerialNumber({
                            public_serial_number: e.data
                        });
                        this.setModalVisible(!this.state.modalVisible);
                        Vibration.vibrate(150, false);
                    }
                } else {
                    if ((data.match(/-/g) || []).length >= 2) {
                        // it's likely a dynamic QR code (vendor is scanning an offline QR Code)
                        this.handleTransferWithDynamicQRCode(data)
                    } else {
                        // it's a general QR code
                        this.handleOtherQRCode(data)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    };

    findMatchingTransferAccounts(tokenSymbol) {
        let matchingTokenId = null;

        for (let index in Object.keys(this.props.tokens)) {
            let tokenId = Object.keys(this.props.tokens)[index]; //Blurggg Javascript
            if (this.props.tokens[tokenId].symbol === tokenSymbol) {
                matchingTokenId = tokenId;
                break
            }
        }


        if (!matchingTokenId) {
            return []
        }

        return Object.keys(this.props.transferAccounts)
            .filter(transferAccountId => this.props.transferAccounts[transferAccountId].token == matchingTokenId);
    }

    handleTransferWithDynamicQRCode(data) {
        this.setState({ public_serial_number: data, vendorScan: true, handleScan: false });
        this.props.createTransferRequest({
            'qr_data': data,
        });
        this.setModalVisible(!this.state.modalVisible);
        Vibration.vibrate(150, false);
    }

    handleOtherQRCode(data) {
        this.setState({handleScan: false});

        function validURL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }

        let buttons = [
            { text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => this.setState({handleScan: true}), style: 'cancel'},
        ];

        if (validURL(data)) {
            buttons.push({ text: strings('SendPaymentCameraScreen.Link'), onPress: () => this.setState({handleScan: true}, () => Linking.openURL(data).catch((err) => console.error('An error occurred', err)))})
        } else {
            buttons.push({ text: strings('SendPaymentCameraScreen.Copy'), onPress: () => this.setState({handleScan: true}, () => Clipboard.setString(data))})
        }

        Alert.alert(
            `${strings('SendPaymentCameraScreen.QR')}`,
            `${data}`,
            buttons,
            {onDismiss: () => this.setState({handleScan: true})},
        );
    }

    render() {
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 270) / 20);
        const maskColWidth = (width - 270) / 2;

        return (
            <View style={styles.rootContainer}>
                <View style={styles.container}>
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
                    >
                        <View style={[{ flex: .13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 999}]} >

                            <ExitToHome navigation={this.props.navigation} color='#FFF'/>

                            <View style={{justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%'}}>
                                <PaymentModeSwitcher camera={true} />
                            </View>

                            <View style={{flex: 1}}/>

                        </View>
                        <View style={styles.maskOutter}>
                            <View style={[{ flex: maskRowHeight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, styles.maskRow, styles.maskFrame]} />
                            <View style={[{ flex: 30 }, styles.maskCenter]}>
                                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                                    <View style={styles.maskInner} >
                                        <CameraModal
                                            _resetModal={() => this._resetModal()}
                                            _sendFeedback={() => this._sendFeedback()}
                                            _handleFeedbackRating={(question, rating) => this._handleFeedbackRating(question, rating)}
                                            _handleCompletePayment={() => this._handleCompletePayment()}
                                            _handleAdditionalInformation={(additional_information) => this._handleAdditionalInformation(additional_information)}
                                            _handleCheckBalanceFeedback={() => this._handleCheckBalanceFeedback()}
                                            modalVisible={this.state.modalVisible}
                                            additional_information={this.state.additional_information}
                                            getFeedback={this.state.getFeedback}
                                            checkBalanceFeedback={this.state.checkBalanceFeedback}
                                            getAdditionalFeedback={this.state.getAdditionalFeedback}
                                            scanData={this.state.scanData}
                                            navigation = {this.props.navigation}
                                            checkBalance={this.state.checkBalance}
                                            vendorScan={this.state.vendorScan}
                                            public_serial_number={this.state.public_serial_number}
                                        />
                                    </View>
                                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                            </View>
                            <View style={[{ flex: maskRowHeight, justifyContent: 'center'}, styles.maskRow, styles.maskFrame]}>
                                <Text style={{color: '#FFF', textAlign: 'center'}}>{strings('SendPaymentCameraScreen.CameraPrompt')}</Text>
                            </View>
                        </View>
                    </RNCamera>
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SendPaymentCameraScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    preview: {
        flex: 11,
    },
    container: {
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
        width: 270,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
    },
    maskFrame: {
        backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {
        flexDirection: 'row',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('window').width * 0.8,
        padding: 30,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});