import React from 'react'
import { StyleSheet, View } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'

export default class CountryPickerWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            callingCode: '',
            name: ''
        }
    }

    render() {
        const { countryCodes, countryCode, withFilter, withFlag, withFlagButton, withCountryNameButton, withCallingCodeButton, withCallingCode, withEmoji, onSelect } = this.props;
        return (
            <View style={styles.container}>
                <CountryPicker
                    onSelect={onSelect}
                    countryCode={countryCode}
                    countryCodes={countryCodes}
                    withFilter={withFilter}
                    withFlag={withFlag}
                    withFlagButton={withFlagButton}
                    closeable={true}
                    transparent={false}
                    autoFocusFilter={false}
                    withCallingCodeButton={withCallingCodeButton}
                    withCountryNameButton={withCountryNameButton}
                    withCallingCode={withCallingCode}
                />
            </View>
        )
    }
}

CountryPickerWrapper.defaultProps = {
    countryCodes: null,
    countryCode: 'AU',
    withFilter: true,
    withFlag: true,
    withFlagButton: true,
    withCallingCodeButton: true,
    withCountryNameButton: false,
    withCallingCode: true,
    withEmoji: true,
    onSelect: () => null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    instructions: {
        paddingHorizontal: 10,
        textAlign: 'center',
        color: '#888',
        marginTop: 5,
        backgroundColor: 'transparent'
    }
});