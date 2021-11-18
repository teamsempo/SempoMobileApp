import axios from 'axios'
import {getToken, getHostURL, handleResponse} from '../utils'

// Load user info
export const loadTransferAccountsAPI = async () => {
    return axios(await getHostURL()  + '/api/v1/me/transfer_account/' , {
        headers: {
            'Authorization': await getToken(),
        },
        method: 'get'
    }).then(response => {
        return handleResponse(response)
    }).catch(error => {
        throw error;
    })
};


