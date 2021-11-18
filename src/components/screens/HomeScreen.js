import React, { Component } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    FlatList,
    TouchableNativeFeedback,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from "../../../locales/i18n";

import {connect} from "react-redux";
import { loadUser } from "../../reducers/userReducer"
import { loadTransferCards } from "../../reducers/transferCardReducer"

import SurveyFeedbackModal from '../feedback/SurveyFeedbackModal'
import CurrencyAmount from '../CurrencyAmount'
import TransfersList from '../TransfersList'
import VerifyAccountWrapper from "../VerifyAccountWrapper";
import {loadCreditTransfers, RESET_TRANSFER_DATA, updateTransferData} from "../../reducers/creditTransferReducer";

import {resolveTransferCache} from "../../reducers/transferCacheReducer";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 55;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const mapStateToProps = (state) => {

    const transferAccountsWithTokens = Object.keys(state.transferAccounts.byId).map((id, index)=> {
        let account = state.transferAccounts.byId[id];
        let token = state.tokens.byId[account.token] || {symbol: '--'};
        account.symbol = token.symbol;
        account.index = index;
        account.color = 'green';

        return account
    });

    return {
        login: state.login,
        locale: state.locale,
        users: state.users,
        networkStatus: state.networkStatus,
        transferAccounts: state.transferAccounts,
        transferAccountsWithTokens: transferAccountsWithTokens,
        tokens: state.tokens.byId,
        creditTransferList: Object.keys(state.creditTransfers.byId)
            .map(id => state.creditTransfers.byId[id]),
        cachedTransferList: Object.keys(state.transferCache.byUUID)
            .map(uuid => state.transferCache.byUUID[uuid])
            .filter(cached => cached.userId && cached.userId === (state.login.userId))
            .map(payload => payload.body),
        transferCacheStatus: state.transferCache.resolveStatus,
        creditTransferStatus: state.creditTransfers.createStatus,
        creditTransfers: state.creditTransfers,
        activeAccount: state.creditTransfers.transferData.transfer_account_id
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUser: (payload) => dispatch(loadUser(payload)),
        loadCreditTransfers: (per_page, page) => dispatch(loadCreditTransfers(per_page, page)),
        loadTransferCards: () => dispatch(loadTransferCards()),
        resolveTransferCache: () => dispatch(resolveTransferCache()),
        updateActiveAccount: (my_transfer_account_id, token_symbol) => dispatch(updateTransferData({
            my_transfer_account_id,
            token_symbol
        })),
        resetTransferData: () => dispatch({type: RESET_TRANSFER_DATA}),
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
    };
};

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            currencyModalVisible: false,
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ?  - HEADER_MAX_HEIGHT : 0,
            ),
            transferPagesLoaded: 1,
            activeAccountId: null,

            data: [{key: 'AUD', balance: 0, color: 'blue', index: 0}, {key: 'TOP', balance: 0, color: 'red', index: 1}, {key: 'VUV', balance: 0, color: 'green', index: 2}],

        };
    }

    componentDidMount() {
        console.log("Mounted HomeScreen!")
        this._handleLoad();
        if (this.props.login.requestFeedbackQuestions.length >= 1) {
            this.setState({modalVisible: true})
        }

        this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
            this.props.resetTransferData();
            this.props.updateTransferData({public_identifier: null});
        });
    }

    componentWillUnmount() {
        this._unsubscribeFocus();;
    }

    _handleExtendList = () => {
        let {isRequesting, numberAdded} = this.props.creditTransfers.loadStatus;
        if (!isRequesting && numberAdded > 0) {
            this.setState(
                (prevState, nextProps) => ({
                    transferPagesLoaded: prevState.transferPagesLoaded + 1,
                }),
                () => {
                    this.props.loadCreditTransfers(20, this.state.transferPagesLoaded);
                }
            );
        }
    };

    _handleLoad = () => {
        console.log("handling homescreen load")
        this.props.loadUser();
        this.props.loadCreditTransfers(20, 1);
        this.props.loadTransferCards();
        this.props.resolveTransferCache()
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        if (viewableItems.length === 1) {
            this.props.updateActiveAccount(viewableItems[0].item.id, viewableItems[0].item.symbol);

            this.setState({activeAccountId: viewableItems[0].item.id,
                activeAccountIndex: viewableItems[0].index})
        }
    };

    _renderItem = ({ item }) => {

        const { users, transferAccountsWithTokens } = this.props;

        let transferAccount = item

        var viewWidth = this.state[transferAccount.id + '_width'];
        if (typeof viewWidth === 'undefined') {
            viewWidth = 0
        }

        let screenWidth = Dimensions.get("window").width;
        let marginWidth = (screenWidth - viewWidth);
        let endItem = marginWidth / 2;
        let middleItem = marginWidth / 8;

        let dataLengthIndex = transferAccountsWithTokens.length - 1; // minus 1

        let marginLeftValue = (transferAccount.index === 0 ? endItem : middleItem); // first item, else
        let marginRightValue = (transferAccount.index === dataLengthIndex ? endItem : middleItem); // last item, else
        let isMiddleItem = (transferAccount.index !== 0 && transferAccount.index !== dataLengthIndex);


        let isAccountActive = (transferAccount.id === this.state.activeAccountId);

        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );

        const balanceOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0.2, 0],
            extrapolate: 'clamp',
        });

        const titleTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50, 5],
            extrapolate: 'clamp',
        });

        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });


        if (users.loadStatus.isRequesting) {
            var balance =
                <Text style={styles.title}>
                    <CurrencyAmount amount={'---'} currencyCode={transferAccount.symbol} />
                </Text>
        } else if (transferAccount !== null && typeof(transferAccount) !== "undefined") {
            balance =
                <Text style={styles.title}>
                    <CurrencyAmount amount={transferAccount.balance / 100} currencyCode={transferAccount.symbol} />
                </Text>
        } else {
            balance = <Text style={styles.title}><CurrencyAmount amount={'---'} currencyCode={transferAccount.symbol} /></Text>
        }

        return(
            <View style={{justifyContent: 'flex-end', zIndex: 99}}>
                <TouchableNativeFeedback background={null} onPress={() => {
                    if (this.state.activeAccountIndex !== transferAccount.index) {
                        this.flatListRef.scrollToIndex({
                            animated: true,
                            index: transferAccount.index,
                            viewOffset: isMiddleItem ? middleItem * 3 : 0
                        })
                    } else {
                        this._handleLoad()
                    }
                }}>
                    <Animated.View key={transferAccount.key} style={[
                        {
                            transform: [
                                { scale: titleScale },
                                { translateY: titleTranslate },
                            ],
                        },
                        {
                            justifyContent: 'center',
                        }]
                    }>
                        <View style={{
                                marginRight: marginRightValue,
                                marginLeft: marginLeftValue,
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                onLayout={(event) =>
                                    this.setState({[transferAccount.id + '_width']: event.nativeEvent.layout.width})
                                }
                            >
                                <Text style={[styles.title, {opacity: isAccountActive ? 1 : 0.6}]}>{balance}</Text>
                                <Animated.View
                                    style={[
                                        {
                                            opacity: balanceOpacity,
                                        },
                                    ]}
                                >
                                    <Text style={{textAlign: 'center', color: '#FFF'}}>{strings('HomeScreen.Balance')}</Text>
                                </Animated.View>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableNativeFeedback>
            </View>
        )
    };

    render() {

        const { height, width } = Dimensions.get('window');
        const { login, users, creditTransfers, transferAccountsWithTokens } = this.props;
        const showFeedbackModal = login.requestFeedbackQuestions.length >= 1 && this.state.modalVisible;

        const user = users.byId[Object.keys(users.byId)[0]];

        const all_transfers = this.props.creditTransferList.concat(this.props.cachedTransferList);

        const transfers = all_transfers
            .filter(transfer => (
                transfer.my_transfer_account_id === this.state.activeAccountId ||
                transfer.recipient_transfer_account_id === this.state.activeAccountId ||
                transfer.sender_transfer_account_id === this.state.activeAccountId
            ))
            .sort((a, b) => (new Date(b.created)- new Date(a.created)));

        // adjust scoll distance if offline notice active.
        // const HEADER_SCROLL_DISTANCE = !this.props.networkStatus.isConnected ? HEADER_SCROLL_DISTANCE + 30 : HEADER_SCROLL_DISTANCE;

        // ------ ANIMATIONS -------
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });

        const titleTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE / 6 + 46, -HEADER_SCROLL_DISTANCE + 78],
            extrapolate: 'clamp',
        });

        const balanceIconsOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 8, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp',
        });

        if (user !== null && typeof(user) !== "undefined" && login.kycActive) {
            var actionWrapper = <VerifyAccountWrapper user={user} navigation={this.props.navigation}/>
        } else {
            actionWrapper = null;
        }

        let listEmptyComponent = (
            <View>
                <TouchableOpacity accessibilityHint={strings('HomeScreen.LoadTransfers')} activeOpacity={0.8} background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this._handleLoad()}>
                    <View style={styles.NoTransferDataContainer}>
                        <Text style={{textAlign:'center'}}>{strings('HomeScreen.NoTransfers')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={styles.fill}>
                <TransfersList
                    transfers={transfers}
                    isRTL={this.props.locale.isRTL}
                    navigation={this.props.navigation}
                    style={styles.fill}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true },
                    )}
                    contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT}}
                    contentInset={{top: HEADER_MAX_HEIGHT}}
                    contentOffset={{y: -HEADER_MAX_HEIGHT}}
                    refreshControl={
                        <RefreshControl
                            refreshing={users.loadStatus.isRequesting || creditTransfers.loadStatus.isRequesting }
                            onRefresh={() => this._handleLoad()}
                            // Android offset for RefreshControl
                            progressViewOffset={HEADER_MAX_HEIGHT}
                            colors={['#2D9EA0']}
                            tintColor="white"
                            title="loading..."
                            titleColor="white"
                            progressBackgroundColor="white"
                        />
                    }
                    ListHeaderComponent={actionWrapper}
                    ListEmptyComponent={listEmptyComponent}
                    onEndReached={() => this._handleExtendList()}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                />

                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.header,
                        { transform: [{ translateY: headerTranslate }] },
                    ]}
                >
                </Animated.View>

                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                { scale: titleScale },
                                { translateY: titleTranslate },
                            ],
                            marginTop: 0,
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            {
                                opacity: balanceIconsOpacity,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                flexDirection: 'row',
                                zIndex: 99,
                            },
                        ]}
                    >
                        <TouchableNativeFeedback accessibilityLabel={strings('SettingsScreen.Title')} accessibilityHint={strings('HomeScreen.SettingsHint')} background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props.navigation.navigate('Settings', { title: strings('SettingsScreen.Title')} )}>
                            <View style={{justifyContent: 'flex-start', padding: 20}}>
                                <Icon name={'cog'} size={25} color="#FFF"
                                      backgroundColor="#2D9EA0"/>
                            </View>
                        </TouchableNativeFeedback>

                    </Animated.View>

                    <View style={{flex: 2}}>
                        <FlatList
                            decelerationRate={0}
                            showsHorizontalScrollIndicator={false}
                            ref={(ref) => { this.flatListRef = ref; }}
                            snapToInterval={width / 2.2} //your element width
                            snapToAlignment={"center"}
                            horizontal={true}
                            data={transferAccountsWithTokens}
                            renderItem={this._renderItem}
                            onViewableItemsChanged={this.onViewableItemsChanged}
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 80
                            }}
                        />
                    </View>

                    <Animated.View
                        style={[
                            {
                                opacity: balanceIconsOpacity
                            },
                            {
                                flexDirection: 'row',
                                justifyContent: 'center',
                                flex: 1,
                                marginTop: 20,
                            }
                        ]}
                    >

                    </Animated.View>

                </Animated.View>

                <SurveyFeedbackModal
                    _resetModal={() => this.setModalVisible(!this.state.modalVisible)}
                    modalVisible={showFeedbackModal}
                    requestFeedback={true}
                />

            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2D9EA0',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    bar: {
        backgroundColor: 'transparent',
        // marginTop: Platform.OS === 'ios' ? 28 : 38,
        height: HEADER_MAX_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    NoTransferDataContainer: {
        height: Dimensions.get('window').height - HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 23,  // why 23, i don't know?
        color: '#FFF',
        flexDirection: 'column',
        backgroundColor: '#FFF',
        justifyContent: 'center',
        textAlign: 'center'
    },
    balanceIcons: {
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center'
    }
});