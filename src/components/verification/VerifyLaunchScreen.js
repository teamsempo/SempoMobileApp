import React from 'react'
import { connect } from 'react-redux'
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    ScrollView,
    Linking
} from 'react-native'

import { Headline, Subheading, Caption, List, Divider, Banner, Checkbox } from 'react-native-paper'
import Intercom from 'react-native-intercom';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from '../../Styles';
import Button from "../Button";
import { updateKYCDetails } from "../../reducers/kycApplicationReducer";
import GoBackHeader from "./GoBackHeader";
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
    };
};

class VerifyLaunchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasStartedFlow: false,
            errorBanner: false,
            promptBanner: false,
            isBusiness: false,
        }
    }

    componentWillMount() {
        let kyc_state = this.props.kycApplication.kycApplicationState;
        if (kyc_state !== null) {
            if (kyc_state.kyc_actions !== null && typeof kyc_state.kyc_actions !== "undefined") {
                this.setState({errorBanner: true});
                return
            }
            if (Object.keys(kyc_state).length > 0) {
                // else, set a prompt banner on second attempts
                this.setState({promptBanner: true})
            }
        }
    }

    _onNext() {
        let kyc_type = this.state.isBusiness ? 'BUSINESS' : 'INDIVIDUAL';
        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep + 1, account_type: kyc_type})
    }

    _getErrorMessage() {
        let kyc_actions = this.props.kycApplication.kycApplicationState.kyc_actions;
        if (kyc_actions !== null && typeof kyc_actions !== "undefined") {
            return strings('VerifyLaunchScreen.ErrorBanner') + '\n \n' + strings(`VerifyFailureOptions.${kyc_actions[0]}`)
        }
        return strings('VerifyLaunchScreen.ErrorBanner')
    }

    render() {
        const { height, width } = Dimensions.get('window');

        return (
            <View style={Styles.rootContainer}>

                <View style={{flex: 1}}>
                    <GoBackHeader {...this.props} />
                </View>

                <View style={{flex: 10}}>

                    <Banner
                        visible={this.state.errorBanner || this.state.promptBanner}
                        actions={[
                            {
                                label: this.state.errorBanner ? strings('Common.ContactSupport') : strings('VerifyLaunchScreen.LearnMore'),
                                onPress: () => this.state.errorBanner ? Intercom.displayMessenger() : Linking.openURL('https://help.withsempo.com/en/articles/3211219-what-is-a-kyc-check-and-who-needs-to-do-it'),
                            },
                            {
                                label: strings('Common.OK'),
                                onPress: () => this.setState({ errorBanner: false, promptBanner: false }),
                            },
                        ]}
                        image={({ size }) =>
                            <Icon style={styles.Icon} name={this.state.errorBanner ? 'alert-outline' : 'account-question'} size={size} color={this.state.errorBanner ? '#ff7a64' : '#42b1b1'}/>
                        }
                    >
                        {this.state.errorBanner ? this._getErrorMessage() : strings('VerifyLaunchScreen.PromptBanner')}
                    </Banner>

                    <ScrollView>

                        <View style={{alignItems: 'center'}}>

                            <Image
                                source={require('../img/identity_documents.png')}
                                style={{width: width / 1.5, height: height / 3}}
                                resizeMode='contain'
                            />

                        </View>

                        <View style={styles.TopContainer}>
                            <Headline>{strings('VerifyLaunchScreen.Title')}</Headline>
                            <Subheading>{strings('VerifyLaunchScreen.Subtitle')}</Subheading>
                            <Caption>{strings('VerifyLaunchScreen.LegalTerms')}<Caption style={{textDecorationLine: "underline"}} onPress={() => this.props.navigation.navigate('Terms', { title: strings('GoBackNav.DefaultTitleText')})}>{strings('VerifyLaunchScreen.Terms')}</Caption></Caption>
                        </View>

                        <Divider/>

                        <View style={styles.List}>
                            <List.Section>
                                <List.Subheader>{strings('VerifyLaunchScreen.HowHeading')}</List.Subheader>
                                <List.Item
                                    title={strings('VerifyLaunchScreen.StepOne')}
                                    left={props => <Icon style={styles.Icon} name={'numeric-1'} size={30} color="#000"/>}
                                />
                                <List.Item
                                    title={strings('VerifyLaunchScreen.StepTwo')}
                                    left={props => <Icon style={styles.Icon} name={'numeric-2'} size={30} color="#000"/>}
                                />
                                <Divider/>
                                <List.Item
                                    title={strings('VerifyLaunchScreen.BusinessQuestion')}
                                    left={props => <View style={{padding: 6}}><Checkbox
                                        status={this.state.isBusiness ? 'checked' : 'unchecked'}
                                        onPress={() => { this.setState({ isBusiness: !this.state.isBusiness }); }}
                                    /></View>}
                                />
                            </List.Section>
                        </View>

                    </ScrollView>

                    <View style={styles.BottomButton}>
                        <Button onPress={() => this._onNext()} buttonText={strings('Common.Start')}/>
                    </View>
                </View>

            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyLaunchScreen);

const styles = StyleSheet.create({
    CloseContainer: {
        position: 'absolute',
        left: 0,
        zIndex: 999
    },
    TopContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    Icon: {
        margin: 8
    },
    List: {
        paddingBottom: 100
    },
    BottomButton: {
        // backgroundColor: '#FFF',
        flex: 1,
        position: 'absolute',
        width: '100%',
        padding: 20,
        bottom: 0
    }
});