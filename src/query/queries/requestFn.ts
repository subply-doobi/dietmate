import axios from 'axios';
import {getStoredToken} from '../../util/asyncStorage';

export const queryFn = async <T>(url: string): Promise<T> => {
  const {accessToken} = await getStoredToken();
  const requestConfig = {
    headers: {authorization: `Bearer ${accessToken}`},
    timeout: 4000,
  };
  const res = await axios.get(url, requestConfig);
  return res.data;
};

export const mutationFn = async <T>(
  url: string,
  method: string,
  requestBody?: T,
) => {
  const {accessToken} = await getStoredToken();
  const requestConfig = {
    url,
    method,
    headers: {authorization: `Bearer ${accessToken}`},
    data: requestBody,
  };
  return axios(requestConfig).then(res => res.data);
};
