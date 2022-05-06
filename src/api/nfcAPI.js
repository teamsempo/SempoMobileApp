import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import {threeByteArrayToInt, byteArrayToHexString, intToThreeByteArray, getDisplayDecimals} from "../utils";

export const OpenNFCRequest = async () => (
        NfcManager.registerTagEvent()
            .then(() => NfcManager.requestTechnology(NfcTech.NfcA))
);

export const closeNFCRequest = async () => NfcManager.cancelTechnologyRequest();


export const getNFCId = async () => (
        NfcManager.transceive([0x3A, 0x00, 0x02])
            .then(result => {
                let raw_id = result;
                raw_id.splice(3,1);

                return byteArrayToHexString(raw_id.slice(0,7))
            })
);

export const _getCount = async (counter, applyMultiplier) => {
    const multiplier = await getDisplayDecimals() == 0 ? 100 : 1;
    return NfcManager.transceive([0x39, counter])
        .then(result => {
            return threeByteArrayToInt(result) * (applyMultiplier ? multiplier : 1);
        })
};

export const _incrementCount = async (incrementValue, counter, applyMultiplier) => {
    const multiplier = await getDisplayDecimals() == 0 ? 100 : 1;
    const toWrite = applyMultiplier ? Math.floor(incrementValue/multiplier) : incrementValue
    return NfcManager.transceive([0xA5,counter].concat(intToThreeByteArray(toWrite)).concat([0x00]))
        .then(result => {
            return result
        })
}

export const getAmountLoaded = async () => _getCount(0x02, true);

export const incrementAmountLoaded = async (incrementValue) => _incrementCount(incrementValue, 0x02, true);

export const incrementAmountLoadedWithoutMultiplier = async (incrementValue) => _incrementCount(incrementValue, 0x02, false);

export const getAmountDeducted = async () => _getCount(0x01, true);

export const incrementAmountDeducted = async (incrementValue) => _incrementCount(incrementValue, 0x01, true);

export const getSession = async () => _getCount(0x00, false);
export const incrementSession = async (incrementValue) => _incrementCount(incrementValue, 0x00, false);

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
