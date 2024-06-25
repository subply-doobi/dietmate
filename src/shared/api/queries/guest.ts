import {useQuery} from '@tanstack/react-query';
import {IGetGuestYnData} from '../types/guest';
import {GET_GUEST_YN} from '../urls';
import axios from 'axios';
import {AXIOS_TIMEOUT} from '../../constants';

const queryFnGetGuestYn = async () => {
  const requestConfig = {
    timeout: AXIOS_TIMEOUT,
  };
  try {
    const res = await axios.get(GET_GUEST_YN, requestConfig);
    return res.data;
  } catch (e) {
    console.log('queryFnGetGuestYn: ', e);
  }
  return {enableYn: 'N'};
};

export const useGetGuestYn = () => {
  return useQuery<IGetGuestYnData>({
    queryKey: [GET_GUEST_YN],
    queryFn: () => queryFnGetGuestYn(),
    retry: 1,
  });
};
