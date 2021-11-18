import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import {threeByteArrayToInt, byteArrayToHexString} from "../utils";

export const OpenNFCRequest = async () => (
        NfcManager.registerTagEvent()
            .then(() => NfcManager.requestTechnology(NfcTech.NfcA))
);

export const closeNFCRequest = async () => NfcManager.closeTechnology();


export const getNFCId = async () => (
        NfcManager.transceive([0x3A, 0x00, 0x02])
            .then(result => {
                let raw_id = result;
                raw_id.splice(3,1);

                return byteArrayToHexString(raw_id.slice(0,7))
            })
);

export const _getCount = async (counter) => (
    NfcManager.transceive([0x39, counter])
        .then(result => {
            return threeByteArrayToInt(result);
        })
);

export const _incrementCount = async (IncrementByteArray, counter) => (
    NfcManager.transceive([0xA5,counter].concat(IncrementByteArray).concat([0x00]))
        .then(result => {
            return result
        })
);

export const getAmountLoaded = async () => _getCount(0x00);
export const incrementAmountLoaded = async (IncrementByteArray) => _incrementCount(IncrementByteArray, 0x00);

export const getAmountDeducted = async () => _getCount(0x01);
export const incrementAmountDeducted = async (IncrementByteArray) => _incrementCount(IncrementByteArray, 0x01);

export const getSession = async () => _getCount(0x02);
export const incrementSession = async (IncrementByteArray) => _incrementCount(IncrementByteArray, 0x02);

export const getWrittenData = async () => (
        NfcManager.transceive([0x3A, 0x04, 0x0F])
            .then(result => {
                return result
            })
);

export const writeData = async (address, data) => (

        NfcManager.transceive([0xA2].concat([address]).concat(data))
            .then(result => {
                return result
            })
);
