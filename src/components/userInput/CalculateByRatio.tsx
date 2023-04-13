import React from 'react';
import styled from 'styled-components/native';
import {Controller} from 'react-hook-form';

import colors from '../../styles/colors';
import {
  ErrorBox,
  ErrorText,
  InputHeaderText,
  UserInfoTextInput,
} from '../../styles/styledConsts';
import {nutrRatioCategory, validationRules} from '../../constants/constants';
import {calculateCaloriesToNutr} from '../../util/targetCalculation';

import Dropdown from './Dropdown';

const renderCaloriePerMealInput = (
  {field: {onChange, onBlur, value}},
  handleSubmit: Function,
  calorieRecommended?: string,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>
        한 끼 칼로리 (kcal)
      </InputHeader>
      <Input
        placeholder={`한 끼 칼로리 입력 (권장: ${calorieRecommended})`}
        value={value}
        onChangeText={onChange}
        onFocus={() => handleSubmit()}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={4}
      />
    </>
  );
};

interface ICalculateByRatio {
  ratioType: string;
  calorie: string;
  setValue: any;
  control: any;
  handleSubmit: any;
  calorieRecommended: any;
  errors: any;
}
const CalculateByRatio = ({
  ratioType,
  calorie,
  setValue,
  control,
  handleSubmit,
  calorieRecommended,
  errors,
}: ICalculateByRatio) => {
  // 칼로리로 자동 계산된 각 영양성분
  const {carb, protein, fat} = calculateCaloriesToNutr(ratioType, calorie);

  return (
    <ContentContainer>
      <Dropdown
        placeholder="탄:단:지 비율"
        value={ratioType}
        setValue={setValue}
        items={nutrRatioCategory}
        reactHookFormName="ratioType"
      />
      {/* --- caloriePerMeal --- */}
      <Controller
        control={control}
        rules={validationRules.caloriePerMeal}
        render={field =>
          renderCaloriePerMealInput(field, handleSubmit, calorieRecommended)
        }
        name="caloriePerMeal"
      />

      {errors.caloriePerMeal && (
        <ErrorBox>
          <ErrorText>{errors.caloriePerMeal.message}</ErrorText>
        </ErrorBox>
      )}
      <SummaryContainer>
        <NutrientSummaryText>{`칼로리: ${
          calorie || '  '
        } kcal`}</NutrientSummaryText>
        <NutrientSummaryText>{`탄수화물: ${
          carb ? parseInt(carb) : '  '
        } g`}</NutrientSummaryText>
        <NutrientSummaryText>{`단백질: ${
          protein ? parseInt(protein) : '  '
        } g`}</NutrientSummaryText>
        <NutrientSummaryText>{`지방: ${
          fat ? parseInt(fat) : '  '
        } g`}</NutrientSummaryText>
      </SummaryContainer>
    </ContentContainer>
  );
};

export default CalculateByRatio;

const ContentContainer = styled.View`
  padding-bottom: 30px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;

const SummaryContainer = styled.View`
  margin-top: 12px;
  border-width: 1px;
  border-color: ${colors.main};
  border-radius: 5px;
  padding: 16px;
`;

const NutrientSummaryText = styled.Text`
  font-size: 12px;
  color: ${colors.textMain};
`;
