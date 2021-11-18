import React from 'react'
import { StyleSheet, Text, View, Image, BackHandler, TouchableHighlight } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../../locales/i18n';

export default class WithdrawalCompleteScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => {
        return true;
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Icon name="check-circle-outline" size={100} color="#3D454C"/>
                    <Text style={styles.text}>{strings('WithdrawalCompleteScreen.Title')}</Text>
                    <Text style={styles.smallText}>{strings('WithdrawalCompleteScreen.PageText')}</Text>
                </View>
                <View style={styles.chargeContainer}>
                    <TouchableHighlight underlayColor='#298F91' style={styles.chargeButton}
                                        onPress={() => {
                                            this.props.navigation.navigate('Reporting')
                                        }}>
                        <Text style={styles.chargeButtonText}>{strings('WithdrawalCompleteScreen.ContinueButton')}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargeContainer: {
        flex: 2,
        margin: 20
    },
    chargeButton: {
        padding: 10,
        backgroundColor: '#2D9EA0',
        justifyContent: 'center',
    },
    chargeButtonText: {
        color: '#FFF',
        fontSize: 24,
        textAlign: 'center'
    },
    text: {
        marginTop: 20,
        color: '#3D454C',
        fontSize: 20,
        fontWeight: 'bold',
    },
    smallText: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
    }
});