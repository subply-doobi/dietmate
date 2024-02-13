import {useState} from 'react';
import styled from 'styled-components/native';

import {icons} from '../../assets/icons/iconSource';
import {purposeCdToValue} from '../../constants/constants';
import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  TextSub,
  UserInfoTextInput,
} from '../../styles/styledConsts';

import DTooltip from '../common/tooltip/DTooltip';

import {useGetBaseLine} from '../../query/queries/baseLine';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {setValue} from '../../stores/slices/userInputSlice';
import {useDispatch, useSelector} from 'react-redux';
import DTextInput from '../common/textInput/DTextInput';

//mutation 넣고 계산까지
const CalChangeAlert = () => {
  // redux
  const dispatch = useDispatch();
  const {calorieChange} = useSelector((state: RootState) => state.userInput);

  // react-qeury
  const {data, isLoading} = useGetBaseLine();

  // state
  const [tooltipShow, setTooltipShow] = useState(false);

  return data ? (
    <Container>
      {/* 알럿 텍스트 */}
      <Col style={{marginTop: 24}}>
        <PurposeText>{data.userId} 님의 목표는</PurposeText>
        <PurposeText>
          <PurposeTextBold>
            "{purposeCdToValue[data.dietPurposeCd]?.targetText}"{' '}
          </PurposeTextBold>
          입니다
        </PurposeText>
      </Col>
      <Col style={{marginTop: 16, justifyContent: 'center'}}>
        <Col>
          <GuideText>계획과 다르게 진행된다면 기존보다 </GuideText>
          <GuideText>
            <GuideText style={{fontWeight: 'bold'}}>50 kcal 정도씩 </GuideText>
            높이거나 낮춰보세요
          </GuideText>
        </Col>

        {/* 툴팁 버튼 */}
        <TooltipBtn
          onPressIn={() => setTooltipShow(true)}
          onPressOut={() => setTooltipShow(false)}>
          <TooltipImage source={icons.question_24} />
        </TooltipBtn>

        {/* 툴팁 */}
        <DTooltip
          tooltipShow={tooltipShow}
          boxRight={0}
          boxBottom={40}
          triangleRight={12}
          customContent={() => (
            <Col style={{alignSelf: 'flex-start', margin: 4}}>
              <TooltipText>칼로리를 변경하시면</TooltipText>
              <TooltipText>
                영양소는 <TooltipTextBold>권장비율로 자동설정</TooltipTextBold>
                됩니다
              </TooltipText>
              <TooltipText style={{marginTop: 8}}>
                영양소 비율도 직접 정하고 싶다면
              </TooltipText>
              <TooltipText>
                <TooltipTextBold>고객정보변경</TooltipTextBold> 을 이용해주세요
              </TooltipText>
            </Col>
          )}
        />
      </Col>

      {/* 칼로리 변경 input */}
      <InputHeader isActivated={!!calorieChange.value}>
        칼로리 (kcal)
      </InputHeader>
      <DTextInput
        placeholder="칼로리(kcal)"
        value={calorieChange.value}
        onChangeText={v =>
          dispatch(setValue({name: 'calorieChange', value: v}))
        }
        isActivated={!!calorieChange.value}
        isValid={calorieChange.isValid}
        keyboardType="numeric"
        maxLength={4}
      />
      {calorieChange.errMsg && (
        <ErrorBox>
          <ErrorText>{calorieChange.errMsg}</ErrorText>
        </ErrorBox>
      )}
    </Container>
  ) : (
    <></>
  );
};

export default CalChangeAlert;

const Container = styled.View`
  padding: 0px 16px 32px 16px;
`;

const PurposeText = styled(TextMain)`
  font-size: 16px;
`;
const PurposeTextBold = styled(PurposeText)`
  font-weight: bold;
`;

const TooltipBtn = styled.Pressable`
  position: absolute;
  right: 0px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const TooltipImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const WeightDifference = styled(TextMain)`
  font-size: 18px;
  margin-top: 16px;
`;
const WeightDifferenceValue = styled(WeightDifference)`
  font-weight: bold;
`;

const GuideText = styled(TextSub)`
  font-size: 14px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;

const TooltipText = styled(TextMain)`
  font-size: 14px;
  font-weight: light;
  color: ${colors.white};
`;
const TooltipTextBold = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.white};
`;
