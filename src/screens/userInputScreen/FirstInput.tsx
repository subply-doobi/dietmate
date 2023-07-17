// Description: 첫번째 유저 정보 입력 화면
//RN, 3rd
import React, {useRef} from 'react';
import {View, Text, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
//doobi util, redux, etc
import {RootState} from '../../stores/store';
import {saveUserInfo} from '../../stores/slices/userInfoSlice';
import {NavigationProps, validationRules} from '../../constants/constants';
import colors from '../../styles/colors';
import {calculateBMR} from '../../util/targetCalculation';
//doobi Component
import {
  BtnBottomCTA,
  BtnText,
  Container,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  Row,
  StyledProps,
  TextMain,
  UserInfoTextInput,
  VerticalSpace,
} from '../../styles/StyledConsts';

import Dropdown from '../../components/userInput/Dropdown';
//react-query
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useDietPurposeCode} from '../../query/queries/code';
import {useNavigation} from '@react-navigation/native';

interface IFormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  dietPurposeCd: string;
}

//나이 Input
const renderAgeInput = (
  {field: {onChange, value}}: any,
  userInfo1Refs?: React.MutableRefObject<any[]>,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>만 나이</InputHeader>
      <Input
        placeholder="만 나이를 입력해주세요"
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          userInfo1Refs ? (userInfo1Refs.current[0] = el) : null;
        }}
        onSubmitEditing={() => {
          userInfo1Refs?.current[1].focus();
        }}
      />
    </>
  );
};
//신장 Input
const renderHeightInput = (
  {field: {onChange, onBlur, value}}: any,
  userInfo1Refs?: React.MutableRefObject<any[]>,
  scrollRef?: any,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>신장(cm)</InputHeader>
      <Input
        placeholder="신장을 입력해주세요"
        onFocus={() => {
          scrollRef?.current.scrollTo({y: 80, animated: true});
        }}
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          userInfo1Refs ? (userInfo1Refs.current[1] = el) : null;
        }}
        onSubmitEditing={() => {
          userInfo1Refs?.current[2].focus();
        }}
      />
    </>
  );
};
//몸무게 Input
const renderWeightInput = (
  {field: {onChange, onBlur, value}}: any,
  userInfo1Refs?: React.MutableRefObject<any[]>,
  scrollRef?: any, // TBD | scrollView ref type?!
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>몸무게(kg)</InputHeader>
      <Input
        placeholder="몸무게를 입력해주세요"
        onFocus={() => {
          scrollRef?.current.scrollToEnd();
        }}
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          userInfo1Refs ? (userInfo1Refs.current[2] = el) : null;
        }}
      />
    </>
  );
};

const FirstInput = ({navigation: {navigate}}: NavigationProps) => {
  const {data, isLoading} = useGetBaseLine();
  const dietPurposeCd = useDietPurposeCode('SP002');
  const dietPurposeCdCategory = dietPurposeCd.data;
  const newDietPurposeCdCategory = dietPurposeCdCategory?.map(item => {
    return {value: item.cd, label: item.cdNm};
  });
  // state
  // redux
  const {userInfo} = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  // console.log('userInfo1: userInfo: ', userInfo);

  // refs
  const scrollRef = useRef<ScrollView>(null);
  const userInfo1Refs = useRef([]);
  /**
   * 먼저 서버 정보 공통 코드목록으로 API호출하기 설정
   * cd => value
   * cdNm => label
   * 로 바꾸는 작업을 해야함
   * 유저정보 체크 후 값이 있으면, 기존 값 올려두기
   *  없다면 설정할 필요없이 기존 코드 그대로
   *
   */
  // react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    // 나중에 사용자 정보 있으면 초기값으로 넣어줘야함.
    defaultValues: {
      gender: data?.gender ? data?.gender : '',
      age: data?.age ? data?.age : '',
      height: data?.height ? data?.height : '',
      weight: data?.weight ? data?.weight : '',
      dietPurposeCd: data?.dietPurposeCd ? data?.dietPurposeCd : 'SP002001',
    },
  });
  const genderValue = useWatch({control, name: 'gender'});
  const ageValue = useWatch({control, name: 'age'});
  const heightValue = useWatch({control, name: 'height'});
  const weightValue = useWatch({control, name: 'weight'});
  const dietPurposeValue = useWatch({control, name: 'dietPurposeCd'});

  console.log('firstInput:', data);

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <Title>{'기본정보를\n입력해주세요'}</Title>

        {/* gender */}
        <Row style={{justifyContent: 'space-between'}}>
          <BtnToggle
            isActivated={genderValue === 'M' ? true : false}
            onPress={() => setValue('gender', 'M')}>
            <ToggleText isActivated={genderValue === 'M' ? true : false}>
              남성
            </ToggleText>
          </BtnToggle>
          <VerticalSpace width={8} />
          <BtnToggle
            isActivated={genderValue === 'F' ? true : false}
            onPress={() => setValue('gender', 'F')}>
            <ToggleText isActivated={genderValue === 'F' ? true : false}>
              여성
            </ToggleText>
          </BtnToggle>
        </Row>

        {/* --- age --- */}
        <Controller
          control={control}
          rules={validationRules.age}
          render={field => renderAgeInput(field, userInfo1Refs)}
          name="age"
        />
        {errors.age && (
          <ErrorBox>
            <ErrorText>{errors.age.message}</ErrorText>
          </ErrorBox>
        )}

        {/* --- height --- */}
        <Controller
          control={control}
          rules={validationRules.height}
          render={field => renderHeightInput(field, userInfo1Refs, scrollRef)}
          name="height"
        />
        {errors.height && (
          <ErrorBox>
            <ErrorText>{errors.height.message}</ErrorText>
          </ErrorBox>
        )}

        {/* --- weight --- */}
        <Controller
          control={control}
          rules={validationRules.weight}
          render={field => renderWeightInput(field, userInfo1Refs, scrollRef)}
          name="weight"
        />
        {errors.weight && (
          <ErrorBox>
            <ErrorText>{errors.weight.message}</ErrorText>
          </ErrorBox>
        )}

        {/* --- purpose --- */}
        <Dropdown
          placeholder="식단의 목적"
          items={dietPurposeCd.isLoading ? [] : newDietPurposeCdCategory}
          value={dietPurposeValue}
          setValue={setValue}
          scrollRef={scrollRef}
          reactHookFormName={'dietPurposeCd'}
        />
      </ScrollView>
      <BtnBottomCTA
        btnStyle={
          ageValue &&
          heightValue &&
          weightValue &&
          Object.keys(errors).length === 0
            ? 'activated'
            : 'inactivated'
        }
        disabled={
          ageValue &&
          heightValue &&
          weightValue &&
          Object.keys(errors).length === 0
            ? false
            : true
        }
        height={52}
        onPress={() => {
          const BMR = calculateBMR(
            genderValue,
            ageValue,
            heightValue,
            weightValue,
          );
          dispatch(
            saveUserInfo({
              gender: genderValue,
              age: ageValue,
              height: heightValue,
              weight: weightValue,
              dietPurposeCd: dietPurposeValue,
              bmr: BMR,
            }),
          );
          navigate('InputNav', {screen: 'SecondInput', params: BMR});
        }}>
        <BtnText>다음</BtnText>
      </BtnBottomCTA>
    </Container>
  );
};

export default FirstInput;

const Title = styled(TextMain)`
  font-size: 24px;
  font-weight: bold;
`;

const BtnToggle = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  margin-top: 48px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 4px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
`;

const ToggleText = styled.Text`
  font-size: 16px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;
