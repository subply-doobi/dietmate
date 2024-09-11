// 3rd
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';

// doobi util
import {store} from '../../app/store/reduxStore';
import {isAxiosError} from 'axios';
import {navigationRef} from '../../app/navigators/navigationRef';
import {queryClient} from '../../app/store/reactQueryStore';
import {setTutorialStart} from '../../features/reduxSlices/commonSlice';
import Config from 'react-native-config';
import {openModal} from '../../features/reduxSlices/modalSlice';

// 에러 -> 에러코드
// null -> 네트워크 없음
// 네트워크 연결 있는데 Network Error인 경우 -> 999 (지금은 서버 주소 바뀌었을 때 발생)
const convertErrorToCode = async (error: unknown) => {
  if (!error) return undefined;
  if (!isAxiosError(error)) return 520;
  if (
    error.message === 'Network Error' ||
    error.message === `timeout of ${Config.AXIOS_TIMEOUT}ms exceeded`
  ) {
    const isOnline = (await NetInfo.fetch()).isConnected;
    return isOnline ? 999 : null;
  }
  if (error.response) return error.response.status;
  return 520;
};

// 에러 코드별 메시지
type IErrorCode = number;
type ICodeToMsg = {
  [key: number]: string;
};
export const msgByCode: ICodeToMsg = {
  400: `다시 로그인을 해주세요\n(errorCode: 400)`,
  401: `다시 로그인을 해주세요\n(errorCode: 401)`,
  404: `다시 로그인을 해주세요\n(errorCode: 404)`,
  405: `다시 로그인을 해주세요\n(errorCode: 405)`,
  500: `서버 오류가 발생했어요\n앱을 재시작합니다\n(errorCode: 500)`,
  999: '서버 점점중입니다\n빠른 시일 내에 해결할게요',
};
const getMsgByCode = (code: IErrorCode | undefined | null) => {
  if (code === undefined) return '';
  if (code === null) return `네트워크가 불안정해요\n연결을 확인해주세요`;
  return (
    msgByCode[code] ||
    `알수없는 오류가 발생했어요\n다시 로그인을 해주세요\n(errorCode: ${code})`
  );
};

// 에러 코드별 실행 로직
type ICodeToErrorAction = {
  [key: number]: Function | null;
};
const errorActionByCode: ICodeToErrorAction = {
  999: () => {
    navigationRef.isReady() &&
      navigationRef.reset({
        index: 0,
        routes: [
          {name: 'ErrorPage', params: {errorCode: 999, msg: getMsgByCode(999)}},
        ],
      });
  },
  // TBD
};

// 에러코드 -> 액션
const runErrorActionByCode = (code: IErrorCode | undefined | null) => {
  if (code === null) {
    navigationRef.isReady() &&
      navigationRef.reset({
        index: 0,
        routes: [
          {
            name: 'ErrorPage',
            params: {errorCode: code, msg: getMsgByCode(code)},
          },
        ],
      });
    return;
  }
  // undefined -> nothing
  if (code === undefined) return;

  // 정의된 것 있는 경우
  if (errorActionByCode[code]) {
    errorActionByCode[code]();
    return;
  }
  // 정의된 것 없는 경우 ErrorAlert 띄우기
  store.dispatch(
    openModal({
      name: 'requestErrorAlert',
      values: {code: code, msg: getMsgByCode(code)},
    }),
  );
};

// 에러 핸들러
export const handleError = async (error: Error) => {
  console.log('handleError: ', error);
  const errorCode = await convertErrorToCode(error);
  console.log('errorCode: ', errorCode);
  runErrorActionByCode(errorCode);
};

// ErrorAlert 띄우는 경우 확인버튼 눌렀을 때 실행할 함수
const commonAlertAction = () => {
  // 기본: 튜토리얼모드초기화 + 로그인화면이동
  store.getState().common.isTutorialMode && store.dispatch(setTutorialStart());
  navigationRef.isReady() &&
    navigationRef.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
};

const ErrAlertActionByCode: ICodeToErrorAction = {
  500: () => {
    store.getState().common.isTutorialMode &&
      store.dispatch(setTutorialStart());
    RNRestart.Restart();
  },
  401: () => {
    commonAlertAction();
  },
};

export const runErrAlertActionByCode = (
  code: IErrorCode | undefined | null,
) => {
  if (!code) return;
  if (ErrAlertActionByCode[code]) {
    ErrAlertActionByCode[code]();
    return;
  }
  commonAlertAction();
  // queryClient.invalidateQueries();
};
