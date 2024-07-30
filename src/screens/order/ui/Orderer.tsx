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
      <DTextInput
        placeholder={'주문자'}
        headerText="주문자"
        value={buyerName.value}
        onChangeText={v => dispatch(setValue({name: 'buyerName', value: v}))}
        isActive={!!buyerName.value}
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
      <DTextInput
        placeholder={'휴대전화'}
        headerText="휴대전화"
        value={buyerTel.value}
        onChangeText={v => dispatch(setValue({name: 'buyerTel', value: v}))}
        isActive={!!buyerTel.value}
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
