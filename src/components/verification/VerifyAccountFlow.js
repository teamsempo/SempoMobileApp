import React from 'react'
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Dimensions,
} from 'react-native'

import VerifyLaunchScreen from "./VerifyLaunchScreen"
import CountrySelection from "./CountrySelectionScreen";
import DocumentType from "./DocumentTypeScreen";
import DocumentCameraScreen from "./DocumentCameraScreen";
import SelfieCameraScreen from "./SelfieCameraScreen";
import OutcomeScreen from "./OutcomeScreen";

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        kycApplication: state.kycApplication,
    };
};

class VerifyAccountFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 6, // number of steps in KYC flow
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render() {
        let { kycApplication } = this.props;

        let flowStep = kycApplication.kycDetails.flowStep;

        var content = null;

        if (flowStep === 1) {
            // launch screen, terms
            content = <VerifyLaunchScreen {...this.props} />;

        } else if (flowStep === 2) {
            // choose country
            content = <CountrySelection />;

        } else if (flowStep === 3) {
            // choose document type
            content = <DocumentType />;

        } else if (flowStep === 4) {
             // camera screen (front and back here)
            content = <DocumentCameraScreen/>;

        } else if (flowStep === 5) {
             // selfie screen
            content = <SelfieCameraScreen />
        } else if (flowStep === 6) {
            // review screen
            content = <OutcomeScreen {...this.props} />
        }

        return(
            <View style={{flex: 1}}>

                <View style={styles.slide}>
                    {content}
                </View>

            </View>
        );
    }
}
export default connect(mapStateToProps, null)(VerifyAccountFlow);

const styles = StyleSheet.create({
    slide: {
        flex: 1, // Take up all screen
        width: Dimensions.get('window').width,
    }
});