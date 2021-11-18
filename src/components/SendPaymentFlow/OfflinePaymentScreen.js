import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';

import QrCodeGenerator from './QrCodeGenerator'
import SendtoPublicIdentifier from './SendtoPublicIdentifier'
import { RESET_NEW_TRANSFER, updateTransferData } from "../../reducers/creditTransferReducer";

import TransferAmount from '../ReceivePaymentFlow/TransferAmountDisplay'

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
        resetNewTransfer: () => {dispatch({type: RESET_NEW_TRANSFER})},
    };
};

class OfflinePaymentScreen extends Component {

    componentWillUnmount() {
        this.props.resetNewTransfer();
    }

    render() {
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 270) / 20);
        const maskColWidth = (width - 270) / 2;

        var data = <QrCodeGenerator duration={5000} qrCodeSize={265}/>;

        return (
            <View style={styles.rootContainer}>
                <View style={styles.maskOutter}>
                    <View style={{paddingBottom: 20, paddingTop: 20}}>
                        <TransferAmount/>
                    </View>

                    <View style={[{ flex: 30 }, styles.maskCenter]}>
                        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                        <View style={styles.maskInner} >
                            {data}
                        </View>
                        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                    </View>

                    <Text style={{
                        color: '#4A4A4A',
                        textAlign: 'center',
                        paddingBottom: 20,
                        paddingTop: 20,
                        fontSize: 22,
                    }}>
                        {strings('HomeScreen.PromptText')}
                    </Text>
                </View>

            </View>
        )

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OfflinePaymentScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
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
        margin: 10,
        width: 280,
        height: 280,
        backgroundColor: 'transparent',
    },
    maskFrame: {
        backgroundColor: 'transparent',
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
        backgroundColor: '#00000040',
    },
});