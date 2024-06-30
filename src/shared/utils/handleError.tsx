// doobi util
import {openCommonAlert} from '../../features/reduxSlices/commonAlertSlice';
import {store} from '../../app/store/reduxStore';
import {isAxiosError} from 'axios';

type IErrorCode = 400 | 401 | 404 | 405 | 500 | 520;

// 에러 코드 변환 //
export const convertErrorToCode = (error: Error) => {
  if (!isAxiosError(error)) {
    return 520;
  }

  if (error.message === 'Network Error') {
    return 404;
  }

  if (error.response) {
    return error.response.status;
  }

  return 520;
};

// 에러 코드별 메시지 //
type ICodeToMsg = {
  [key in IErrorCode]: string;
};
const codeToMsg: ICodeToMsg = {
  400: `다시 로그인을 해주세요\n(errorCode: 400)`,
  401: `다시 로그인을 해주세요\n(errorCode: 401)`,
  404: `서버 점점중입니다. 빠른 시일 내에 해결할게요\n(errorCode: 404)`,
  405: `다시 로그인을 해주세요\n(errorCode: 405)`,
  500: `서버 오류가 발생했어요. 종료후 다시 시도해주세요\n(errorCode: 500)`,
  520: `알수없는 오류. 지속되면 문의 바랍니다\n(errorCode: 520)`,
};

export const convertCodeToMsg = (code?: IErrorCode) => {
  const msg = !code || !codeToMsg[code] ? codeToMsg[520] : codeToMsg[code];
  return msg;
};

// 에러 코드별 실행 로직 //
type IErrorActionByCode = {
  [key in IErrorCode]: Function;
};
// TBD | 일단 다 로그인 창으로 이동시키고 필요하면 분리
export const errorActionByCode: IErrorActionByCode = {};

// 에러 핸들러 //
export const handleError = (error: Error) => {
  const errorCode = convertErrorToCode(error);

  console.log('handleError: code:', errorCode);
  // 현재 로그인 화면인 경우를 제외하고 에러코드에 따른 알림창을 띄우기
  store.dispatch(openCommonAlert(errorCode));
};
