import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { View, StyleSheet, Alert } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import { PersistGate } from 'redux-persist/integration/react'

import firebase from 'react-native-firebase';

import { Provider as PaperProvider } from 'react-native-paper';

import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from "react-native-restart";

import rootReducer from './reducers/rootReducer';
import { AppNavigator } from './navigators/AppNavigator';
import rootSaga from './sagas/rootSaga'

import { navigationRef } from "./RootNavigation";
import OfflineNotice from './components/OfflineNotice'
import VersionModal from './components/VersionModal.js';
import { checkFirebasePermissions } from './utils.js';
import { theme } from './Styles.js';
import { strings } from "../locales/i18n";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};



const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === `development`) {
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
}

export const store = createStore(
    persistedReducer,
    // rootReducer,
    compose(
        applyMiddleware(...middlewares)
    ),
);

const persistor = persistStore(store);

const errorHandler = (error, isFatal) => {
    if (isFatal) {
        Alert.alert(
            strings('App.Error'),
            `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${error.name} ${error.message}

        ${strings('App.RestartMsg')}
        `,
            [{
                text: strings('App.Restart'),
                onPress: () => {
                    console.log('reseting store');
                    store.dispatch({type: 'RESET'});
                    RNRestart.Restart();
                }
            }]
        );
    } else {
        console.log(error); // So that we can see it in the ADB logs in case of Android if needed
    }
};

setJSExceptionHandler(errorHandler, true);

sagaMiddleware.run(rootSaga);

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

class SempoApp extends React.Component {

    async componentDidMount() {
        console.log("Mounted App")

        checkFirebasePermissions();
        this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async createNotificationListeners() {
        // from: https://medium.com/@anum.amin/react-native-integrating-push-notifications-using-fcm-349fff071591

        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            console.log('notificationOpen',notificationOpen);
            this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            console.log('notificationOpen',notificationOpen);
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <PaperProvider theme={theme}>
                        <View style={styles.rootContainer}>
                            <VersionModal />

                            <NavigationContainer ref={navigationRef}>
                                <AppNavigator/>
                            </NavigationContainer>
                            <OfflineNotice />
                        </View>
                    </PaperProvider>
                </PersistGate>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

export default SempoApp;

