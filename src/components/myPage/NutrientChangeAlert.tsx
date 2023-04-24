import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {Controller} from 'react-hook-form';

import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  TextSub,
  UserInfoTextInput,
} from '../../styles/StyledConsts';
import {validationRules} from '../../constants/constants';
import {IFormField} from '../../constants/constants';

const renderNutrInput = (
  {field: {onChange, value}}: IFormField,
  nutrText: string,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>{nutrText}</InputHeader>
      <Input
        placeholder={nutrText}
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={3}
      />
    </>
  );
};

const NutrChangeAlert = ({
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
  useEffect(() => {
    handleSubmit(() => {})();
  }, []);
  const nutrTextByNutr: {[key: string]: string} = {
    carb: '탄수화물 (g)',
    protein: '단백질 (g)',
    fat: '지방 (g)',
  };
  const nutrText = nutrTextByNutr[type];
  return (
    <Container>
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
      <Controller
        control={control}
        rules={validationRules[type + 'Manual']} // validationRules가 "calManual" 이렇게 정리되어있음
        render={field => renderNutrInput(field, nutrText)}
        name={type}
      />
      {errors[type] && (
        <ErrorBox>
          <ErrorText>{errors[type].message}</ErrorText>
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
const Input = styled(UserInfoTextInput)``;
