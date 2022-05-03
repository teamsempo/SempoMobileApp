import React from 'react'
import {Alert, StyleSheet, Text, View, ScrollView} from 'react-native'
import {connect} from "react-redux";
import I18n from 'react-native-i18n';

import { strings } from '../../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateTransferData } from "../../reducers/creditTransferReducer";

import TransferAmount from './TransferAmountDisplay'
import Styles from "../../Styles";
import BottomAsyncButton from "../BottomAsyncButton";

const mapStateToProps = (state) => {
    return {
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
    };
};

class PaymentsUseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usagesSelected: [],
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    _handleNext() {
        if (this.state.usagesSelected.length < 1) {
            Alert.alert(
                `${strings('PaymentsUseScreen.PaymentUse')}`,
                `${strings('PaymentsUseScreen.PaymentUsePrompt')}`,
                [{ text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => console.log('cancel'), style: 'cancel'}],
            );
        } else {
            this.props.updateTransferData({transfer_use: this.state.usagesSelected});
            this.props.navigation.navigate('PaymentOption', { title: strings('GoBackNav.DefaultTitleText')});
        }
    }

    _selectPaymentUse(id) {
        console.log("id ticked", id)
        let { usagesSelected } = this.state;
        let newUsages = [...usagesSelected];

        var index = usagesSelected.indexOf(id);
        if (index !== -1) {
            newUsages.splice(index, 1);
            console.log('remove',newUsages)
            this.setState({usagesSelected: newUsages})
        } else {
            this.setState({ usagesSelected: [...usagesSelected, id]})
        }
    }

    render() {
        const { usagesSelected } = this.state;
        const { navigation } = this.props;

        if (this.props.login.transferUsages) {
            var uses = this.props.login.transferUsages.map(use_dict => {

                let useText = use_dict.name;

                let locale = I18n.currentLocale().toString()

                if (use_dict.translations) {
                    useText = use_dict.translations[locale] || use_dict.name;
                }

                let icon = use_dict.icon || 'star';


                return (
                    <View style={styles.paymentUse} key={use_dict.id}>
                        <Icon.Button key={use_dict.id} iconStyle={{marginLeft: 10, padding: 15, backgroundColor: (usagesSelected.indexOf(use_dict.id) !== -1 ? '#30a4a6' : '#fff')}} name={icon} size={20} color={usagesSelected.indexOf(use_dict.id) !== -1 ? '#FFF' : '#3D454C'}
                                     backgroundColor="#FFF"
                                     onPress={() => {
                                         this._selectPaymentUse(use_dict.id)
                                     }}>
                            <Text style={{paddingLeft: 10, width: '100%'}}>{useText}</Text>
                        </Icon.Button>
                    </View>
                )
            });
        } else {
            uses = (
                <View style={styles.paymentUse} key={0}>
                    <Icon.Button key={0}
                                 iconStyle={{
                                     marginLeft: 10,
                                     padding: 15,
                                     backgroundColor: (usagesSelected.indexOf(0) !== -1 ? '#30a4a6' : '#fff')}}
                                 name="star"
                                 size={20}
                                 color={usagesSelected.indexOf(0) !== -1 ? '#FFF' : '#3D454C'}
                                 backgroundColor="#FFF"
                                 onPress={() => {
                                     this._selectPaymentUse(0)
                                 }}>
                        <Text style={{paddingLeft: 10, paddingBottom: 10, width: '100%'}}>Other</Text>
                    </Icon.Button>
                </View>
            )
        }

        return (
            <View style={styles.rootContainer}>
                <View style={styles.mainContainer}>
                    <TransferAmount />
                    <Text style={{marginTop: 10}}>{strings('PaymentsUseScreen.PaymentUse')}</Text>
                </View>
                <View style={Styles.inputContainer}>
                    <ScrollView>
                        { uses }
                    </ScrollView>
                </View>
                <View style={Styles.inputButton}>
                    <BottomAsyncButton
                        buttonText={strings('SendPaymentCameraScreen.Next').toUpperCase()}
                        isLoading={false}
                        onPress={() => this._handleNext()}
                    />
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsUseScreen);


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentUseContainer: {
        flex: 6,
        margin: 20,
        borderTopWidth: 1,
        borderColor: '#C2C7CC',
    },
    paymentUse: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#C2C7CC',
    },
    inputValueText: {
        color: '#3D454C',
        fontSize: 38,
        fontWeight: 'bold',
    }
});
