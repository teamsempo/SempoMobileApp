import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2D9EA0',
        // accent: '#34b0b3',

        accent: '#cd4aff',
        background: '#FFF',
        error: '#ff7a64',
        primaryUltralight: '#DCEBEE'
    },
};

var Styles = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    displayContainer: {
        flex: 2,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    displayText: {
        color: '#C2C7CC',
        fontSize: 38,
        // fontWeight: 'bold',
        textAlign: 'center',
        padding: 20
    },
    inputContainer: {
        flex: 8,
        backgroundColor: '#FFF',
        // borderTopWidth: 0.2,
        // borderColor: '#D5D9DC',
    },
    inputButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 0.5,
        // borderColor: '#D5D9DC'
    },
    inputButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3D454C',
    },
    inputRow: {
        flex: 1,
        flexDirection: 'row'
    },
    title: {
        paddingTop: 20,
        paddingBottom: 20,
        color: '#4F4E53',
        fontSize: 24,
        fontWeight: "500",
        textAlign: 'center'
    },
    text: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        color: '#4F4E53',
        fontWeight: '500',
        textAlign: 'left',
        fontSize: 15,
        marginTop: 25,
        marginBottom: 10,
    },
    section: {
        backgroundColor: '#FFF',
        marginLeft: -20,
        marginRight: -20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    questionWrapper: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: 1,
        borderColor: '#D8D9DD',
    },
    itemBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        flex: 1,
        display: 'flex',
        borderBottomWidth: 1,
        borderColor: '#D8D9DD',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        flex: 1,
        display: 'flex',
    },
    optionSection: {
        backgroundColor: '#FFF',
        marginLeft: -20,
        marginRight: -20,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
    },
});

export default Styles;