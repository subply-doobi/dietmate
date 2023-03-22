import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {openCommonAlert} from '../stores/slices/commonAlertSlice';

interface IConvertCodeToMsg {
  [key: string]: string;
}

const convertCodeToMsg: IConvertCodeToMsg = {
  500: `서버 오류가 발생했어요. 잠시후 다시 시도해주세요\n(errorCode: 500)`,
  // 이런식으로 errorCode 마다 정리 가능
};

const getErrorMsg = (e: any) => {
  const errorCode = e.response.status;
  let errorMsg = convertCodeToMsg[errorCode] && convertCodeToMsg[errorCode];
  if (!errorMsg) errorMsg = `알수없는 오류\n(errorCode: ${errorCode})`;

  return errorMsg;
};

export const useHandleError = () => {
  const dispatch = useDispatch();
  const handleError = useCallback((e: any) => {
    const errorMsg = getErrorMsg(e);
    console.log('useHandleError: errMsg: ', errorMsg);
    dispatch(openCommonAlert(errorMsg));
  }, []);

  return handleError;
};
