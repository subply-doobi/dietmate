// RN
import {useEffect, useState} from 'react';

// 3rd
import BootSplash from 'react-native-bootsplash';

// doobi
import {RootState, store} from '../../app/store/reduxStore';
import {version as appVersion} from '../../../package.json';
import {useGetLatestVersion} from '../../shared/api/queries/version';
import {getNotShowAgainList} from '../../shared/utils/asyncStorage';
import {setTutorialStart} from '../../features/reduxSlices/commonSlice';
import {
  APP_STORE_URL,
  IS_ANDROID,
  PLAY_STORE_URL,
} from '../../shared/constants';
import {link} from '../../shared/utils/linking';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../common/alert/CommonAlertContent';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {validateToken} from '../../shared/api/queries/token';
import {useDispatch, useSelector} from 'react-redux';
import {openModal, closeModal} from '../../features/reduxSlices/modalSlice';
import {navigateByUserInfo} from '../../shared/utils/navigateByUserInfo';
import {useNavigation} from '@react-navigation/native';
import {checkIsUpdateNeeded} from '../../shared/utils/versionCheck';

const loadSplash = new Promise(resolve =>
  setTimeout(() => {
    return resolve('loaded');
  }, 2000),
);

const AppLoading = () => {
  // redux
  const dispatch = useDispatch();
  const appUpdateAlert = useSelector(
    (state: RootState) => state.modal.modal.appUpdateAlert,
  );

  const navigation = useNavigation();

  // react-query
  const {refetch: refetchBaseLine} = useGetBaseLine({enabled: false});
  const {data: latestAppVersion, refetch: refetchLatestVersion} =
    useGetLatestVersion({enabled: false});

  // useEffect 앱 로딩
  // 1. 스플래시 노출 2.앱 버전 확인 3. 자동로그인 4. 튜토리얼 모드 확인 5. 스플래시 숨김
  useEffect(() => {
    const checkIsUpToDate = async () => {
      const latestVersion = (await refetchLatestVersion()).data;
      if (!latestVersion) return false;

      const {isUpdateNeeded, message} = checkIsUpdateNeeded({
        appVersion: appVersion,
        latestVersion: latestVersion,
      });
      console.log('appVersion:', appVersion, 'latestVersion:', latestVersion);
      console.log('message:', message);

      if (!isUpdateNeeded) return true;
      dispatch(openModal({name: 'appUpdateAlert'}));
      return false;
    };

    const autoLogin = async (isAppUpToDate: boolean) => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      const baseLineData = await refetchBaseLine().then(res => res.data);
      baseLineData &&
        isAppUpToDate &&
        navigateByUserInfo(baseLineData, navigation);
    };

    const init = async () => {
      await loadSplash;

      // 앱 업데이트 확인
      const isUpToDate = await checkIsUpToDate();

      // 자동로그인 (토큰 유효성 검사 및 )
      await autoLogin(isUpToDate);

      // 튜토리얼 모드 확인
      const isTutorialMode = !(await getNotShowAgainList()).tutorial;
      isTutorialMode && store.dispatch(setTutorialStart());
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);

  // etc
  const visitStore = () => {
    IS_ANDROID ? link(PLAY_STORE_URL) : link(APP_STORE_URL);
    dispatch(closeModal({name: 'appUpdateAlert'}));
  };

  return (
    <DAlert
      alertShow={appUpdateAlert.isOpen}
      onConfirm={() => visitStore()}
      onCancel={() => dispatch(closeModal({name: 'appUpdateAlert'}))}
      NoOfBtn={2}
      confirmLabel="업데이트"
      renderContent={() => (
        <CommonAlertContent
          text="앱 업데이트가 필요합니다"
          subText={`현재버전: ${appVersion}\n최신버전: ${latestAppVersion}`}
        />
      )}
    />
  );
};

export default AppLoading;
