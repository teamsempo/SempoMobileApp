export const NETWORK_STATUS = 'NETWORK_STATUS';

const initialNetworkStatus = {
    isConnected: true,
};

export const networkStatus = (state = initialNetworkStatus, action) =>  {
    switch (action.type) {
        case NETWORK_STATUS:
            console.log(action);
            return {...state, isConnected: action.isConnected};
        default:
            return state;
    }
};

// ACTIONS
export const setNetworkStatus = (isConnected) => (
    {
        type: NETWORK_STATUS,
        isConnected
    }
);