import axios from 'axios';
import {GET_VERSION} from '../urls';
import {AXIOS_TIMEOUT} from '../../constants';

const requestConfig = {
  timeout: AXIOS_TIMEOUT,
};

export const getLatestVersion = async () => {
  try {
    const res = await axios.get(GET_VERSION, requestConfig);
    const latestVersion = res.data.appVersion.replace(/v/g, '');
    return latestVersion;
  } catch (e) {
    console.log('getLatestVersion: ', e);
  }
};
