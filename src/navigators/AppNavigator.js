import React from 'react';
import { View } from "react-native";

import {connect} from "react-redux";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// AUTH STACK
import CardScanScreen from '../components/screens/CardScanScreen';
import PhoneNumberScreen from '../components/auth/PhoneNumberScreen';
import OTPScreen from "../components/auth/OTPScreen"
import SetPinScreen from "../components/auth/SetPinScreen"
import LoginPinScreen from "../components/auth/LoginPinScreen"
import LockScreen from "../components/auth/LockScreen"

import TermsScreen from "../components/screens/TermsScreen";

// RECEIVE PAYMENT FLOW
import PaymentsUseScreen from '../components/ReceivePaymentFlow/PaymentsUseScreen'
import PaymentsOptionScreen from "../components/ReceivePaymentFlow/PaymentsOptionScreen";
import CameraScreen from "../components/ReceivePaymentFlow/ReceivePaymentCameraScreen";
import NFCScreen from "../components/ReceivePaymentFlow/NFCScreen";
import ManualPayment from "../components/ReceivePaymentFlow/ManualPayment";
import EnterPin from "../components/ReceivePaymentFlow/EnterPin";
import TransferCompleteScreen from "../components/ReceivePaymentFlow/TransferCompleteScreen";

// SEND PAYMENT FLOW
import PaymentLogicScreen from "../components/SendPaymentFlow/PaymentLogicScreen.js"
import OfflinePaymentScreen from "../components/SendPaymentFlow/OfflinePaymentScreen.js"

// MAIN APP
import HomeScreen from "../components/screens/HomeScreen.js";
import SettingsScreen from "../components/screens/SettingsScreen.js";
import TransferReportingScreen from "../components/reportingFlow/TransferReportingScreen";
import ExportScreen from '../components/reportingFlow/ExportScreen';
import PaymentSwitch from "../components/PaymentSwitch";
import FAQScreen from "../components/screens/FAQScreen.js";

// BOTTOM BAR ICONS
import WalletIcon from "../img/WalletIcon";
import PayIcon from "../img/PayIcon";

// KYC APPLICATION
import VerifyAccountFlow from "../components/verification/VerifyAccountFlow";
import {openAppRequest, backgroundApp} from "../reducers/authReducer";

import {strings} from "../../locales/i18n";

const PaymentStack = createStackNavigator();

export function PaymentScreenStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="Payment">
            <PaymentStack.Screen name="Payment" component={PaymentSwitch} />
            <PaymentStack.Screen name="OfflinePayment" component={OfflinePaymentScreen} />
            <PaymentStack.Screen name="PaymentLogic" component={PaymentLogicScreen} />
            <PaymentStack.Screen name="PaymentUse" component={PaymentsUseScreen} />
            <PaymentStack.Screen name="PaymentOption" component={PaymentsOptionScreen} />
            <PaymentStack.Screen name="ManualPayment" component={ManualPayment} />
            <PaymentStack.Screen name="Camera" component={CameraScreen} />
            <PaymentStack.Screen name="NFC" component={NFCScreen} />
            <PaymentStack.Screen name="EnterPin" component={EnterPin} />
            <PaymentStack.Screen name="TransferCompleteScreen" component={TransferCompleteScreen} />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export function HomeTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return <View accessibilityLabel={strings('HomeScreen.Wallet')} accessibilityHint={strings('HomeScreen.LoadTransfers')}><WalletIcon type={focused ? 'solid' : 'outline'} /></View>
                    } else if (route.name === 'SendPaymentTabScreen') {
                        return <View accessibilityLabel={strings('SettingsScreen.Title')} accessibilityHint={strings('HomeScreen.PayHint')}><PayIcon /></View>
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="SendPaymentTabScreen"
                component={PaymentScreenStack}
                options={{
                    tabBarVisible: false,
                }}
            />
        </Tab.Navigator>
    );
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        openApp: state.openApp,
        verifyPin: state.verifyPin,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        openAppRequest: () => dispatch(openAppRequest()),
        backgroundApp: (time) => dispatch(backgroundApp(time))
    }
};

const Stack = createStackNavigator();

function UnconnectedAppNavigator({ login, openApp, verifyPin, openAppRequest, backgroundApp}) {

    console.log("UAN render")

    React.useEffect(() => {
        // On mount, trigger auth check flow
        openAppRequest()
    }, []);


    let stackComponents;

    if (login.token && ( (! openApp.requirePIN) || verifyPin.success)) {
        // Have a login token AND EITHER user doesn't require a pin on open, or the pin has been verified
        // ==> Show app
        stackComponents = (
            <>
                <Stack.Screen name="HomeTabs" component={HomeTabs}/>
                <Stack.Screen name="TransferReportingScreen" component={TransferReportingScreen}/>
                <Stack.Screen name="Settings" component={SettingsScreen}/>
                <Stack.Screen name="FAQs" component={FAQScreen}/>
                <Stack.Screen name="Export" component={ExportScreen}/>
                <Stack.Screen name="VerifyUser" component={VerifyAccountFlow}/>
            </>
        )
    } else if (login.token) {
        // Have a login token but a pin is required by the user and is yet to have been provided
        // ==> Show Lock Screen
        stackComponents = (
            <>
                <Stack.Screen name="LockScreen" component={LockScreen} />
            </>
        )
    } else {
        //No token present
        // ==> require full login
        stackComponents = (
            <>
                <Stack.Screen name="EnterPhone" component={PhoneNumberScreen} />
                <Stack.Screen name="LoginPin" component={LoginPinScreen} />
                <Stack.Screen name="OTP" component={OTPScreen} />
                <Stack.Screen name="SetPin" component={SetPinScreen} />
            </>
        )
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {stackComponents}
            <Stack.Screen name="Terms" component={TermsScreen}/>
            <Stack.Screen name="CardScanScreen" component={CardScanScreen} />
        </Stack.Navigator>
    );
}

export const AppNavigator = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAppNavigator);