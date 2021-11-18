import {all, put, select, takeEvery} from 'redux-saga/effects'
import {RESET_RESOLVE_CACHE_STATUS, RESOLVE_TRANSFER_CACHE} from "../reducers/transferCacheReducer";
import {NETWORK_STATUS} from "../reducers/networkStatusReducer";
import {CREATE_TRANSFER_REQUEST} from "../reducers/creditTransferReducer";

function* resolveTransferCache() {

    try {
        const isConnected = (state) => state.networkStatus.isConnected;
        const isConnectedState = yield select(isConnected);

        console.log("Checking for connection before resolving cache")

        if (isConnectedState) {
            console.log("Connected, resolving cache")
            const transferCache = (state) => state.transferCache.byUUID;

            const transferCacheState = yield select(transferCache);

            let uuids = Object.keys(transferCacheState);

            for (let index = 0; index < uuids.length; index++) {
                let payload = transferCacheState[uuids[index]];

                yield put({type: CREATE_TRANSFER_REQUEST, payload})
            }

        }
    } catch (e) {

    } finally {
        yield put({type: RESET_RESOLVE_CACHE_STATUS})
    }

}

function* watchNetworkStatusChange() {
    yield takeEvery(NETWORK_STATUS, resolveTransferCache);
}

function* watchResolveTransferCache() {
    yield takeEvery(RESOLVE_TRANSFER_CACHE, resolveTransferCache)
}

export default function* transferCacheSagas() {
    yield all([
        watchNetworkStatusChange(),
        watchResolveTransferCache()
    ])
}
