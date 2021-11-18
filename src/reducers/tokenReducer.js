import { combineReducers } from 'redux';
import {DEEEEEEP} from "./utils";

export const UPDATE_TOKENS = "UPDATE_TOKENS";

const byId = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_TOKENS:
            return DEEEEEEP(state, action.tokens);

        default:
            return state;
    }
};

export const tokens = combineReducers({
    byId
});
