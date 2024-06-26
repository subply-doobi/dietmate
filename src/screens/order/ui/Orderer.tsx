import styled from 'styled-components/native';

import {
  AccordionContentContainer,
  ErrorBox,
  ErrorText,
  HorizontalSpace,
  InputHeaderText,
} from '../../../shared/ui/styledComps';
import {useDispatch, useSelector} from 'react-redux';
import {setValue} from '../../../features/reduxSlices/userInputSlice';
import {RootState} from '../../../app/store/reduxStore';
import DTextInput from '../../../shared/ui/DTextInput';

const Orderer = () => {
  const dispatch = useDispatch();
  const {buyerName, buyerTel} = useSelector(
    (state: RootState) => state.userInput,
  );
  return (
    <AccordionContentContainer style={{paddingBottom: 48}}>
      {/* orderer */}
      <InputHeader style={{marginTop: 0}} isActivated={!!buyerName.value}>
        주문자
      </InputHeader>
      <DTextInput
        placeholder={'주문자'}
        value={buyerName.value}
        onChangeText={v => dispatch(setValue({name: 'buyerName', value: v}))}
        isActivated={!!buyerName.value}
        isValid={buyerName.isValid}
        keyboardType="default"
      />
      {buyerName.errMsg && (
        <ErrorBox>
          <ErrorText>{buyerName.errMsg}</ErrorText>
        </ErrorBox>
      )}

      <HorizontalSpace height={24} />

      {/* ordererContact */}
      <InputHeader isActivated={!!buyerTel.value}>휴대전화</InputHeader>
      <DTextInput
        placeholder={'휴대전화'}
        value={buyerTel.value}
        onChangeText={v => dispatch(setValue({name: 'buyerTel', value: v}))}
        isActivated={!!buyerTel.value}
        isValid={buyerTel.isValid}
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
