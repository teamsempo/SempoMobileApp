'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    StatusBar
} from 'react-native';
import { theme } from "../../Styles";
import TransferCompleteNotifier from "./DisplayBalanceNotifier"
import AsyncButton from "../common/AsyncButton";

import { RESET_NEW_TRANSFER, RESET_TRANSFER_DATA } from '../../reducers/creditTransferReducer.js'
import { RESET_USER_BY_PUBLIC_SERIAL } from "../../reducers/userReducer";
import { chargeNFCCard, closeNFCRead, resetNFCStatus } from "../../reducers/nfcReducer";
import NfcManager from "react-native-nfc-manager";

import { connect } from "react-redux";
import { strings } from '../../../locales/i18n';

import { tracker } from "../../analytics";
import PaymentModeSwitcher from "../PaymentModeSwitcher";
import ExitToHome from "../ExitToHome"
import { resetTransferData } from "../../reducers/creditTransferReducer";

const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        login: state.login,
        transferData: state.creditTransfers.transferData,
        NFCTransceiveStatus: state.NFC.TransceiveStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetTransferData: () => {
            dispatch(resetTransferData());
            dispatch(resetNFCStatus());
            dispatch(closeNFCRead());
        },

        resetNewTransfer: () => {
            console.log("resetting new transfer")
            dispatch({ type: RESET_NEW_TRANSFER });
            dispatch({ type: RESET_TRANSFER_DATA });
            dispatch({ type: RESET_USER_BY_PUBLIC_SERIAL });
        },
        chargeNFCCard: (chargeAmount) => dispatch(chargeNFCCard(chargeAmount, null)),
        cancelNFCRead: () => dispatch(closeNFCRead()),
        resetNFCStatus: () => dispatch(resetNFCStatus())
    };
};

class CheckCardBalanceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanData: '',
            transfer_account_name: '',
            recipient_transfer_account_id: '',
            transfer_amount: '',
            transfer_use: '',
            transfer_random_key: '',
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
            NfcManager.isSupported()
            .then(NFC_supported => {
                this.setState({ NFC_supported });
                if (NFC_supported) {
                    this._startNfc();
                }
            });
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
        tracker.logEvent("CheckCardBalanceScreen");
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

        }
        if (this.state.NFC_enabled &&
            !this.props.NFCTransceiveStatus.isOpen &&
            !NfcManager.isEnabled() &&
            !this.props.NFCTransceiveStatus.success) {
            this.props.chargeNFCCard(0)
        }
    }

    _startNfc() {
        NfcManager.start({})
            .then(result => {
                console.log('start OK4', result);
            })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({ supported: false });
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
        this.setState({ detection_was_on_previously: true });
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
        catch (err) {
            console.log('stop fail', err)
        }
    };

    render() {

        let { login } = this.props;
        if (this.props.NFCTransceiveStatus.success) {
            return (
                <TransferCompleteNotifier
                    navigation={this.props.navigation}
                    balance={this.props.NFCTransceiveStatus.balance}
                    resetTransferData={this.props.resetTransferData}
                />
            )
        }

        if (this.props.NFCTransceiveStatus.error) {
            var error_message = String(this.props.NFCTransceiveStatus.error);

            if (error_message === 'transceive fail') {
                error_message = strings('NFCScreen.NFCTransceiveFail')
            } else if (error_message === 'fail to connect tag') {
                error_message = strings('NFCScreen.NFCTagError')
            }
        } else {
            error_message = `${strings('NFCScreen.ErrorMessage')}`;
        }

        let cardOnly = (
            <Image
                source={require(`../img/CardOutline.png`)}
                resizeMode='contain'
                style={{ width: '70%' }}
            />
        )

        let highCard = (
            <Image
                source={require(`../img/CombinedPhoneCardHigh.png`)}
                resizeMode='contain'
                style={{ width: '70%' }}
            />
        )

        let midCard = (
            <Image
                source={require(`../img/CombinedPhoneCard.png`)}
                resizeMode='contain'
                style={{ width: '70%' }}
            />
        )

        let cardImage = cardOnly;
        let middleStyle;
        let bottomSection = null;

        let textDetails = (
            <View style={{
                width: '100%',
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={styles.inputValueText}>
                    {strings('NFCScreen.BalanceCheckMessage')}
                </Text>
                <View style={styles.promptBar}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: theme.colors.primary
                    }}>
                        {error_message}
                    </Text>
                </View>
            </View>
        );

        if (login.NFCPositions && login.NFCPositions[model]) {
            let positionDetails = login.NFCPositions[model];

            if (positionDetails.cardImage === 'HIGH') {
                cardImage = highCard
            } else if (positionDetails.cardImage === 'MID') {
                cardImage = midCard
            }

            middleStyle = {
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: positionDetails.middleHeight
            };

            topSection = (
                <View style={{
                    ...styles.positionIndicatorBox,
                    height: positionDetails.topHeight,
                    top: -10
                }}>
                    <View
                        style={{
                            ...styles.ArrowContainer,
                            bottom: -20,
                        }}>
                        <Image
                            source={require('../img/Arrow.png')}
                            resizeMode='contain'
                            style={{
                                ...styles.Arrow,
                                transform: [{
                                    rotate: '180deg'
                                }]
                            }}
                        />
                    </View>
                </View>
            );

            bottomSection = (
                <View style={{
                    ...styles.positionIndicatorBox,
                    height: 900
                }}>
                    <View style={{
                        ...styles.ArrowContainer,
                        top: -20,
                    }}>
                        <Image
                            source={require('../img/Arrow.png')}
                            resizeMode='contain'
                            style={{
                                ...styles.Arrow
                            }}
                        />
                    </View>
                    {textDetails}
                </View>
            )

        } else {
            middleStyle = {
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%'
            };

            bottomSection = (
                <View style={{
                    flex: 1
                }}>
                    {textDetails}
                </View>
            )
        }

        if (this.props.NFCTransceiveStatus.isReading || this.props.newTransferStatus.isRequesting) {
            let progressWidth;
            try {
                progressWidth = this.props.NFCTransceiveStatus.nfcStage / 4 * 200
            } catch (e) {
                progressWidth = 200;
            }

            return (
                <View style={styles.rootContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%' }}>
                        <ActivityIndicator />
                        <StatusBar barStyle="default" />

                        <View style={styles.progressBackground}>
                            <View style={{ ...styles.progressForeground, width: progressWidth }}></View>
                        </View>

                    </View>
                </View>
            )
        } else if (this.props.NFCTransceiveStatus.error) {
            return (
                <View style={styles.rootContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%' }}>

                        <Text style={styles.retryText}> {error_message} </Text>
                        <AsyncButton
                            buttonText={strings(('NFCScreen.NFCTryAgain'))}
                            onPress={() => this.props.chargeNFCCard(this.props.transferData.transfer_amount)}
                        />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.rootContainer}>
                    <View style={[{ flex: .35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 999 }]} >
                        <ExitToHome navigation={this.props.navigation} color='#000' />
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%' }}>
                            <PaymentModeSwitcher balance={true} dark={true} />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View
                        style={middleStyle}
                    >
                        {cardImage}
                    </View>
                    {bottomSection}
                </View>
            );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckCardBalanceScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    retryText: {
        color: theme.colors.error,
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
    },
    inputValueText: {
        color: '#3D454C',
        fontSize: 38,
        fontWeight: 'bold',
    }
});