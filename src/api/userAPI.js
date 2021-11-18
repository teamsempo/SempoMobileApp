import axios from 'axios'
import { getToken, getHostURL, generateQueryString } from '../utils'

// Load user info
export const loadUserAPI = async () => {
    return axios(await getHostURL()  + '/api/v1/me/' , {
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

// Get a balance from a public serial number (QR code)
export const loadUserFromPublicSerialNumber = async ({query}) => {
    if (query) {
        const query_string = generateQueryString(query);
        var URL = `/api/v1/user/${query_string}`;
    } else {
        URL = '/api/v1/user/';
    }

    return axios(await getHostURL()  + URL , {
        headers: {
            'Authorization': await getToken(),
        },
        method: 'GET',
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};