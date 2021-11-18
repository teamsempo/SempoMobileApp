import React from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl, TouchableNativeFeedback, Animated} from 'react-native'

import DateTimeFromNow from './DateTimeFromNow'
import { strings } from '../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";

import CurrencyAmount from './CurrencyAmount'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const mapStateToProps = (state) => {
    return {
        login: state.login,
    };
};

class TransfersList extends React.Component {

    handlePress(e,item) {
        console.log('cache status:', item)
        if (!item.inCache) {
            this.props.navigation.navigate('TransferReportingScreen',
                { title: strings('GoBackNav.DefaultTitleText'),
                    transfer_amount: ((item.transfer_amount / 100).toFixed(this.props.login.displayDecimals)),
                    created: item.created, transfer: item
                })
        }
    }

    _renderItem = ({ item }) => {

        if ( item.transfer_type === 'WITHDRAWAL' ) {
            var transform = [];
            var iconName = 'cash-multiple';
            var negative = true;
            var subtext = `${strings('ReportingScreen.Withdrawal')}`
        } else if ( item.transfer_type === 'DISBURSEMENT') {
            transform = [];
            iconName = 'cash-multiple';
            negative = false;
            var subtext = `${strings('ReportingScreen.Disbursement')}`
        } else if (item.transfer_use === 'Refund') {
            transform = [];
            iconName = 'cash-multiple';
            negative = true;
            subtext = `${strings('ReportingScreen.Refund')}`
        } else {
            transform = item.is_sender ? [{ rotate: '-45deg'}] : [{ rotate: '45deg'}];
            iconName = 'send';
            negative = item.is_sender;
            subtext = `${item.is_sender ? strings('ReportingScreen.Send') : strings('ReportingScreen.Receive')} ${item.inCache? ` (${strings('ReportingScreen.CachePending')})` : ''}`
        }
        const hint = strings('ReportingScreen.Hint') + ' ' + subtext;

        return (
            <TouchableNativeFeedback key={item.id}
                                     background={TouchableNativeFeedback.SelectableBackground()}
                                     onPress={(e) => this.handlePress(e,item)}
                                     accessibilityLabel={subtext}
                                     accessibilityHint={hint}>
                <View style={styles.transferWrapper}>
                    <View style={item.inCache? styles.transferFaded : styles.transfer}>
                        <Icon style={{paddingTop: 7, paddingBottom: 7, transform: (transform)}} borderRadius={0} iconStyle={{padding: 10}} name={iconName} size={32} color="#3D454C" backgroundColor="#FFF"/>
                        <View style={styles.transferTextContainer}>
                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <Text style={negative? styles.amountText: styles.amountTextPositive}>{negative ? '-' : '+'}
                                    <CurrencyAmount amount = {item.transfer_amount / 100} />
                                </Text>
                                <Text style={styles.subText}>{subtext}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <DateTimeFromNow created={item.created}/>
                                {
                                    item.inCache?
                                        <Icon name={'sync-alert'} size={30} color="#909AA1"/>
                                        :
                                        <Icon name={this.props.isRTL ? 'menu-left' : 'menu-right'}
                                               size={30} color="#909AA1"/>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    };

    render() {
        return(
            <AnimatedFlatList
                { ...this.props }
                data={this.props.transfers}
                renderItem={this._renderItem}
                keyExtractor={item => item.created}
            />
        )
    }
}
export default connect(mapStateToProps, null)(TransfersList);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 11,
        backgroundColor: '#FFF',
    },
    transferWrapper: {
        flex: 1,
    },
    transfer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 15,
        marginHorizontal: 15,
        borderBottomWidth: 0.4,
        borderBottomColor: '#bbb',
    },
    transferFaded: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 0.4,
        borderBottomColor: '#bbb',
        opacity: 0.5,
    },
    transferTextContainer: {
        paddingLeft: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountText: {
        color: '#3D454C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    amountTextPositive: {
        color: '#3ACC6C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
    }
});