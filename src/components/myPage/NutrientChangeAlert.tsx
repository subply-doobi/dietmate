import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {
  Col,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  UserInfoTextInput,
} from '../../styles/styledConsts';
import {useSelector} from 'react-redux';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {validationRules} from '../../constants/constants';
import {IFormField} from '../../constants/constants';
import {useGetBaseLine} from '../../query/queries/baseLine';

const renderNutrInput = (
  {field: {onChange, onBlur, value}}: IFormField,
  nutrText: string,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>
        {nutrText} (g)
      </InputHeader>
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
    handleSubmit(() => console.log('handleSubmit!'))();
  }, []);
  const {data} = useGetBaseLine();
  const nutrTextByNutr: {[key: string]: string} = {
    carb: data.carb,
    protein: data.protein,
    fat: data.fat,
  };
  const nutrText = nutrTextByNutr[type];
  return (
    <Container>
      <Col style={{marginTop: 24}}>
        <GuideText>다른 영양소는 칼로리에 맞게</GuideText>
        <GuideText>자동으로 조절됩니다</GuideText>
      </Col>
      <Col style={{marginTop: 16}}>
        <GuideText>모든 영양소를 조정하고 싶은 경우는</GuideText>
        <GuideText>고객정보변경을 이용해주세요</GuideText>
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
  padding: 0px 16px 24px 16px;
`;

const GuideText = styled(TextMain)`
  font-size: 16px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;
