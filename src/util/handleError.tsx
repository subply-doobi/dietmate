import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {openCommonAlert} from '../stores/slices/commonAlertSlice';

interface IConvertCodeToMsg {
  [key: string]: string;
}

const convertCodeToMsg: IConvertCodeToMsg = {
  500: `서버 오류가 발생했어요. 잠시후 다시 시도해주세요\n(errorCode: 500)`,
  401: `다시 로그인을 해주세요`,
  // 이런식으로 errorCode 마다 정리 가능
};

const getErrorMsg = (errorCode: string) => {
  let errorMsg = convertCodeToMsg[errorCode] && convertCodeToMsg[errorCode];
  if (!errorMsg) errorMsg = `알수없는 오류\n(errorCode: ${errorCode})`;

  return errorMsg;
};

export const useHandleError = () => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const handleError = useCallback((e: any) => {
    const errorCode = e.response?.status;
    console.log('useHandleError: errorCode: ', errorCode);
    const errorMsg = getErrorMsg(errorCode);
    if (e.response?.status === '401') {
      navigate('Login');
    }

    dispatch(openCommonAlert(errorMsg));
  }, []);

  return handleError;
};
