import axios from 'axios'
import {getIPAddress, getToken, getHostURL} from '../utils'

import {SEMPO_API_URL, DELEGATOR_URL, USE_DELEGATOR} from '../config';

export const requestApiToken = ({body}, deviceInfo) => {

    if (USE_DELEGATOR == 1) {
        var endpoint = DELEGATOR_URL
    } else {
        endpoint = SEMPO_API_URL + '/api/v1/auth/request_api_token/'
    }

    console.log('endpoint is', endpoint);

    body['deviceInfo'] = deviceInfo;  // appends device info to object

    return axios(endpoint, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'post',
        data: JSON.stringify(body),
    }).then(function (response) {
        return response.data
    }).catch(error => {
        console.log('error is', error)
        throw error;
    });
};

export const refreshApiToken = async () => {
    return axios(await getHostURL() + '/api/v1/auth/refresh_api_token/', {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json'
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

export const setPINApi = async ({body}) => {
    return axios(await getHostURL() + '/api/v1/auth/reset_password/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(body)
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};
