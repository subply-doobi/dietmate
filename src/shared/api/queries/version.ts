import axios from 'axios';
import {GET_VERSION} from '../urls';
import {IQueryOptions} from '../types/common';
import {useQuery} from '@tanstack/react-query';
import {VERSION} from '../keys';
import Config from 'react-native-config';

const requestConfig = {
  timeout: Number(Config.AXIOS_TIMEOUT),
};

const queryFn = async () => {
  const res = await axios.get(GET_VERSION, requestConfig);
  const latestVersion = res.data.appVersion.replace(/v/g, '');
  return latestVersion;
};

export const useGetLatestVersion = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<String>({
    queryKey: [VERSION],
    queryFn,
    enabled,
  });
};
