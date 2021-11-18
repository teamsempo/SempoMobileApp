import { mockApi } from '../../../../__mocks__/mockAxios';
import { requestApiToken, refreshApiToken, setPINApi } from '../../../api/authAPI.js';
import { storeToken, storeHostURL } from "../../../utils";

describe('requestApiToken', () => {

    it('requestApiToken should get an auth token when using password login', () => {

        const validDeviceInfo = 'FrancinePhone Catphone'
        const validPasswordBody = {
            body: {
                deviceInfo: '1234',
                phone: '+19025553223',
                region: 'CA',
                password: 'Fra4ncineC4t',
            }
        };

        return requestApiToken(validPasswordBody, validDeviceInfo).then(result => {
            expect(result['status']).toEqual('success')
        })
    });

    it('requestApiToken should get an auth token when using PIN login', () => {

        const validDeviceInfo = 'FrancinePhone Catphone'
        const validPasswordBody = {
            body: {
                deviceInfo: '1234',
                phone: '+19025553223',
                region: 'CA',
                password: 'Fra4ncineC4t',
            }
        };

        return requestApiToken(validPasswordBody, validDeviceInfo).then(result => {
            expect(result['status']).toEqual('success')
        })
    });

});

describe('refreshApiToken', () => {
    it('Refresh token should correctly call the refresh token endpoint', () => {
        return refreshApiToken().then(result => {
            expect(result['status']).toEqual('success')
        })
    });
});

describe('setPINApi', () => {
    it('setPINApi should call the setPin endpoint!', () => {
        const validSetPinBody = {
            body: {
                old_password: "oldPassword",
                new_password: "newPassword"    
            }
        };
        
        return setPINApi(validSetPinBody).then(result => {
            expect(result['status']).toEqual('success')
        })
    });
});
