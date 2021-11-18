import React from 'react'
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    BackHandler
} from 'react-native'

import { Headline, Subheading, Caption, List, Divider,Snackbar, ActivityIndicator } from 'react-native-paper'


import Styles from '../../Styles';
import CountryPickerWrapper from "../CountryPickerWrapper";
import {updateKYCDetails, loadKYCApplicationRequest} from "../../reducers/kycApplicationReducer";
import Button from "../Button";
import GoBackHeader from "./GoBackHeader";
import { CenterLoadingSpinner } from "../common/CenterLoadingSpinner.js"
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
        loadKYCApplication: (query) => dispatch(loadKYCApplicationRequest({query}))
    };
};

class CountrySelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cca2: 'AU',
            name: 'Press to choose',
            visible: false,
        }
    }

    componentDidMount() {
        this.props.loadKYCApplication({trulioo_countries: true});
    }

    _onCountryChange(value) {
        console.log('value',value)
        this.setState({ cca2: value.cca2, name: value.name })
    }

    _onBack() {
        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep -1})
    };

    _onNext() {
        if (this.state.name === 'Press to choose') {
            this.setState({visible: true});
            return
        }
        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep + 1, country: this.state.cca2})
    }

    render() {
        const { kycApplication } = this.props;

        var countries = kycApplication.kycApplicationState.trulioo_countries;
        if (typeof countries === "undefined") {
            countries = []
        }

        return (
            <View style={Styles.rootContainer}>

                <View style={{flex: 1}}>
                    <GoBackHeader goBack={() => this._onBack()}/>
                </View>

                {kycApplication.loadStatus.isRequesting ? <CenterLoadingSpinner /> : null}

                {kycApplication.loadStatus.isRequesting ? null : <View style={{flex: 10}}>

                    <View style={styles.TopContainer}>
                        <Headline>{strings('CountrySelectionScreen.Title')}</Headline>
                        <Subheading>{strings('CountrySelectionScreen.Subtitle')}</Subheading>
                    </View>

                    <Divider/>


                    <View style={styles.CountryWrapper}>
                        <CountryPickerWrapper
                            countryCodes={countries}
                            countryCode={this.state.cca2}
                            name={this.state.name}
                            withCallingCode={false}
                            withCountryNameButton={true}
                            withCallingCodeButton={false}
                            onSelect={value => this._onCountryChange(value)}
                        />
                    </View>

                    <View style={styles.BottomButton}>
                        <Button onPress={() => this._onNext()} buttonText={strings('Common.Next')}/>
                    </View>

                </View>}

                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                    action={{
                        label: strings('Common.OK'),
                        onPress: () => {
                            this.setState({visible: false})
                        },
                    }}
                >
                    {strings('CountrySelectionScreen.Prompt')}
                </Snackbar>

            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CountrySelectionScreen);

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
    },
    BottomButton: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        padding: 20,
        bottom: 0
    }
});