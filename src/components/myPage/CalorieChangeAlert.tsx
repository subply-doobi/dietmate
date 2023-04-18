import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Controller} from 'react-hook-form';

import {icons} from '../../assets/icons/iconSource';
import {
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
} from '../../styles/StyledConsts';

import DTooltip from '../common/DTooltip';

import {useGetBaseLine} from '../../query/queries/baseLine';

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
            {purposeCdToValue[data.dietPurposeCd]?.targetText}
          </PurposeTextBold>
          입니다
        </PurposeText>
      </Col>
      <WeightDifference>
        2주 전 평균:
        <WeightDifferenceValue>101</WeightDifferenceValue> kg | 현재:
        <WeightDifferenceValue>99</WeightDifferenceValue> kg
      </WeightDifference>
      <Col style={{marginTop: 8, justifyContent: 'center'}}>
        <Col>
          <GuideText>계획과 다르다면 기존보다 </GuideText>
          <GuideText>50 kcal 정도씩 조정해보세요</GuideText>
        </Col>
        <TooltipBtn
          onPressIn={() => setTooltipShow(true)}
          onPressOut={() => setTooltipShow(false)}>
          <TooltipImage source={icons.question_24} />
        </TooltipBtn>
        <DTooltip
          tooltipShow={tooltipShow}
          text={`칼로리를 변경하시면\n영양소는 권장비율에 맞춰 자동설정됩니다\n영양소 비율도 직접 정하고 싶다면\n고객정보변경을 이용해주세요`}
          boxRight={0}
          boxBottom={32}
          triangleRight={12}
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
