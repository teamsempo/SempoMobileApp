import AsyncStorage from '@react-native-community/async-storage';
import {loadString, remove, saveString} from './keychain.js';
import firebase from 'react-native-firebase';
import Intercom from 'react-native-intercom';
import ImgToBase64 from 'react-native-image-base64';

import * as Sentry from "@sentry/react-native";


import {SEMPO_API_URL} from "./config";

const SempoUserToken = 'SempoUserToken';
const SempoPinKey = 'SempoPinKey';


export const handleResponse = (response) => {
    return response.data;
};

export function* handleError(error)  {

    try {
        var status = error.response.statusText;

        var message = error.response.data.message;

        if (message === undefined) {
            message = "Something went wrong.";

            Sentry.captureException(error)
        }
    } catch (parse_error) {

        // message = error.message;

        message = "Something went wrong.";

    }

    return {message, status}
}

export const trim = () => {
    if(typeof(String.prototype.trim) === "undefined")
    {
        String.prototype.trim = function()
        {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }
};

export const extractJson = (error) => {
    return error.json()
};

export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.log(error)
    }
};

export const removeToken = async () => {
    await AsyncStorage.removeItem('userToken');
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken')

        if (token !== null){
            // We have data!!
            return token
        }
    } catch (err) {
        console.log('error:', err)

        removeToken();
        return ''
    }
};


export const storeHostURL = async (url) => {
    console.log("storing host url", url)
    try {
        await AsyncStorage.setItem('hostName', url);
    } catch (error) {
        console.log(error)
    }
};

export const removeHostURL = async () => {
    await AsyncStorage.removeItem('hostName');
};

export const getHostURL = async () => {
    try {
        var name = await AsyncStorage.getItem('hostName');
        if (name !== null){

            return name
        } else {
            // console.log('hostName not found, falling back to default', SEMPO_API_URL);
            return SEMPO_API_URL
        }
    } catch (err) {
        removeHostName();
        return ''
    }
};

export const storePhoneNumber= async (PhoneNumber) => {
    await AsyncStorage.setItem('PhoneNumber', PhoneNumber);
};

export const removePhoneNumber = async () => {
    await AsyncStorage.removeItem('PhoneNumber');
};

export const getPhoneNumber = async () => {
    try {
        var phoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (phoneNumber !== null){
            // We have data!!
            return phoneNumber
        }
    } catch (err) {
        removePhoneNumber();
        return ''
    }
};

export const storeLocale = async (currentLocale) => {
    await AsyncStorage.setItem('locale', currentLocale);
};

export const removeLocale = async () => {
    await AsyncStorage.removeItem('locale');
};

export const getLocale = async () => {
    try {
        var locale = await AsyncStorage.getItem('locale');
        if (locale !== null){
            // console.log('locale found: ', locale);
            // We have data!!
            return locale
        } else {
            // console.log('saved locale not found',);

            return null
        }
    } catch (err) {
        removeLocale();
        return ''
    }
};

export const stringToColour = function(str) {
    if (str !== null && typeof(str) !== 'undefined') {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }
};

export function capitalize(str) {
    if (str !== null && typeof(str) !== 'undefined') {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export const generateQueryString = (query) => {
    if (typeof query === "object") {
        let query_string = '?';
        Object.keys(query).map(query_key => {
            let string_term = query_key + '=' + query[query_key] + '&';
            query_string = query_string.concat(string_term)
        });

        return query_string.slice(0, -1);
    } else {
        throw new TypeError('Query must be object')
    }
};

export function parseEthQRCode(address) {
    // query to be returned
    var query = {};

    // special ethereum handling
    if (address.includes('?')) {
        // query string exists
        if (address.includes('ethereum:')) {
            var queryString = address.slice(51);
            Object.assign(query, {'address': address.slice(0,51)})
        } else {
            queryString = address.slice(42);
            Object.assign(query, {'address': address.slice(0,42)})
        }
    } else {
        Object.assign(query, {'address': address});
        return query
    }

    // normal queryString parsing
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export const threeByteArrayToInt = (array) => array
    .map((value,index) => (value*256**index))
    .reduce((total, current) => (total + current), 0);


export const intToThreeByteArray = (int) => {
    // we want to represent the input as a 3-bytes array
    let byteArray = [0, 0, 0];

    for ( let index = 0; index < byteArray.length; index ++ ) {
        let byte = int & 0xff;
        byteArray [ index ] = byte;
        int = (int - byte) / 256;
    }

    return byteArray;
};

export const byteArrayToHexString = (array) => array
    .map(byte => byte.toString(16).padStart(2,'0').toUpperCase())
    .join('');

export const hexStringToByteArray = (hexString) => {
    let byteArray = [];
    for (let index = 0; index < hexString.length / 2; index++) {
        let byte = parseInt(hexString.slice(index * 2, index * 2 + 2), 16);
        byteArray.push(byte)
    }
    return byteArray
}

export const utf8ToByteArray = (unicode) => Array.from(new TextEncoder("utf-8").encode(unicode));

export const byteArrayToUtf8= (array) => new TextDecoder("utf-8").decode(Uint8Array.from(array));

export const padArray = function(arr,len,fill) {
    return arr.concat(Array(len).fill(fill)).slice(0,len);
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const storePIN = async (PIN) => {
    await saveString(SempoPinKey, PIN);
};

export const getPIN = async () => {
    try {
        return await loadString(SempoPinKey)
    } catch (error) {
        return null;
    }
};

export const removePIN = async () => {
    await remove(SempoPinKey)
};


/**
 * Pass in 'DrivingLicence'
 * Returns 'Driving Licence'
 * */
export function addSpaceToString(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const convertURItoBase64 = (uri) => {
    if (typeof uri !== 'undefined' || uri !== null) {
        return ImgToBase64.getBase64String(uri).then(base64String => {
            return base64String
        }).catch(err => console.log(err));
    }
    return null;
};

export const checkFirebasePermissions = async () => {
    console.log('checking firebase')
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        console.log('checking firebase enabled')

        // user has permissions
        getFirebaseToken()
    } else {
        // user doesn't have permission
        requestFirebasePermission()
    }
};

export const getFirebaseToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken',fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            Intercom.sendTokenToIntercom(fcmToken);
        }
    }
};

export const requestFirebasePermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        getFirebaseToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
};
