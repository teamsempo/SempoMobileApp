import axios from 'axios'
import {getToken, handleResponse, getHostURL, generateQueryString} from '../utils'

// newTransferAPI Call
export const newTransferAPI = async ({body}) => {
    return axios(await getHostURL() + '/api/v1/me/credit_transfer/', {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(body)
    }).then(response => {
        return handleResponse(response)
    }).catch(error => {
        throw error;
    })
};

// Load user info
export const loadTransfersAPI = async ({query}) => {

    if (query) {
        const query_string = generateQueryString(query);
        var URL = `/api/v1/me/credit_transfer/${query_string}`;
    } else {
        URL = '/api/v1/me/credit_transfer/';
    }

    return axios(await getHostURL()  + URL , {
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