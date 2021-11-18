import React from 'react'
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    Image,
    Dimensions,
    ScrollView,
    Linking,
    BackHandler
} from 'react-native'

import { Headline, Subheading, Divider } from 'react-native-paper'


import Styles from '../../Styles';
import {createKYCApplication, updateKYCDetails} from "../../reducers/kycApplicationReducer";
import Button from "../Button";
import {CenterLoadingSpinner} from "../common/CenterLoadingSpinner";
import {strings} from "../../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        kycApplication: state.kycApplication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateKYCDetails: (payload) => dispatch(updateKYCDetails(payload)),
        createKYCApplication: (body) => dispatch(createKYCApplication({body})),
    };
};

class OutcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onNext);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onNext);
    }

    _onNext() {
        // reset local state and flow.
        this.props.updateKYCDetails({
            flowStep: 1,
            country: null,
            documentType: null,
            documentFrontBase64: null, // image
            documentBackBase64: null,
            selfieBase64: null, // image
        });
        this.props.navigation.goBack();
    }

    render() {
        let { kycApplication } = this.props;
        let businessFormLink = 'https://drive.google.com/file/d/1SF-mZEa4nxH3yxR0ecuuNLtdzH11f5Al/view?usp=sharing';
        let isBusiness = kycApplication.kycApplicationState.type === 'BUSINESS';
        let isBusinessPrompt = isBusiness ? strings('OutcomeScreen.Business') : strings('OutcomeScreen.Subtitle');
        const { height, width } = Dimensions.get('window');

        let isRequesting = kycApplication.createStatus.isRequesting || kycApplication.editStatus.isRequesting;
        let success = kycApplication.createStatus.success || kycApplication.editStatus.success;
        var error = null;

        if (!isRequesting && !success) {
            // some error has occurred
            if (kycApplication.createStatus.error !== null) {
                error = kycApplication.createStatus.error.message
            } else {
                error = kycApplication.editStatus.error.message
            }
        }

        return (
            <View style={Styles.rootContainer}>

                {isRequesting ? <CenterLoadingSpinner loadingText={strings('SendPaymentCameraScreen.Sending')}/>: null}

                {isRequesting ? null : <View style={{flex: 10}}>

                    <View style={{alignItems: 'center'}}>

                        <Image
                            source={require('../img/identity_documents.png')}
                            style={{width: width / 1.5, height: height / 3}}
                            resizeMode='contain'
                        />

                    </View>

                    <View style={styles.TopContainer}>
                        <Headline>{strings('OutcomeScreen.Title', {outcome: success ? strings('OutcomeScreen.Pending') : strings('OutcomeScreen.Error')})}</Headline>
                        <Subheading>{success
                            ? isBusinessPrompt
                            : error}</Subheading>
                        {isBusiness ? <View style={{padding: 5}}>
                            <Button outline={true} onPress={() => Linking.openURL(businessFormLink)} buttonText={strings('OutcomeScreen.Form')}/>
                        </View> : null}
                    </View>

                    <Divider />

                    <View style={styles.BottomButton}>
                        <Button onPress={() => this._onNext()} buttonText={strings('Common.OK')}/>
                    </View>

                </View>}

            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OutcomeScreen);

const styles = StyleSheet.create({
    TopContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    BottomButton: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        padding: 20,
        bottom: 0
    }
});