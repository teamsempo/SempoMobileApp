import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import moment from 'moment';
import {connect} from "react-redux";
import {strings} from "../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        locale: state.locale
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class DateTimeFromNow extends React.Component {
    render() {
        if (this.props.time) {

            // LOCALIZE MOMENT IMPORT
            if (this.props.locale.locale === 'ar') {
                require('moment/locale/ar.js');
                moment.locale('ar');
            } else if (this.props.locale.locale === 'fr') {
                require('moment/locale/fr.js');
                moment.locale('fr');
            } else if (this.props.locale.locale === 'es') {
                require('moment/locale/es.js');
                moment.locale('es');
            } else {
                moment.locale('en')
            }

            var formatted_time = moment.utc(this.props.time).format('MMM Do YY, h:mm:ss a');

            return (
                <Text style={{color: '#909AA1'}}>{formatted_time}</Text>
            )
        } else {
            return (
                <Text style={{color: '#909AA1'}}>{strings('DateTimeFromNow.NotLong')}</Text>
            )
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DateTimeFromNow);