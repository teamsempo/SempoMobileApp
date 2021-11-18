import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const mockApi = new MockAdapter(axios);

// version API
export const version = [
    { payload: { body: { version: null } }, result: { "message": "Something went wrong.", "status": undefined } },
    { payload: { body: { version: '1.0.0' } }, result: { action: 'ok' } },
    { payload: { body: { version: '1.1.0' } }, result: { action: 'recommend' } },
    { payload: { body: { version: '2.0.0' } }, result: { action: 'force' } }
];

mockApi.onPost('https://dev.withsempo.com/api/v1/me/version/').reply((config) => {
    if (config.data === JSON.stringify(version[1].payload.body)) {
        return [200, version[1].result];
    } else if (config.data === JSON.stringify(version[2].payload.body)) {
        return [200, version[2].result]
    } else if (config.data === JSON.stringify(version[3].payload.body)) {
        return [200, version[3].result]
    }
    return [401, 'Error'];
});

// export API
mockApi.onPost('https://dev.withsempo.com/api/v1/me/export/').reply((config) => {
    if (config.data === '{"email":"francine@catmail.com"}') {
        return [200, { file_url: 'www.google.com' }];
    }
    return [401, 'Error'];
});

// feedback API
mockApi.onPost('https://dev.withsempo.com/api/v1/me/feedback/').reply((config) => {
    if (config.data === '{"question":"Hey Axios, can you trigger a failure for me? Thanks!","rating":"5","additional_information":""}') {
        return [401, 'Error'];
    }
    return [200, { message: 'Thank you for your feedback!' }];
});

// auth API
// Base valid response 
const baseAuthResponse = {
    "active_organisation_id": 1,
    "admin_tier": "sempoadmin",
    "android_intercom_hash": "pizzaburgerhotdog",
    "auth_token": "supersecretauthtoken",
    "currency_conversion_rate": 1,
    "currency_symbol": "USD",
    "default_feedback_questions": [
        "assistance_satisfaction",
        "assistance_delivery_preference"
    ],
    "denominations": {},
    "deployment_name": "demo",
    "display_decimals": 2,
    "email": "michiel@withsempo.com",
    "first_name": "Francine",
    "forgiving_deduct": false,
    "host_url": "https://demo.withsempo.com",
    "is_supervendor": false,
    "is_vendor": false,
    "kyc_active": true,
    "last_name": "Frensky",
    "message": "Successfully logged in.",
    "name": null,
    "organisations": [
        {
            "card_shard_distance": 0,
            "country_code": "US",
            "default_disbursement": 500,
            "id": 1,
            "master_wallet_balance": 100000,
            "minimum_vendor_payout_withdrawal": 0,
            "name": "TestCo",
            "primary_blockchain_address": "0xAAA0DFD1A3Fa91E8F1597388D7742A3aAAAabC02",
            "require_transfer_card": false,
            "timezone": "UTC",
            "token": {
                "address": "0xAAADF6C5ACa49c9280B31EFbdA0a8E0e3203595f",
                "created": "2020-11-23T05:14:36.159416+00:00",
                "exchange_rates": {},
                "id": 1,
                "name": "USD",
                "symbol": "USD",
                "updated": "2021-02-16T07:42:45.237412+00:00"
            },
            "updated": "2021-04-19T17:23:27.014082+00:00",
            "valid_roles": [
                "beneficiary",
                "supervendor",
                "vendor",
                "cashier",
                "token_agent",
                "group_account"
            ]
        }
    ],
    "server_time": 1635352499357,
    "status": "success",
    "transfer_account_Id": [
        2
    ],
    "transfer_usages": [
        {
            "icon": "food-apple",
            "id": 1,
            "name": "Fresh Food",
            "priority": 1,
            "translations": {
                "en": "Fresh Food"
            }
        }
    ],
    "user_id": 14
};

const auth = [
    // Valid PIN auth
    {
        payload: {
            body: {
                deviceInfo: '1234',
                phone: '+19025553223',
                region: 'CA',
                pin: '2468',
                deviceInfo: 'FrancinePhone Catphone'
            }
        },
        result: baseAuthResponse
    },
    // Valid password auth
    {
        payload: {
            body: {
                deviceInfo: '1234',
                phone: '+19025553223',
                region: 'CA',
                password: 'Fra4ncineC4t',
                deviceInfo: 'FrancinePhone Catphone'
            }
        },
        result: baseAuthResponse
    }
];

const fail = {
    "message": "Invalid username or password",
    "status": "fail"
};

// request_api_token
mockApi.onPost('https://dev.withsempo.com/api/v1/auth/request_api_token/').reply((config) => {
    if (config.data === JSON.stringify(auth[0].payload.body)) {
        return [200, auth[0].result]
    }
    else if (config.data === JSON.stringify(auth[1].payload.body)) {
        return [200, auth[0].result]
    }
    return [401, fail];
});

// refresh_api_token
mockApi.onGet('https://dev.withsempo.com/api/v1/auth/refresh_api_token/').reply((config) => {
    if (config.headers.Authorization == 'fakeAuthToken') {
        return [200, auth[0].result]
    }
    else {
        return [401, fail];
    }
});

// refresh_api_token
mockApi.onPost('https://dev.withsempo.com/api/v1/auth/reset_password/').reply((config) => {
    if (config.data === JSON.stringify({ "old_password": "oldPassword", "new_password": "newPassword" })) {
        return [200, auth[0].result]
    }
    else {
        return [401, fail];
    }
});

// transfer_cards
mockApi.onGet('https://dev.withsempo.com/api/v1/transfer_cards/').reply((config) => {
    return [200, {
        "data": {
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
    }]
});

mockApi.onGet('https://dev.withsempo.com/api/v1/transfer_cards/nfc_serial_number/123736BAE86180').reply((config) => {
    return [200, {
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
    }]
});
