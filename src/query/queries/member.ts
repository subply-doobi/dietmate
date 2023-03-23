import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

import {validateToken} from './token';
import {TUserInfo} from '../types/member';
import {queryFn} from './requestFn';

import {GET_USER} from './urls';

export const getUserInfo = async () => {
  const {validToken} = await validateToken();
  const res = await axios.get<TUserInfo>(`${GET_USER}`, {
    headers: {authorization: `Bearer ${validToken}`},
  });

  return res.data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: [GET_USER],
    queryFn: () => queryFn(GET_USER),
  });
};
