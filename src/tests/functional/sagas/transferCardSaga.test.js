import { loadTransferCards, loadSingleTransferCard } from '../../../sagas/transferCardSaga'
import { mockApi } from '../../../../__mocks__/mockAxios';

import { expectSaga } from 'redux-saga-test-plan';
import {
    LOAD_TRANSFER_CARDS_REQUEST,
    LOAD_TRANSFER_CARDS_SUCCESS,
    LOAD_TRANSFER_CARDS_FAILURE,
    LOAD_SINGLE_TRANSFER_CARD_REQUEST,
    LOAD_SINGLE_TRANSFER_CARD_SUCCESS,
    LOAD_SINGLE_TRANSFER_CARD_FAILURE
} from '../../../reducers/transferCardReducer';

const sampleCards = {
    "transfer_cards": [
        {
            "amount_loaded": 1500200,
            "amount_loaded_signature": "06d09744441b7f1254575dd93fd3cfae678eb11d7beed7f527685ccfb9be1738d7399d887db715b8499edf95e6ee4766",
            "is_disabled": null,
            "nfc_serial_number": "123736BAE86180",
            "public_serial_number": "321347",
            "symbol": "CAD",
            "updated": "2021-11-02T00:10:13.104985+00:00",
            "user": {
                "first_name": "Francine",
                "last_name": "Meow"
            }
        },
    ]
}

describe.only('loadTransferCards', () => {
    it('Should call the API with valid data and return LOAD_TRANSFER_CARDS_SUCCESS', async () => {
        return expectSaga(loadTransferCards)
            .put({ type: LOAD_TRANSFER_CARDS_SUCCESS, result: { data: sampleCards } })
            .run();
    });
});

describe.only('loadSingleTransferCard', () => {
    it('Should call the API with valid data and return LOAD_SINGLE_TRANSFER_CARD_SUCCESS', async () => {
        const nfc_serial_number = '123736BAE86180'
        return expectSaga(loadSingleTransferCard, nfc_serial_number )
            .put({
                type: LOAD_SINGLE_TRANSFER_CARD_SUCCESS, result: {
                    "data": {
                        "transfer_card": {
                            "amount_loaded": 2500300,
                            "amount_loaded_signature": "22229748d71b7f1254575dd93fd3cfae678eb11d7beed7f527685ccfb9be1738d7399d887db715b8499edf95e6ee4766",
                            "is_disabled": null,
                            "nfc_serial_number": "123736BAE86180",
                            "public_serial_number": "891347",
                            "symbol": "CAD",
                            "updated": "2021-11-02T00:10:13.104985+00:00",
                            "user": {
                                "first_name": "Francine",
                                "last_name": "Meow"
                            }
                        }
                    },
                    "message": "Successfully loaded transfer_card"
                }
            })
            .run();
    });
});
