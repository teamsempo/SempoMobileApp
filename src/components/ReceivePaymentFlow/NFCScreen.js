'use strict';
import React, { Component } from 'react';
import { useWindowDimensions } from 'react-native';

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';
import DeviceInfo from 'react-native-device-info';
import { theme} from "../../Styles";


import NfcManager from 'react-native-nfc-manager';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    StatusBar,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';

import { cacheTransfer } from '../../reducers/transferCacheReducer'

import {closeNFCRead, chargeNFCCard, resetNFCStatus} from '../../reducers/nfcReducer'

import TransferAmount from './TransferAmountDisplay'
import AsyncButton from "../common/AsyncButton";
import TransferCompleteNotifier from "./TransferCompleteNotifier"
import { resetTransferData } from "../../reducers/creditTransferReducer";


const mapStateToProps = (state) => {
    return {
        login: state.login,
        newTransferStatus: state.creditTransfers.createStatus,
        transferData: state.creditTransfers.transferData,
        isConnected: state.networkStatus.isConnected,
        NFCTransceiveStatus: state.NFC.TransceiveStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        cacheTransfer: (body) => dispatch(cacheTransfer({body})),
        chargeNFCCard: (chargeAmount, symbol) => dispatch(chargeNFCCard(chargeAmount, symbol)),
        cancelNFCRead: () => dispatch(closeNFCRead()),
        resetTransferData: () => {
            dispatch(resetTransferData());
            dispatch(resetNFCStatus());
        },
    };
};

class NFCScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                } else {
                    Alert.alert(
                        strings('NFCScreen.NFCError'),
                        strings('NFCScreen.NFCErrorMessage'),
                        [
                            {text: 'OK', onPress: () => this.props.navigation.navigate('PaymentOption')},
                        ],
                        {cancelable: false}
                    );
                }
            })
    }

    componentWillUnmount() {
        if (this.state.NFC_supported) {
            this._stopDetection();
            this.props.cancelNFCRead();
        }
    }


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

        this.props.chargeNFCCard(
            this.props.transferData.transfer_amount,
            this.props.transferData.token_symbol);
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
        let { login } = this.props;
        let model = DeviceInfo.getModel()
        console.log('model is', model)

        if (this.props.NFCTransceiveStatus.success) {
            return(
                <TransferCompleteNotifier
                    navigation={this.props.navigation}
                    balance={this.props.NFCTransceiveStatus.balance}
                    user={null}
                    transferData={null}
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
                style={{width: '70%'}}
            />
        )

        let highCard = (
            <Image
                source={require(`../img/CombinedPhoneCardHigh.png`)}
                resizeMode='contain'
                style={{width: '70%'}}
            />
        )

        let midCard = (
            <Image
                source={require(`../img/CombinedPhoneCard.png`)}
                resizeMode='contain'
                style={{width: '70%'}}
            />
        )

        let topSection = null;
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

                <TransferAmount/>
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
                    { textDetails }
                </View>
            )

        } else {
            middleStyle = {
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            };

            bottomSection = (
                <View style={{
                    flex: 1
                }}>
                    { textDetails }
                </View>
            )


        }

        if (this.props.NFCTransceiveStatus.isReading || this.props.newTransferStatus.isRequesting) {
            let progressWidth;
            try {
                progressWidth = this.props.NFCTransceiveStatus.nfcStage/4 * 200
            } catch (e) {
                progressWidth = 200;
            }

            return (
                <View style={styles.rootContainer}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator />
                        <StatusBar barStyle="default" />

                        <View style={styles.progressBackground}>
                            <View style={{...styles.progressForeground, width: progressWidth}}></View>
                        </View>

                    </View>
                </View>
            )
        } else if (this.props.NFCTransceiveStatus.error) {
            return (
                <View style={styles.rootContainer}>
                    <View style={styles.activityIndicatorWrapper}>
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

                    {topSection}


                    <View
                        style={middleStyle}
                    >
                        { cardImage }
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        </View>

                    </View>

                    {bottomSection}

                </View>
            );
        }
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(NFCScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    activityIndicatorWrapper: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },
    positionIndicatorBox: {
        backgroundColor: theme.colors.background,
        width: Dimensions.get('window').width + 10,
        left: -5,
        borderWidth:2,
        borderColor: theme.colors.primary,
        // borderLeftColor: theme.colors.background,
        // borderRightColor: theme.colors.background
        // borderTopColor: theme.colors.background,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    ArrowContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center'
    },
    Arrow: {
        width: 50,
        height: 60,
    },
    promptBar: {
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
    },
    retryText: {
        color: theme.colors.error,
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
    },

    progressBackground: {
        margin: 40,
        backgroundColor: '#c0dede',
        height: 20,
        width: 200,
        borderRadius: 20,

    },

    progressForeground: {
        backgroundColor: '#42b1b1',
        height: 20,
        borderRadius: 20
    }
});