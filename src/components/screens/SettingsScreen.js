import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Linking,
    ScrollView,
    TouchableNativeFeedback,
    Switch
} from 'react-native'
import { connect } from "react-redux";
import Intercom from 'react-native-intercom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { strings } from '../../../locales/i18n';
import { capitalize, stringToColour } from "../../utils";

import { logout, updateRequirePIN } from "../../reducers/authReducer";
import { loadUser } from "../../reducers/userReducer";
import { loadKYCApplicationRequest } from "../../reducers/kycApplicationReducer";

import CurrencyAmount from '../CurrencyAmount.js';
import SurveyFeedbackModal from '../feedback/SurveyFeedbackModal.js';
import LanguageModal from '../LanguageModal.js';

import { Avatar, Badge, Snackbar } from 'react-native-paper';
import OnboardingModal from "../onboarding/OnboardingModal.js";
import Styles from '../../Styles.js';

const mapStateToProps = (state) => {
    return {
        version: state.version,
        login: state.login,
        locale: state.locale,
        transferAccounts: state.transferAccounts,
        users: state.users,
        mergedTransferAccountUserObject: {...state.transferAccounts.byId[Object.keys(state.transferAccounts.byId)[0]], ...state.users.byId[Object.keys(state.users.byId)[0]]},
        requirePIN: state.openApp.requirePIN,
        kycApplication: state.kycApplication.kycApplicationState,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
        resetState: () => dispatch({type: 'RESET'}),
        loadUser: (payload) => dispatch(loadUser(payload)),
        loadKYCApplicationRequest: (payload) => dispatch(loadKYCApplicationRequest(payload)),
        updateRequirePIN: (requirePIN) => dispatch(updateRequirePIN(requirePIN))
    };
};

class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onboardingModalVisible: false,
            modalVisible: false,
            isLanguageModalVisible: false,
            snackBarVisible: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentDidMount() {
        Linking.addEventListener('url');
        if (!this.props.users.loadStatus.success) {
            this.props.loadUser();
        }
        this.props.loadKYCApplicationRequest()
    }

    componentWillUnmount() {
        Linking.removeEventListener('url');
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    toggleOnboardingModal(visible) {
        this.setState({onboardingModalVisible: visible});
    }

    toggleModal(visible) {
        this.setState({isLanguageModalVisible: visible});
    }

    _renderItem(item, i, items) {
        return (
            <TouchableNativeFeedback key={i} accessibilityLabel={item.text} background={TouchableNativeFeedback.SelectableBackground()} onPress={item.action}>
                <View style={Styles.optionSection}>
                    <View style={(i === items.length - 1) ? Styles.item : Styles.itemBorder}>
                        <Text>{item.text}</Text>
                        <Icon name={this.props.locale.isRTL ? 'menu-left' : 'menu-right'} size={20} color="#909AA1"/>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    _renderSwitch(item, i, items) {
        return (
            <View key={i} accessibilityLabel={item.text}>
                <View style={Styles.optionSection}>
                    <View style={(i === items.length - 1) ? Styles.item : Styles.itemBorder}>
                        <Text>{item.text}</Text>
                        <Switch
                            trackColor='#909AA1'
                            onValueChange = {item.action}
                            value = {item.value}/>
                    </View>
                </View>
            </View>
        )
    }

    _logout() {
        this.props.logout();
        this.props.resetState()
    }

    render() {
        const transferAccount = this.props.transferAccounts.byId[Object.keys(this.props.transferAccounts.byId)[0]];
        const user = this.props.users.byId[Object.keys(this.props.users.byId)[0]];

        // transfer account id overwrites user id
        const vendor_info = {...transferAccount, ...user};
        var user_initials = null;
        if (typeof vendor_info.first_name !== "undefined" && typeof vendor_info.last_name !== "undefined") {
            if (vendor_info.first_name !== null && vendor_info.last_name !== null) {
                user_initials = (vendor_info.first_name.charAt(0) + vendor_info.last_name.charAt(0)).toLocaleUpperCase();
            } else {
                // replace vendor info first name to phone number if undefined
                vendor_info.first_name = vendor_info.phone;
                vendor_info.last_name = '';
            }
        }

        // KYC state
        var kyc_visible = false;
        var kyc_status = null;
        var kyc_color = null;
        if (typeof this.props.kycApplication.kyc_status !== 'undefined') {
            kyc_visible = true;
            kyc_status = this.props.kycApplication.kyc_status;
            kyc_color = kyc_status === 'INCOMPLETE' ? '#ff7a64' : kyc_status === 'PENDING' ? '#a2a2ad' : kyc_status === 'VERIFIED' ? '#42b1b1' : '#ff7a64';
        }

        const securityItems = [
            {text: strings('SettingsScreen.SecurityText'), action: () => this.props.updateRequirePIN(!this.props.requirePIN), value: this.props.requirePIN}
        ];

        const optionItems = [
            {text: strings('LocaleAlert.LanguageTitle'), action: () => this.toggleModal(true)},
        ];

        const supportItems = [
            {text: strings('SettingsScreen.MessageUs'), action: () => Intercom.displayMessenger()},
            {text: strings('SettingsScreen.FAQS'), action: () => this.props.navigation.navigate('FAQs', { title: strings('GoBackNav.DefaultTitleText')})},
        ];

        const otherItems = [
            {text: strings('SettingsScreen.HowItWorks'), action: () => this.toggleOnboardingModal(true)},
            {text: strings('LoginScreen.Legal'), action: () => this.props.navigation.navigate('Terms', { title: strings('LoginScreen.Legal')} )},
            {text: 'Sync', action: () =>  this.props.navigation.navigate('CardScanScreen')},
            {text: strings('AuthButton.LogOutText'), action: () => this._logout()}
        ];

        if (this.props.login.defaultFeedbackQuestions >= 1) {
            otherItems.push({text: 'Feedback', action: () => this.setModalVisible(true)})
        }

        if (this.props.login.isVendor || this.props.login.isSupervendor) {
            optionItems.push({text: strings("ExportScreen.Title"), action: () => this.props.navigation.navigate('Export', { title: strings("ExportScreen.Title")} )})
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.mainContainer}>

                        <Text style={Styles.sectionTitle}>
                            {strings('SettingsScreen.DetailsTitle').toUpperCase()}
                        </Text>

                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.setState({snackBarVisible: true})}>
                            <View style={styles.profileSection}>
                                <View>
                                    <Avatar.Text style={{backgroundColor: stringToColour(user_initials)}} size={62} label={user_initials} />
                                    <Badge visible={kyc_visible} style={{position: 'absolute', left: 0, right: 0, bottom: -5, backgroundColor: kyc_color}}>{kyc_status}</Badge>
                                </View>
                                <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 20, justifyContent: 'space-around'}}>
                                    <Text style={[Styles.sectionTitle, {fontStyle: 'italic', marginTop: 0, marginBottom: 0}]}>{strings('SettingsScreen.NameText', {name: capitalize(vendor_info.first_name) + ' ' + capitalize(vendor_info.last_name)})}</Text>
                                    <Text>{strings('SettingsScreen.BalanceText')} <CurrencyAmount amount={vendor_info.balance / 100}/></Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>

                        <Text style={Styles.sectionTitle}>
                            {strings('SettingsScreen.SecurityTitle').toUpperCase()}
                        </Text>

                        {securityItems.map((item, i) => this._renderSwitch(item, i, securityItems))}

                        <Text style={Styles.sectionTitle}>
                            {strings('SettingsScreen.OptionsTitle').toUpperCase()}
                        </Text>

                        {optionItems.map((item, i) => this._renderItem(item, i, optionItems))}

                        <Text style={Styles.sectionTitle}>
                            {strings('SettingsScreen.SupportTitle').toUpperCase()}
                        </Text>

                        {supportItems.map((item, i) => this._renderItem(item, i, supportItems))}

                        <Text style={Styles.sectionTitle}>
                            {strings('SettingsScreen.OtherTitle').toUpperCase()}
                        </Text>

                        {otherItems.map((item, i) => this._renderItem(item, i, otherItems))}

                        <Text style={styles.versionNumber}>{strings('SettingsScreen.Version', {version: this.props.version.versionDetails.version})}</Text>

                        <LanguageModal visible={this.state.isLanguageModalVisible} close={() => this.toggleModal(false)} />

                        <OnboardingModal
                            _resetModal={() => this.toggleOnboardingModal(false)}
                            modalVisible={this.state.onboardingModalVisible}
                        />

                    </View>
                </ScrollView>

                <Snackbar
                    duration={Snackbar.DURATION_SHORT}
                    visible={this.state.snackBarVisible}
                    onDismiss={() => this.setState({ snackBarVisible: false })}
                >
                    {strings('Common.Soon', {feature: 'User details'})}
                </Snackbar>

                <SurveyFeedbackModal
                    _resetModal={() => this.setModalVisible(!this.state.modalVisible)}
                    modalVisible={this.state.modalVisible}
                />

            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
    versionNumber: {
      paddingVertical: 20,
    },
    profileSection: {
        backgroundColor: '#FFF',
        marginLeft: -20,
        marginRight: -20,
        paddingLeft: 20,
        paddingRight: 20,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F7F8',
    },
    mainContainer: {
        flex: 8,
        marginLeft: 20,
        marginRight: 20,
    },
    text: {
        fontSize: 15,
        textAlign: 'left',
        marginTop: 10,
    },
});