import axios from 'axios'
import { getToken, handleResponse, getHostURL } from '../utils'

export const loadTransferCardsAPI = async () => {
    return axios(await getHostURL()  + '/api/v1/transfer_cards/' , {
        headers: {
            'Authorization': await getToken(),
        },
        method: 'get',
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};

export const loadSingleTransferCardAPI = async (nfc_serial_number) => {
    return axios(await getHostURL()  + `/api/v1/transfer_cards/nfc_serial_number/${nfc_serial_number}` , {
        headers: {
            'Authorization': await getToken(),
        },
        method: 'get',
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};
