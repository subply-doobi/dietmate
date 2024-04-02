import styled from 'styled-components/native';
import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {TextMain, Col} from '../../shared/ui/styledConsts';
import {
  initializeNotShowAgainList,
  removeToken,
} from '../../shared/utils/asyncStorage';
import {useDeleteUser} from '../../shared/api/queries/member';

import colors from '../../shared/colors';
import {useNavigation} from '@react-navigation/native';
import DAlert from '../../components/common/alert/DAlert';
import {initializeInput} from '../../features/reduxSlices/userInputSlice';
import PageBtn from '../mypage/ui/PageBtn';
import {queryClient} from '../../app/store/reactQueryStore';

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
  // redux
  const dispatch = useDispatch();

  // useState
  const [isAlert, setIsAlert] = useState(false);

  // navigation
  const {reset} = useNavigation();
  const deleteUser = useDeleteUser();

  // etc

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
  const onWithdrawal = async () => {
    try {
      setIsAlert(false);
      deleteUser.mutate();
      queryClient.clear();
      await initializeNotShowAgainList();
      dispatch(initializeInput());
      await removeToken();
    } catch (e) {
      console.log(e);
    }
  };

  // btns
  const accountBtns = [
    {
      title: '로그아웃',
      btnId: 'logout',
      onPress: () => onLogout(),
    },
    {
      title: '계정삭제',
      btnId: 'withdrawal',
      onPress: () => setIsAlert(true),
    },
  ];

  //회원탈퇴 alert
  const WithdrawalAlert = () => {
    return (
      <DAlert
        alertShow={isAlert}
        renderContent={() => (
          <WithdrawalContent deleteText={'계정을 삭제합니다'} />
        )}
        onConfirm={() => onWithdrawal()}
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
      <PageBtn btns={accountBtns} />
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

const AlertText = styled(TextMain)`
  font-size: 16px;
`;
