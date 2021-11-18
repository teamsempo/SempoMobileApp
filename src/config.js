import Config from 'react-native-config';

export const DEBUG         = Config.DEBUG;
export const ENVFILE = Config.ENVFILE;
export const SEMPO_API_URL = Config.SEMPO_API_URL;
export const USE_DELEGATOR = Config.USE_DELEGATOR;
export const DELEGATOR_URL = Config.DELEGATOR_URL;
export const IPDATA_KEY    = Config.IPDATA_KEY;

console.log("Using env file:", ENVFILE);