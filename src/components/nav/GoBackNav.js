import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
// import { NavigationActions } from 'react-navigation';

import { strings } from '../../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class GoBackNav extends React.Component {

    render() {
        if (this.props.amount) {
            var TitleText = <Text style={styles.text}>{this.props.amount ? `${strings('Defaults.CurrencySymbol')}` + this.props.amount + ' Transfer' : 'Go Back'}</Text>
        } else if (this.props.title) {
            TitleText = <Text style={styles.text}>{this.props.title}</Text>
        } else {
            TitleText = <Text style={styles.text}>{strings('GoBackNav.DefaultTitleText')}</Text>
        }

        var arrow = (this.props.locale.isRTL === true) ? 'menu-left' : 'menu-right';

        return (
            <View style={styles.rootContainer}>
                <Icon.Button iconStyle={{marginLeft: 10}} name={arrow} size={30} color="#3D454C"
                             backgroundColor="#F2F4F5"
                             onPress={() => this.props.navigation.dispatch(NavigationActions.back())}/>
                {TitleText}
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GoBackNav);

const styles = StyleSheet.create({
    rootContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F4F5',
        borderBottomWidth: 2,
        borderColor: '#C2C7CC',
    },
    text: {
        color: '#3D454C',
        fontSize: 20,
        fontWeight: 'bold',
    },
});