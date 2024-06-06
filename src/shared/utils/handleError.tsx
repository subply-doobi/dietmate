// doobi util
import {openCommonAlert} from '../../features/reduxSlices/commonAlertSlice';
import {store} from '../../app/store/reduxStore';

// doobi Component

// 임시 에러 코드별 메시지 //
interface IConvertCodeToMsg {
  [key: number]: string;
}
export const convertCodeToMsg: IConvertCodeToMsg = {
  520: `알수없는 오류. 지속되면 문의 바랍니다\n(errorCode: 520)`,
  500: `서버 오류가 발생했어요. 종료후 다시 시도해주세요\n(errorCode: 500)`,
  401: `다시 로그인을 해주세요\n(errorCode: 401)`,
  405: `다시 로그인을 해주세요\n(errorCode: 405)`,
  400: `다시 로그인을 해주세요\n(errorCode: 400)`,
};

// 에러 코드별 실행 로직 //
interface IErrorActionByCode {
  [key: number]: Function;
}
// TBD | 일단 다 로그인 창으로 이동시키고 필요하면 분리
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

// 에러 핸들러 //
export const handleError = (
  error: Error,
  from?: String | undefined | unknown,
) => {
  const errorCode =
    error.name === 'AxiosError' ? Number(error.message.slice(-3)) : 520;

  // 현재 로그인 화면인 경우를 제외하고 에러코드에 따른 알림창을 띄우기
  from !== 'Login' && store.dispatch(openCommonAlert(errorCode));
};
