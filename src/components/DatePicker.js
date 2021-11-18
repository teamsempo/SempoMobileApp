import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import { Text } from 'react-native'
import { storedLocale } from '../../locales/i18n'

export default class DatePickerWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: "",
            locale: null,
        }
    }

    componentWillMount() {
        storedLocale().then((locale) => this.setState({locale: locale.LocaleIsStored}))
    }

    render() {
        return (
            <DatePicker
                locale={this.state.locale}
                style={{width: 200}}
                date={this.props.date}
                mode="date"
                placeholder={this.props.placeholder}
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate="2000-01-01"
                confirmBtnText={this.props.confirm}
                cancelBtnText={this.props.cancel}
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                    },
                    dateInput: {
                        borderWidth: 0,
                    },
                    // ... You can check the source to find the other keys.
                }}
                onDateChange={this.props.onDateChange}
            />
        )
    }
}