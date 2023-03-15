import axios from 'axios';
import {validateToken} from './token';

export const queryFn = async (url: string) => {
  const {isTokenValid, validToken} = await validateToken();
  if (!isTokenValid) return null;
  const requestConfig = {headers: {authorization: `Bearer ${validToken}`}};
  const res = await axios.get(url, requestConfig);

  return res.data;
};

export const mutationFn = async <T>(
  url: string,
  method: string,
  requestBody?: T,
) => {
  const {isTokenValid, validToken} = await validateToken();
  // if (!isTokenValid) return null;
  const requestConfig = {
    url,
    method,
    headers: {authorization: `Bearer ${validToken}`},
    data: requestBody,
  };
  return axios(requestConfig).then(res => res.data);
};
