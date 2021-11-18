import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Styles from '../../Styles';
import { strings } from '../../../locales/i18n';
import { connect } from "react-redux";
import CurrencyAmount from "../CurrencyAmount"
import DateTime from '../DateTime'

//todo: fix react-native-image-picker
// import ReceiptUploader from './ReceiptUploader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        creditTransfers: state.creditTransfers.byId
    };
};

class TransferReportingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transferId: null
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentWillMount() {
        const { route } = this.props;
        const transfer = route.params.transfer? route.params.transfer: null;

        if (transfer) {
            this.setState({transferId: transfer.id})
        }
    }

    render() {
        //We can't just pull this data from the navigation otherwise it doesn't update on state change
        const transfer = this.props.creditTransfers[this.state.transferId];

        if ( transfer.transfer_type === 'WITHDRAWAL' ) {
            var transform = [];
            var iconName = 'cash-multiple';
            var negative = true;
            var subtext = `${strings('ReportingScreen.Withdrawal')}`
        } else if ( transfer.transfer_type === 'DISBURSEMENT') {
            transform = [];
            iconName = 'cash-multiple';
            negative = false;
            var subtext = `${strings('ReportingScreen.Disbursement')}`
        } else if (transfer.transfer_use === 'Refund') {
            transform = [];
            iconName = 'cash-multiple';
            negative = true;
            subtext = `${strings('ReportingScreen.Refund')}`
        } else {
            transform = transfer.is_sender ? [{ rotate: '-45deg'}] : [{ rotate: '45deg'}];
            iconName = 'send';
            negative = transfer.is_sender;
            subtext = `${transfer.is_sender ? strings('ReportingScreen.Send') : strings('ReportingScreen.Receive')} ${transfer.inCache? ` (${strings('ReportingScreen.CachePending')})` : ''}`
        }

        let status = ''

        if (transfer.transfer_status === 'PENDING') {
            status = strings('ReportingScreen.Pending')
        } else if (transfer.transfer_status == 'COMPLETE')
            status = strings('ReportingScreen.Complete');
        else if (transfer.transfer_status == 'REJECTED') {
            status = string('ReportingScreen.Rejected');
        } else {
            status = transfer.transfer_status
        }



        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>

                    <View style={{textAlign:'center', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <Icon style={{paddingVertical: 15, transform: (transform)}} borderRadius={0} name={iconName} size={40} color="#3D454C" backgroundColor="#FFF"/>
                    </View>

                    <Text style={negative? styles.amountText: styles.amountTextPositive}>{negative ? '-' : '+'}
                        <CurrencyAmount amount={transfer.transfer_amount / 100}/>
                    </Text>
                    <Text style={styles.subtitle}>
                        {subtext}
                    </Text>
                </View>
                <View style={styles.mainContainer}>
                    <Text style={Styles.sectionTitle}>
                        {strings('TransferReportingScreen.TransferTitle')}
                    </Text>

                    <View style={Styles.optionSection}>
                        <View style={Styles.itemBorder}>
                            <Text>{strings('TransferReportingScreen.TimestampLabel')}</Text>
                            <DateTime time={transfer.created}/>
                        </View>
                    </View>

                    <View style={Styles.optionSection}>
                        <View style={Styles.itemBorder}>
                            <Text>{strings('TransferReportingScreen.StatusLabel')}</Text>
                            <Text style={styles.itemText}>{status}</Text>
                        </View>
                    </View>

                    {/*<View style={Styles.optionSection}>*/}
                        {/*<View style={Styles.itemBorder}>*/}
                            {/*<ReceiptUploader images={transfer.attached_images} transferId={transfer.id}/>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                </View>
            </View>
        )
    }
}
export default connect(mapStateToProps, null)(TransferReportingScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 8,
        backgroundColor: '#fff',
        marginLeft: 20,
        marginRight: 20,
    },
    topContainer: {
        flex: 3,
        backgroundColor: '#F2F4F5',
        justifyContent: 'center',
    },
    amountText: {
        color: '#3D454C',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    amountTextPositive: {
        color: '#3ACC6C',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    text: {
        fontSize: 15,
        textAlign: 'left',
        marginTop: 10,
    },
    itemText: {
        color: '#909AA1'
    }
});