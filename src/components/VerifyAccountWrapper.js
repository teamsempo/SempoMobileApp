import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
} from 'react-native'
import {connect} from "react-redux";

import TickDrawing from "../img/TickDrawing";
import { strings } from "../../locales/i18n";

import { loadKYCApplicationRequest } from "../reducers/kycApplicationReducer";

const mapStateToProps = (state) => {
    return {
        kycApplication: state.kycApplication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadKYCApplication: (query) => dispatch(loadKYCApplicationRequest({query}))
    };
};


class VerifyAccountWrapper extends React.Component {

    componentDidMount() {
        this.props.loadKYCApplication()
    }

    render() {
        const { kycApplication } = this.props;

        var kyc_status = kycApplication.kycApplicationState['kyc_status'];
        var kycApplicationExists = kyc_status !== null && typeof kyc_status !== "undefined";
        var kyc_incomplete = kyc_status  === 'INCOMPLETE';

        if (kycApplication.loadStatus.isRequesting) {
            return (null)
        } else if (!kycApplicationExists || kyc_incomplete) {
            // No KYC Application created, but KYC allowed for this account. Show Verify User Flow.
            return (
                <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}
                                         onPress={() => this.props.navigation.navigate('VerifyUser', {title: strings('GoBackNav.DefaultTitleText')})}>
                    <View style={styles.wrapper}>

                        <TickDrawing color={kyc_incomplete ? '#ff7a64' : null}/>

                        <View style={{paddingLeft: 10}}>
                            <Text style={styles.text}>{kyc_incomplete ? strings('VerifyAccountWrapper.VerifyTitleIncomplete') : strings('VerifyAccountWrapper.VerifyTitle')}</Text>
                            <Text style={styles.subText}>{kyc_incomplete ? strings('VerifyAccountWrapper.VerifyDescIncomplete') : strings('VerifyAccountWrapper.VerifyDesc')}</Text>
                        </View>

                    </View>
                </TouchableNativeFeedback>
            );
        } else {
            return(null)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyAccountWrapper);

const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
        paddingHorizontal: 40,
        height: 100,
        backgroundColor: '#F6F7F8',
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#D8D9DD',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        color: '#3D454C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
    }
});