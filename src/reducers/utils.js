import merge from 'deepmerge';
import { put } from 'redux-saga/effects'

import {UPDATE_TRANSFER_ACCOUNTS} from "./transferAccountReducer";
import {UPDATE_USER_LIST} from "./userReducer";
import {UPDATE_CREDIT_TRANSFER_LIST} from "./creditTransferReducer";
import {UPDATE_TOKENS} from "./tokenReducer";
import {normalize} from "normalizr";
import {creditTransferSchema} from "../schemas";

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

export function DEEEEEEP(parent_object, child_object_to_add) {
    // update object state data with new data, while keeping untouched old data, overwrite array

    if (child_object_to_add) {
        return merge(parent_object, child_object_to_add, {arrayMerge: overwriteMerge})
    } else {
        return parent_object
    }
}

export function addCreditTransferIdsToTransferAccount(parent_object, child_object_to_add) {
    // update object state data with new data, while keeping untouched old data, merge arrays
    return merge(parent_object, child_object_to_add)
}

export function* updateStateFromData(data, schema) {

    if (Array.isArray(data)) {
        var dataList = data;
    } else {
        dataList = [data];
    }

    const normalizedData = normalize(dataList, schema);

    yield updateStateFromNormalizedData(normalizedData)
}

export function* updateStateFromNormalizedData(normalizedData) {

    let entities = normalizedData.entities;

    function* putToStateListIfEntityExists(entityName, actionType, stateNameOverride = undefined) {
        let entity = entities[entityName];
        if (entity) {
            let putObject = {
                type: actionType
            };

            putObject[stateNameOverride || entityName] = entity;

            yield put(putObject);

        }
    }

    yield putToStateListIfEntityExists('users', UPDATE_USER_LIST);

    yield putToStateListIfEntityExists('transfer_accounts', UPDATE_TRANSFER_ACCOUNTS);

    yield putToStateListIfEntityExists('tokens', UPDATE_TOKENS);

    yield putToStateListIfEntityExists('credit_transfers', UPDATE_CREDIT_TRANSFER_LIST);

    yield putToStateListIfEntityExists('credit_sends', UPDATE_CREDIT_TRANSFER_LIST, 'credit_transfers');

    yield putToStateListIfEntityExists('credit_receives', UPDATE_CREDIT_TRANSFER_LIST, 'credit_transfers');


}