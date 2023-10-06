import {logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';

import {HorizontalLine, TextMain} from '../../styles/StyledConsts';

import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';
import {useNavigation} from '@react-navigation/native';
import {removeToken} from '../../util/asyncStorage';

const Account = () => {
  // navigation
  const {reset} = useNavigation();

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

  return (
    <Container>
      <PageBtn onPress={onLogout}>
        <PageBtnText>로그아웃</PageBtnText>
        <RightArrow source={icons.arrowRight_20} />
      </PageBtn>
      <HorizontalLine />
    </Container>
  );
};

export default Account;

const Container = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
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
