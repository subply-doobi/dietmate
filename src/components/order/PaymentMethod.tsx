import styled from 'styled-components/native';

import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {
  AccordionContentContainer,
  BtnCTA,
  Row,
  TextMain,
} from '../../styles/styledConsts';
import {useDispatch} from 'react-redux';
import {setValue} from '../../stores/slices/userInputSlice';

const PaymentMethod = () => {
  // redux
  const dispatch = useDispatch();

  return (
    <AccordionContentContainer>
      {/* 다른 결제방법은 추후 추가 */}
      <KakaoPayBtn
        btnStyle="border"
        isActivated={true}
        onPress={() =>
          dispatch(setValue({name: 'paymentMethod', value: 'kakao'}))
        }>
        <Row>
          <KakaoLogo source={icons.kakaoPay} />
          <KakaoPayBtnText>카카오페이</KakaoPayBtnText>
        </Row>
      </KakaoPayBtn>

      <GuideText>
        다른 결제수단은 <BoldText>정식출시</BoldText>를 조금만 기다려주세요
      </GuideText>
    </AccordionContentContainer>
  );
};

export default PaymentMethod;

const KakaoPayBtn = styled(BtnCTA)`
  height: 48px;
  border-color: ${({isActivated}) =>
    isActivated ? `${colors.kakaoColor}` : `${colors.inactivated}`};
`;
const KakaoPayBtnText = styled(TextMain)`
  font-size: 16px;
  margin-left: 8px;
`;
const KakaoLogo = styled.Image`
  width: 48px;
  height: 20px;
`;
const GuideText = styled(TextMain)`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 300;
`;
const BoldText = styled(TextMain)`
  font-size: 14px;
  font-weight: 800;
`;
