import { put, take, takeEvery, call, all, select, fork, cancel } from 'redux-saga/effects'
import * as Sentry from "@sentry/react-native";

var EC = require('elliptic').ec;
var hash = require('hash.js');
var ec = new EC('p192');

import {
    CHARGE_NFC_CARD_REQUEST,
    CHARGE_NFC_CARD_SUCCESS,
    CHARGE_NFC_CARD_FAILURE,
    NFC_READ_ACTIVE,
    SET_NFC_STAGE
} from "../reducers/nfcReducer.js";

import { strings } from '../../locales/i18n';

import {
    OpenNFCRequest,
    closeNFCRequest,
    getNFCId,
    getWrittenData,
    writeData,
    getAmountLoaded,
    incrementAmountLoaded,
    getAmountDeducted,
    incrementAmountDeducted,
    getSession,
    incrementSession
} from "../api/nfcAPI.js"

import {
    intToThreeByteArray,
    hexStringToByteArray,
    byteArrayToHexString,
    uuidv4,
    utf8ToByteArray,
    byteArrayToUtf8, padArray
} from "../utils";

import {CREATE_TRANSFER_REQUEST, REMOVE_NFC_CARD_ERROR, RESET_NEW_TRANSFER} from "../reducers/creditTransferReducer";
import {ADD_TRANSFER_TO_CACHE, REMOVE_TRANSFER_FROM_CACHE} from "../reducers/transferCacheReducer";

import {CLOSE_NFC_READ} from "../reducers/nfcReducer";
import * as RootNavigation from "../RootNavigation";
import {RECORD_NFC_CARD_ERROR} from "../reducers/creditTransferReducer";

import { loadSingleTransferCard } from "./transferCardSaga";

function* robustlyUpdateCounter(desiredValue, getter, incrementer, allowedAttempts, acceptJustACK) {

    let shortfall = yield call(getShortfall, desiredValue, getter);

    if (shortfall === 0) {
        return
    } else if (shortfall < 0) {
        throw `Overspent for ${desiredValue}`
    }

    let successfulWrite = false;
    let attempts = 0;
    console.log("preloopshortfall is", shortfall);
    while (!successfulWrite) {
        attempts += 1;
        console.log('attempting card write: ', attempts);

        let ACK = false;

        try {
            let res = yield call(incrementer, shortfall);
            ACK = res[0] === 10;  //ACK response code is binary 'A'
        } catch (error){
            console.log("Ignoring Error:", error)
        }

        try {
            shortfall = yield call(getShortfall, desiredValue, getter);
        } catch (e) {
            if (ACK && acceptJustACK) {

                //We got an Acknowledgement from the increment command, and we're allowing this as sufficient proof of
                //increment. Technically the card may to not be incremented.
                console.log("Accepting an acknowledgement only for incrementer", incrementer.name);
                console.log('acceptJustACK is', acceptJustACK)
                successfulWrite = true;
                Sentry.captureException(e);

            } else {
                Sentry.captureException(e);
                throw e
            }
        }

        if (shortfall === 0) {
            successfulWrite = true
        }

        if (!successfulWrite && attempts > allowedAttempts) {
            throw strings('NFCScreen.NFCError') // "NFC Error"
        }
    }
}

function* getShortfall(desiredValue, getter) {
    let currentValue = yield call(getter);
    return parseInt(desiredValue) - parseInt(currentValue);
}

function* makeTransfer(amountLoaded, amountDeductedOnCard, transferData, nfcId, session, userId, forgivingDeduct) {
    let chargeAmount = transferData.transfer_amount;
    let desiredDeducted = amountDeductedOnCard + chargeAmount;

    let balance = amountLoaded - amountDeductedOnCard;
    let newBalance = amountLoaded - desiredDeducted;

    console.log('Current balance:', balance);
    console.log('Target balance:', newBalance);

    if (newBalance < 0) {
        throw strings('NFCScreen.NFCBalanceError') // "Insufficient Balance"
    }

    try {
        yield call(robustlyUpdateCounter, desiredDeducted, getAmountDeducted, incrementAmountDeducted, 2, forgivingDeduct);
    } catch (e) {
        yield put({
            type: RECORD_NFC_CARD_ERROR,
            NFCSerialNumber: nfcId,
            session: session,
            amountDeducted: amountDeductedOnCard,
            transferData: transferData
        });

        Sentry.captureException(e);
        throw e
    }

    yield put({type: CHARGE_NFC_CARD_SUCCESS, nfcId: nfcId, balance: newBalance});

    let date = new Date;

    let payload = {
        body: {
            'nfc_id': nfcId,
            'qr_id': null,
            'transfer_amount': transferData.transfer_amount,
            'transfer_use': transferData.transfer_use,
            'my_transfer_account_id': transferData.my_transfer_account_id,
            'uuid': uuidv4(),
            'created': date.toISOString(),
            'inCache': true
        },
        userId: userId
    };

    yield put({type: ADD_TRANSFER_TO_CACHE, payload});

    yield put({type: CREATE_TRANSFER_REQUEST, payload});

    return newBalance
}


function* chargeNFCCard({chargeAmount, symbol}) {
    try {
        yield put({type: SET_NFC_STAGE, nfcStage: 0});


        //Remove any previous transfer failure messages
        yield put({type: RESET_NEW_TRANSFER});

        //Close previous NFC request (shouldn't exist unless there was a hard exit)
        yield call(closeNFCRequest);

        yield call(OpenNFCRequest);

        //Get public key for NFC card that was fetch from server
        const getLogin = (state) => state.login;
        const login_state = yield select(getLogin);
        let key = ec.keyFromPublic(login_state.ecdsaPublic, 'hex');


        //Since the card Id has been read, we can assume read is active
        const nfcId = yield call(getNFCId);
        yield put({type: NFC_READ_ACTIVE});

        //Check whether a load amount is stored on the vendor phone
        const getTransferCards = (state) => state.transferCards;
        const transferCards = yield select(getTransferCards);
        const cardDetailsOnPhone = transferCards.byNFCSerialNumber[nfcId];

        let validAmountLoaded = false;
        let amountLoaded = null;
        let card_symbol

        console.log("~~~NFC Trans Details~~~")
        console.log('sig validation:', login_state.supportSigValidation)
        console.log("user id:", login_state.userId)
        console.log('nfc id:', nfcId);
        console.log('card details on phone:', cardDetailsOnPhone);

        if (cardDetailsOnPhone && cardDetailsOnPhone.is_disabled) {
            //  Card is permanently disabled by setting the amount deducted and loaded to the max val (2^24) - 1
            // This will result in authentication errors being raised whenever the card is used
            // with no way to undo (for example by finding a phone with out-of-date data)
            yield call(
                robustlyUpdateCounter,
                16777215,
                getAmountLoaded,
                incrementAmountLoaded, 2, false
            );
        }

        if (login_state.supportSigValidation) {

            //Get amount loaded on card and verify signature using public key
            amountLoaded = yield call(getAmountLoaded);
            const writtenData = yield call(getWrittenData);

            const signatureArray = writtenData.slice(0,48);

            card_symbol = (byteArrayToUtf8(writtenData.slice(48,)) || "").toString();

            const signatureString = byteArrayToHexString(signatureArray);

            let signatureObject = {r: signatureString.slice(0,48), s: signatureString.slice(48,)};

            const messageHash = hash.sha1().update(nfcId+(amountLoaded).toString() + card_symbol).digest('hex');

            if (key.verify(messageHash, signatureObject)) {
                validAmountLoaded = true
            }

            yield put({type: SET_NFC_STAGE, nfcStage: 1});

            console.log('loaded amount:', amountLoaded);
            console.log('signature:', signatureString);
            console.log('signature valid:', validAmountLoaded);

            // Update Card amount loaded If:
            // - There's card details stored on the phone AND
            // - There's an amount stored on the phone that's greater than the amount on the card
            // - There's a signature error and the amount on the phone is equal to the amount on the card
            if ((cardDetailsOnPhone && cardDetailsOnPhone.amount_loaded) &&
                (cardDetailsOnPhone.amount_loaded > amountLoaded ||
                    (!validAmountLoaded && cardDetailsOnPhone.amount_loaded === amountLoaded))
            ) {


                let signatureByteArray = hexStringToByteArray(cardDetailsOnPhone.amount_loaded_signature);
                let symbolByteArray = utf8ToByteArray(cardDetailsOnPhone.symbol)

                let totalByteArray = signatureByteArray.concat(symbolByteArray)

                console.log("updating total array:", totalByteArray)

                let successful_write = false;
                let attempts = 0;

                while (!successful_write) {
                    attempts += 1;
                    console.log('attempting card write: ', attempts);

                    try {
                        for (let index = 0; index < Math.ceil(totalByteArray.length / 4); index++) {
                            let subArray = totalByteArray.slice(index * 4, index * 4 + 4);

                            subArray = padArray(subArray,4,0);

                            yield call(writeData,index + subArray, subArray)
                        }
                    } catch {

                    }
                    let newTotalArray = yield call(getWrittenData);

                    let requiredStr = byteArrayToHexString(newTotalArray);
                    let hasStr = byteArrayToHexString(newTotalArray);

                    console.log("need signature: ", requiredStr);
                    console.log("have signature: ", hasStr);

                    if (requiredStr == hasStr) {
                        successful_write = true
                    } else if (attempts > 2) {
                        throw strings('NFCScreen.NFCError') // "NFC Error"
                    }
                }

                card_symbol = cardDetailsOnPhone.symbol;

                yield put({type: SET_NFC_STAGE, nfcStage: 2});


                yield call(
                    robustlyUpdateCounter,
                    cardDetailsOnPhone.amount_loaded,
                    getAmountLoaded,
                    incrementAmountLoaded,
                    2,
                    false
                );

                amountLoaded = cardDetailsOnPhone.amount_loaded;
                validAmountLoaded = true

                yield put({type: SET_NFC_STAGE, nfcStage: 3});

            }
        } else if (cardDetailsOnPhone && cardDetailsOnPhone.amount_loaded) {
        // Signature Validation not used - just take the amount loaded according to the phone
            amountLoaded = cardDetailsOnPhone.amount_loaded;
            validAmountLoaded = true;
            card_symbol = cardDetailsOnPhone.symbol;

            console.log('loaded amount:', amountLoaded);
            yield put({type: SET_NFC_STAGE, nfcStage: 2});
        }

        if (!validAmountLoaded && !cardDetailsOnPhone) {
            //Still haven't been able to find a card - try to fetch it from the server
            //TODO: timeout protect this, consider unifying with multiload
            console.log("attempting load card")
            let foundNewCard = yield call(loadSingleTransferCard, nfcId)
            if (foundNewCard) {
                throw strings('NFCScreen.NewCardError') // 'Found  new card, please try again'
            }
        }

        if (!validAmountLoaded) {
            throw strings('NFCScreen.NFCCardError')  // "Card Authentication Error"
        }

        if (symbol && card_symbol !== symbol) {
            throw strings('NFCScreen.NFCCurrencyError', {currency: symbol.toString()}) // "Card does not have currency " + symbol.toString()
        }

        const NFCError = yield select((state) => state.creditTransfers.NFCError);

        let session = yield call(getSession);

        yield put({type: SET_NFC_STAGE, nfcStage: 3});

        let errorToResolve = NFCError.nfcSerialNumber === nfcId && NFCError.session === session;

        if (chargeAmount === 0 && ! errorToResolve) {

            let amountDeducted = yield call(getAmountDeducted);

            yield put({type: CHARGE_NFC_CARD_SUCCESS, nfcId: nfcId, balance: amountLoaded - amountDeducted});

            yield call(closeNFCRequest);

        } else {

            let amountDeducted;
            let transferData;
            if (errorToResolve) {
                console.log("running via error state")
                amountDeducted = NFCError.amountDeducted;
                transferData = NFCError.transferData;

                console.log("using card amount", amountDeducted)

                yield put({
                    type: REMOVE_NFC_CARD_ERROR,
                    NFCSerialNumber: nfcId
                })


            } else {
                console.log("running via regular state")
                amountDeducted = yield call(getAmountDeducted);
                transferData = yield select((state) => state.creditTransfers.transferData);

                session += 1;
                yield call(robustlyUpdateCounter, session, getSession, incrementSession, 2, false);
            }


            console.log("transfer data here", transferData)

            yield put({type: SET_NFC_STAGE, nfcStage: 4});

            const newBalance = yield call(
                makeTransfer,
                amountLoaded,
                amountDeducted,
                transferData,
                nfcId,
                session,
                login_state.userId,
                login_state.forgivingDeduct
            );


            if (chargeAmount !== 0) {
                //TODO: should this be a yield call?
                RootNavigation.navigate(
                    'TransferCompleteScreen',
                    {balance: newBalance, user: cardDetailsOnPhone.user}
                );
            }

        }

    } catch (error) {
        yield put({type: CHARGE_NFC_CARD_FAILURE, error: error});

    }

    yield put({type: CLOSE_NFC_READ})
}

function* cancelableChargeNFCCard({chargeAmount, symbol}) {

    const nfc_task = yield fork(chargeNFCCard, {chargeAmount, symbol});

    yield take(CLOSE_NFC_READ);

    yield cancel(nfc_task)
}


function* watchGetNFCCardBalance() {
    yield takeEvery(CHARGE_NFC_CARD_REQUEST, cancelableChargeNFCCard)
}

function* closeNFCRead() {
    try {
        yield call(closeNFCRequest);
    } catch (e) {
        console.log("Close NFC error")
        Sentry.captureException(e)
    }
    console.log('NFC request closed')
}

function* watchCloseNFCRead() {
    yield takeEvery(CLOSE_NFC_READ, closeNFCRead)
}

export default function* nfcSagas() {
    yield all([
        watchGetNFCCardBalance(),
        watchCloseNFCRead()
    ])
}
