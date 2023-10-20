import {logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import {Linking} from 'react-native';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {HorizontalLine, TextMain, Col} from '../../styles/StyledConsts';
import {removeToken} from '../../util/asyncStorage';
import {useDeleteProfile} from '../../query/queries/member';
import {resetUserInfo} from '../../stores/slices/userInfoSlice';

import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';
import {useNavigation} from '@react-navigation/native';
import DAlert from '../../components/common/alert/DAlert';
import {queryClient} from '../../query/store';

const WithdrawalContent = ({deleteText}: {deleteText: string}) => {
  return (
    <WithdrawalContainer>
      <Col style={{marginTop: 28, alignItems: 'center'}}>
        <AlertText>{deleteText}</AlertText>
      </Col>
    </WithdrawalContainer>
  );
};

const Account = () => {
  // useState
  const [isAlert, setIsAlert] = useState(false);
  // navigation
  const {reset} = useNavigation();
  const deleteUser = useDeleteProfile();
  // PRIVACY URL
  const PRIVACY_URL = 'https://sites.google.com/view/dietmate-privacypolicy/';
  const link = () => {
    Linking.openURL(PRIVACY_URL);
  };
  // redux
  const dispatch = useDispatch();
  // logout Fn
  const onLogout = async () => {
    try {
      await removeToken();
      reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (e) {
      console.log(e);
    }
  };
  //회원탈퇴 Fn
  const onWithdrawal = () => {
    removeToken();
  };
  //개인정보처리방침 Fn
  const onPrivacyPolicy = () => {
    link();
  };
  //회원탈퇴 alert
  const WithdrawalAlert = () => {
    return (
      <DAlert
        alertShow={isAlert}
        renderContent={() => (
          <WithdrawalContent deleteText={'계정을 삭제합니다'} />
        )}
        onConfirm={() => {
          deleteUser.mutate();
          // dispatch(resetUserInfo());
          reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }}
        onCancel={() => {
          setIsAlert(false);
        }}
        confirmLabel={'삭제'}
        NoOfBtn={2}
      />
    );
  };
  return (
    <Container>
      <PageBtn onPress={onPrivacyPolicy}>
        <PageBtnText>개인정보처리방침</PageBtnText>
        <RightArrow source={icons.arrowRight_20} />
      </PageBtn>
      <HorizontalLine />
      <PageBtn onPress={onLogout}>
        <PageBtnText>로그아웃</PageBtnText>
        <RightArrow source={icons.arrowRight_20} />
      </PageBtn>
      <HorizontalLine />
      <PageBtn
        onPress={() => {
          setIsAlert(true);
        }}>
        <PageBtnText>계정삭제</PageBtnText>
        <RightArrow source={icons.arrowRight_20} />
      </PageBtn>
      <HorizontalLine />
      <WithdrawalAlert />
    </Container>
  );
};

export default Account;

const Container = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;
const WithdrawalContainer = styled.View`
  padding: 0px 16px 24px 16px;
`;
const PageBtn = styled.TouchableOpacity`
  width: 100%;
  height: 58px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PageBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const RightArrow = styled.Image`
  width: 20px;
  height: 20px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
`;