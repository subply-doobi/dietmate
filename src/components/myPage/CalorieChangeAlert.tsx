import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Controller} from 'react-hook-form';

import {icons} from '../../assets/icons/iconSource';
import {
  DALERT_WIDTH,
  IFormField,
  purposeCdToValue,
  validationRules,
} from '../../constants/constants';
import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  TextSub,
  UserInfoTextInput,
} from '../../styles/styledConsts';

import DTooltip from '../common/DTooltip';

import {useGetBaseLine} from '../../query/queries/baseLine';
import colors from '../../styles/colors';

const renderCalorieInput = ({field: {onChange, value}}: IFormField) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>
        칼로리 (kcal)
      </InputHeader>
      <Input
        placeholder="칼로리(kcal)"
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={4}
      />
    </>
  );
};

//mutation 넣고 계산까지
const CalChangeAlert = ({
  type,
  control,
  handleSubmit,
  errors,
}: {
  type: string;
  control: any;
  handleSubmit: Function;
  errors: any;
}) => {
  // redux
  const {data, isLoading} = useGetBaseLine();
  useEffect(() => {
    handleSubmit(() => {})();
  }, []);

  // state
  const [tooltipShow, setTooltipShow] = useState(false);

  return data ? (
    <Container>
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
          <GuideText>계획과 다르다면 기존보다 </GuideText>
          <GuideText>
            <GuideText style={{fontWeight: 'bold'}}>50 kcal 정도씩 </GuideText>
            높이거나 낮춰보세요
          </GuideText>
        </Col>
        <TooltipBtn
          onPressIn={() => setTooltipShow(true)}
          onPressOut={() => setTooltipShow(false)}>
          <TooltipImage source={icons.question_24} />
        </TooltipBtn>
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
      <Controller
        control={control}
        rules={validationRules.caloriePerMeal}
        render={field => renderCalorieInput(field)}
        name="calorie"
      />
      {errors.calorie && (
        <ErrorBox>
          <ErrorText>{errors.calorie.message}</ErrorText>
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
const Input = styled(UserInfoTextInput)``;

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
