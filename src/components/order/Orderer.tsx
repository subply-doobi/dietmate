import styled from 'styled-components/native';

import {
  AccordionContentContainer,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  UserInfoTextInput,
} from '../../styles/styledConsts';
import {useDispatch, useSelector} from 'react-redux';
import {setValue} from '../../stores/slices/userInputSlice';
import {RootState} from '../../stores/store';
import DTextInput from '../common/textInput/DTextInput';

const Orderer = () => {
  const dispatch = useDispatch();
  const {buyerName, buyerTel} = useSelector(
    (state: RootState) => state.userInput,
  );
  return (
    <AccordionContentContainer>
      {/* orderer */}
      <InputHeader style={{marginTop: 0}} isActivated={!!buyerName.value}>
        주문자
      </InputHeader>
      <DTextInput
        placeholder={'주문자'}
        value={buyerName.value}
        onChangeText={v => dispatch(setValue({name: 'buyerName', value: v}))}
        isActivated={!!buyerName.value}
        keyboardType="default"
      />
      {buyerName.errMsg && (
        <ErrorBox>
          <ErrorText>{buyerName.errMsg}</ErrorText>
        </ErrorBox>
      )}

      {/* ordererContact */}
      <InputHeader isActivated={!!buyerTel.value}>휴대전화</InputHeader>
      <DTextInput
        placeholder={'휴대전화'}
        value={buyerTel.value}
        onChangeText={v => dispatch(setValue({name: 'buyerTel', value: v}))}
        isActivated={!!buyerTel.value}
        maxLength={13}
        keyboardType="number-pad"
      />
      {buyerTel.errMsg && (
        <ErrorBox>
          <ErrorText>{buyerTel.errMsg}</ErrorText>
        </ErrorBox>
      )}
    </AccordionContentContainer>
  );
};

export default Orderer;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
