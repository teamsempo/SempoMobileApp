import React from 'react'
import { connect } from "react-redux";
import {
    StyleSheet,
    View
} from 'react-native'

import { Headline, Subheading, List, Divider } from 'react-native-paper'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from '../../Styles';
import {loadKYCApplicationRequest, updateKYCDetails } from "../../reducers/kycApplicationReducer";
import GoBackHeader from "./GoBackHeader";
import { CenterLoadingSpinner } from "../common/CenterLoadingSpinner.js"
import { addSpaceToString } from "../../utils";
import {strings} from "../../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        kycApplication: state.kycApplication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateKYCDetails: (payload) => dispatch(updateKYCDetails(payload)),
        loadKYCApplication: (query) => dispatch(loadKYCApplicationRequest({query}))
    };
};

class DocumentTypeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.props.loadKYCApplication({trulioo_documents: true, country: this.props.kycApplication.kycDetails.country})
    }

    getIconName(document) {
        var possibleDocuments = ["Passport", "DrivingLicence"];
        var possibleIcons = {"Passport": "passport", "DrivingLicence":"car"};

        if (possibleDocuments.indexOf(document) !== -1) {
            return possibleIcons[document]
        } else {
            return 'account-card-details'
        }
    }

    _onBack() {
        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep - 1, documentType: null})
    }

    onNext(type) {
        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep + 1, documentType: type})
    }

    render() {
        const { kycApplication } = this.props;

        let documents = kycApplication.kycApplicationState.trulioo_documents;

        var documentTypes = [];
        if (typeof documents !== "undefined") {
            if (typeof documents[kycApplication.kycDetails.country] !== 'undefined'){
                documentTypes = documents[kycApplication.kycDetails.country];
            }
        }

        return (
            <View style={Styles.rootContainer}>

                <View style={{flex: 1}}>
                    <GoBackHeader goBack={() => this._onBack()}/>
                </View>

                {kycApplication.loadStatus.isRequesting ? <CenterLoadingSpinner /> : null}

                {kycApplication.loadStatus.isRequesting ? null : <View style={{flex: 10}}>
                    <View style={styles.TopContainer}>
                        <Headline>{strings('DocumentTypeScreen.Title')}</Headline>
                        <Subheading>{strings('DocumentTypeScreen.Subtitle')}</Subheading>
                    </View>

                    <Divider/>

                    <List.Section>
                        {documentTypes.map((item, index) => {
                            return (
                                <List.Item
                                    key={index}
                                    title={addSpaceToString(item)}
                                    left={() => <Icon style={styles.Icon} name={this.getIconName(item)} size={30} color="#000"/>}
                                    onPress={() => this.onNext(item)}
                                />
                            )
                        })}
                    </List.Section>
                </View>}

            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentTypeScreen);


const styles = StyleSheet.create({
    TopContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    Icon: {
        margin: 8
    },
    CountryWrapper: {
        paddingHorizontal: 20,
        top: 120,
        position: 'absolute',
        zIndex: 99,
    }
});