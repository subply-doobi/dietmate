import styled from 'styled-components/native';

import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  TextSub,
  UserInfoTextInput,
} from '../../../shared/ui/styledConsts';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';
import {setValue} from '../../../features/reduxSlices/userInputSlice';
import DTextInput from '../../../components/common/textInput/DTextInput';

const nutrTextByNutr: {[key: string]: string} = {
  carbChange: '탄수화물 (g)',
  proteinChange: '단백질 (g)',
  fatChange: '지방 (g)',
};

const NutrChangeAlert = ({
  type,
}: {
  type: 'calorieChange' | 'carbChange' | 'proteinChange' | 'fatChange';
}) => {
  // redux
  const dispatch = useDispatch();
  const userInputState = useSelector((state: RootState) => state.userInput);

  // etc
  const nutrText = nutrTextByNutr[type];
  return (
    <Container>
      {/* 알럿 메시지 */}
      <Col style={{marginTop: 24}}>
        <GuideText>
          다른 영양소는{' '}
          <GuideText style={{fontWeight: 'bold'}}>목표 칼로리</GuideText>에 맞춰
        </GuideText>
        <GuideText>
          <GuideText style={{fontWeight: 'bold'}}>자동으로 조절</GuideText>
          됩니다
        </GuideText>
      </Col>
      <Col style={{marginTop: 16}}>
        <GuideTextSub>모든 영양소를 수정하고 싶은 경우는</GuideTextSub>
        <GuideTextSub>
          <GuideTextSub style={{fontWeight: 'bold'}}>고객정보변경</GuideTextSub>
          을 이용해주세요
        </GuideTextSub>
      </Col>

      {/* 영양 변경 input */}
      <InputHeader isActivated={!!userInputState[type].value}>
        {nutrText}
      </InputHeader>
      <DTextInput
        placeholder={nutrText}
        value={userInputState[type].value}
        onChangeText={v => dispatch(setValue({name: type, value: v}))}
        isActivated={!!userInputState[type].value}
        isValid={userInputState[type].isValid}
        keyboardType="numeric"
        maxLength={3}
      />
      {userInputState[type].errMsg && (
        <ErrorBox>
          <ErrorText>{userInputState[type].errMsg}</ErrorText>
        </ErrorBox>
      )}
    </Container>
  );
};

export default NutrChangeAlert;

const Container = styled.View`
  padding: 0px 16px 32px 16px;
`;

const GuideText = styled(TextMain)`
  font-size: 16px;
`;
const GuideTextSub = styled(TextSub)`
  font-size: 16px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
