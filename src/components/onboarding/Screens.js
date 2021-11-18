import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

import Swiper from "./Swiper.js"

import {strings} from "../../../locales/i18n";

export default class Screens extends Component {
    render() {
        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;

        return (
            <Swiper sendToApp={this.props.sendToApp}>
                {/* First Screen */}
                <View style={[styles.slide, { backgroundColor: '#FFF' }]}>
                    <Image
                        source={require('../img/wallet.png')}
                        style={{width: width / 2, height: height / 2.5}}
                        resizeMode='contain'
                    />
                    <Text style={styles.header}>{strings('OnboardingScreens.DigitalWalletTitle')}</Text>
                    <Text style={styles.text}>{strings('OnboardingScreens.DigitalWalletDesc')}</Text>
                </View>
                {/* Second Screen */}
                <View style={[styles.slide, { backgroundColor: '#FFF' }]}>
                    <Image
                        source={require('../img/payments.png')}
                        style={{width: width / 1.5, height: height / 2.5}}
                        resizeMode='contain'
                    />
                    <Text style={styles.header}>{strings('OnboardingScreens.PaymentsTitle')}</Text>
                    <Text style={styles.text}>{strings('OnboardingScreens.PaymentsDesc')}</Text>
                </View>
                {/* Third Screen */}
                <View style={[styles.slide, { backgroundColor: '#FFF' }]}>
                    <Image
                        source={require('../img/verification.png')}
                        style={{width: width / 1.5, height: height / 2.5}}
                        resizeMode='contain'
                    />
                    <Text style={styles.header}>{strings('OnboardingScreens.VerificationTitle')}</Text>
                    <Text style={styles.text}>{strings('OnboardingScreens.VerificationDesc')}</Text>
                </View>
                {/* Fourth Screen */}
                <View style={[styles.slide, { backgroundColor: '#FFF' }]}>
                    <Image
                        source={require('../img/community.png')}
                        style={{width: width / 1.5, height: height / 2.5}}
                        resizeMode='contain'
                    />
                    <Text style={styles.header}>{strings('OnboardingScreens.ReferralTitle')}</Text>
                    <Text style={styles.text}>{strings('OnboardingScreens.ReferralDesc')}</Text>
                </View>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    // Slide styles
    slide: {
        flex: 1,                    // Take up all screen
        justifyContent: 'center',   // Center vertically
        alignItems: 'center',       // Center horizontally
        paddingBottom: 100,
    },
    // Header styles
    header: {
        textAlign: 'center',
        color: '#4F4E53',
        fontFamily: 'Avenir',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 15,
    },
    // Text below header
    text: {
        color: '#4F4E53',
        fontFamily: 'Open Sans',
        fontSize: 16,
        marginHorizontal: 40,
        textAlign: 'center',
    },
});