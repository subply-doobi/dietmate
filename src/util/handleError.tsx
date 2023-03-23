// 3rd library
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

// doobi util
import {openCommonAlert} from '../stores/slices/commonAlertSlice';

// doobi Component

// 에러 코드별 메시지 //
interface IConvertCodeToMsg {
  [key: number]: string;
}
export const convertCodeToMsg: IConvertCodeToMsg = {
  500: `서버 오류가 발생했어요. 잠시후 다시 시도해주세요\n(errorCode: 500)`,
  401: `다시 로그인을 해주세요`,
};

// 에러 코드별 실행 로직 //
interface IErrorActionByCode {
  [key: number]: Function;
}
export const errorActionByCode: IErrorActionByCode = {
  500: (navigate: Function) => {},
  401: (navigate: Function) => {
    navigate('Login');
  },
};

export const useHandleError = () => {
  const dispatch = useDispatch();
  const handleError = useCallback((e: any) => {
    const errorCode = e.response?.status;
    dispatch(openCommonAlert(errorCode));
  }, []);

  return handleError;
};
