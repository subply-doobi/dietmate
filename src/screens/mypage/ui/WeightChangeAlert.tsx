import React from 'react';
import styled from 'styled-components/native';

import {icons} from '../../../shared/iconSource';
import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  Row,
  TextMain,
  TextSub,
} from '../../../shared/ui/styledComps';
import {useDispatch, useSelector} from 'react-redux';
import {setValue} from '../../../features/reduxSlices/userInputSlice';
import {RootState} from '../../../app/store/reduxStore';
import DTextInput from '../../../shared/ui/DTextInput';

const WeightChangeAlert = ({
  autoCalculate,
  setAutoCalculate,
}: {
  autoCalculate: boolean;
  setAutoCalculate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // redux
  const dispatch = useDispatch();
  const {weightChange} = useSelector((state: RootState) => state.userInput);

  return (
    <Container>
      {/* 몸무게 변경 input */}
      <DTextInput
        headerText="몸무게 (kg)"
        placeholder="몸무게 (kg)"
        value={weightChange.value}
        onChangeText={v => dispatch(setValue({name: 'weightChange', value: v}))}
        isActive={!!weightChange.value}
        isValid={weightChange.isValid}
        keyboardType="numeric"
        maxLength={3}
      />
      {weightChange.errMsg && (
        <ErrorBox>
          <ErrorText>{weightChange.errMsg}</ErrorText>
        </ErrorBox>
      )}

      {/* autoCalculate 버튼 */}
      <Row style={{marginTop: 24, alignItems: 'flex-start'}}>
        <CheckboxContainer onPress={() => setAutoCalculate(check => !check)}>
          {autoCalculate ? (
            <Checkbox source={icons.checkboxCheckedMain_24} />
          ) : (
            <Checkbox source={icons.checkbox_24} />
          )}
        </CheckboxContainer>
        <Col style={{marginLeft: 10}}>
          <CheckboxText>변경한 몸무게로 칼로리 자동조정</CheckboxText>
          <GuideText>영양소는 권장비율로 설정됩니다</GuideText>
        </Col>
      </Row>
    </Container>
  );
};

export default WeightChangeAlert;

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const CheckboxContainer = styled.TouchableOpacity``;
const Checkbox = styled.Image`
  width: 24px;
  height: 24px;
`;
const CheckboxText = styled(TextMain)`
  font-size: 16px;
`;

const GuideText = styled(TextSub)`
  font-size: 12px;
  margin-top: 4px;
`;
