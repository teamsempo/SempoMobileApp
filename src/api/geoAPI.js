import axios from "axios/index";
import {IPDATA_KEY} from "../config";


export const getCountryCode = async () => {
    return axios(`https://api.ipdata.co?api-key=${IPDATA_KEY}&fields=country_code`, {
        method: 'get'
    })
        .then(function (response) {
            return response.data.country_code
        })
        .catch(error => {
            return null;
        });
};