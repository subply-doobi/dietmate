import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export const usePreventBackBtn = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      // 백 버튼 누름을 처리하는 사용자 정의 로직
      // 기본 동작(예: 앱 종료)을 방지하려면 true를 반환
      // 기본 동작을 허용하려면 false를 반환
      return true;
    });

    return () => {
      // 이벤트 리스너 제거됨
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
  }, []);
};
