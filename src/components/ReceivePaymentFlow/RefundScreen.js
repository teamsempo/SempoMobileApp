import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableNativeFeedback,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Image
} from 'react-native';

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';

import QrCodeGenerator from '../SendPaymentFlow/QrCodeGenerator'
import { RESET_NEW_TRANSFER } from "../../reducers/creditTransferReducer";

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetNewTransfer: () => {dispatch({type: RESET_NEW_TRANSFER})},
    };
};

class RefundScreen extends Component {

    componentWillUnmount() {
    }

    render() {
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 270) / 20);
        const maskColWidth = (width - 270) / 2;

        var data = <QrCodeGenerator duration={5000} qrCodeSize={265}/>;
        var prompt = strings('HomeScreen.PromptText');

        return (
            <View style={styles.rootContainer}>
                <View style={styles.maskOutter}>
                    <View style={[{ flex: 30 }, styles.maskCenter]}>
                        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                        <View style={styles.maskInner} >
                            {data}
                        </View>
                        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                    </View>
                    <View style={[{ flex: maskRowHeight, justifyContent: 'center'}, styles.maskRow, styles.maskFrame]}>
                        <Text style={{color: '#000', textAlign: 'center'}}>{prompt}</Text>
                    </View>
                </View>
            </View>
        )

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RefundScreen);

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
        width: 270,
        height: 270,
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