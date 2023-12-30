// 3rd library
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

// doobi util
import {openCommonAlert} from '../stores/slices/commonAlertSlice';
import {queryClient} from '../query/store';

// doobi Component

// 임시 에러 코드별 메시지 //
interface IConvertCodeToMsg {
  [key: number]: string;
}
export const convertCodeToMsg: IConvertCodeToMsg = {
  520: `알수없는 오류. 지속되면 문의 바랍니다\n(errorCode: 520)`,
  500: `서버 오류가 발생했어요. 종료후 다시 시도해주세요\n(errorCode: 500)`,
  401: `다시 로그인을 해주세요`,
  405: `다시 로그인을 해주세요`,
  400: `다시 로그인을 해주세요`,
};

// 에러 코드별 실행 로직 //
interface IErrorActionByCode {
  [key: number]: Function;
}
// TBD | 일단 다 로그인 창으로 이동시키고 나중에 분리
export const errorActionByCode: IErrorActionByCode = {
  500: (reset: Function) => {
    // reset();
    reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  },
  405: (reset: Function) => {
    reset({
      index: 0,
      route: [{name: 'Login'}],
    });
  },
  401: (reset: Function) => {
    reset({
      index: 0,
      route: [{name: 'Login'}],
    });
  },
  400: (reset: Function) => {
    reset({
      index: 0,
      route: [{name: 'Login'}],
    });
  },
};
``;
export const useHandleError = () => {
  const dispatch = useDispatch();
  const handleError = useCallback((error: any) => {
    const errorCode = error.response?.status ? error.response?.status : 520;
    console.log('handleError.tsx:', errorCode);
    dispatch(openCommonAlert(errorCode));
  }, []);

  return handleError;
};
