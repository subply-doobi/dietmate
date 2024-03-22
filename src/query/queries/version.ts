import axios from 'axios';
import {GET_VERSION} from './urls';

export const getLatestVersion = async () => {
  try {
    const res = await axios.get(GET_VERSION);
    const latestVersion = res.data.appVersion.replace(/v/g, '');
    return {latestVersion};
  } catch (e) {
    console.log('getLatestVersion: ', e);
  }
};
