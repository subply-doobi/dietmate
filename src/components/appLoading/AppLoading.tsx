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

  // react-query
  const {refetch: refetchBaseLine} = useGetBaseLine({enabled: false});
  const {data: latestAppVersion, refetch: refetchLatestVersion} =
    useGetLatestVersion({enabled: false});

  // useState
  // const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);

  // useEffect 앱 로딩
  useEffect(() => {
    const checkVersion = async () => {
      const latestVersion = (await refetchLatestVersion()).data;
      if (!latestVersion) return;
      appVersion !== latestVersion &&
        dispatch(openModal({name: 'appUpdateAlert'}));
    };

    const checkUser = async () => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      await refetchBaseLine();
    };

    const init = async () => {
      await loadSplash;

      // 앱 업데이트 확인
      await checkVersion();

      // 자동로그인 (토큰 유효성 검사)
      await checkUser();

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
          subText={`${appVersion} -> ${latestAppVersion}`}
        />
      )}
    />
  );
};

export default AppLoading;
