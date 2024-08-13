import styled from 'styled-components/native';

import {icons} from '../../../shared/iconSource';
import colors from '../../../shared/colors';
import {
  AccordionContentContainer,
  BtnCTA,
  HorizontalSpace,
  Row,
  TextMain,
} from '../../../shared/ui/styledComps';
import {useDispatch, useSelector} from 'react-redux';
import {setValue} from '../../../features/reduxSlices/userInputSlice';
import {RootState} from '../../../app/store/reduxStore';

const PaymentMethod = () => {
  // redux
  const {paymentMethod} = useSelector(
    (rootstate: RootState) => rootstate.userInput,
  );
  const dispatch = useDispatch();

  return (
    <AccordionContentContainer>
      {/* 다른 결제방법은 추후 추가 */}
      <KakaoPayBtn
        btnStyle="border"
        isActive={paymentMethod.value === 'kakao'}
        onPress={() =>
          dispatch(setValue({name: 'paymentMethod', value: 'kakao'}))
        }>
        <Row>
          <KakaoLogo
            source={icons.kakaoPay}
            style={{opacity: paymentMethod.value === 'kakao' ? 1 : 0.2}}
          />
          <PayBtnText isActive={paymentMethod.value === 'kakao'}>
            카카오페이
          </PayBtnText>
        </Row>
      </KakaoPayBtn>
      <HorizontalSpace height={16} />
      <CommonPayBtn
        btnStyle={paymentMethod.value === 'smartro' ? 'borderActive' : 'border'}
        onPress={() =>
          dispatch(setValue({name: 'paymentMethod', value: 'smartro'}))
        }>
        <Row>
          <PayBtnText isActive={paymentMethod.value === 'smartro'}>
            일반결제
          </PayBtnText>
        </Row>
      </CommonPayBtn>
      <GuideText>
        다른 결제수단은 <BoldText>정식출시</BoldText>를 조금만 기다려주세요
      </GuideText>
    </AccordionContentContainer>
  );
};

export default PaymentMethod;

const KakaoPayBtn = styled(BtnCTA)<{isActive: boolean}>`
  height: 48px;
  border-color: ${({isActive}) =>
    isActive ? `${colors.kakaoColor}` : `${colors.inactivated}`};
`;

const CommonPayBtn = styled(BtnCTA)`
  height: 48px;
`;
const PayBtnText = styled(TextMain)<{isActive: boolean}>`
  font-size: 16px;
  margin-left: 8px;
  line-height: 20px;
  opacity: ${({isActive}) => (isActive ? 1 : 0.5)};
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
