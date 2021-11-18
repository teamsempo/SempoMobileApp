import firebase from 'react-native-firebase';

export const tracker = firebase.analytics();

// default to true
tracker.setAnalyticsCollectionEnabled(true);