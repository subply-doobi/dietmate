// 3rd library
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

// doobi util
import {openCommonAlert} from '../stores/slices/commonAlertSlice';
import {queryClient} from '../query/store';

// doobi Component

// 에러 코드별 메시지 //
interface IConvertCodeToMsg {
  [key: number]: string;
}
export const convertCodeToMsg: IConvertCodeToMsg = {
  500: `서버 오류가 발생했어요. 잠시후 다시 시도해주세요\n(errorCode: 500)`,
  401: `다시 로그인을 해주세요`,
};

// const invalidateAllQueries = () => {
//   queryClient.invalidateQueries();
// };

// 에러 코드별 실행 로직 //
interface IErrorActionByCode {
  [key: number]: Function;
}
// TBD | 일단 다 로그인 창으로 이동시키고 나중에 분리
export const errorActionByCode: IErrorActionByCode = {
  500: (navigate: Function) => {
    // reset();
    navigate('Login');
    // invalidateAllQueries();
  },
  405: (navigate: Function) => {
    navigate('Login');
    // invalidateAllQueries();
  },
  401: (navigate: Function) => {
    navigate('Login');
    // invalidateAllQueries();
  },
  400: (navigate: Function) => {
    navigate('Login');
    // invalidateAllQueries();
  },
};

export const useHandleError = () => {
  const dispatch = useDispatch();
  const handleError = useCallback((error: any) => {
    const errorCode = error.response?.status;
    console.log('handleError.tsx:', errorCode);
    dispatch(openCommonAlert(errorCode));
  }, []);

  return handleError;
};
