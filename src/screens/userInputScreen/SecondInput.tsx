// RN, 3rd
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, useForm, useWatch} from 'react-hook-form';
//doobi util, redux, etc
import {RootState} from '../../stores/store';
import {
  IUserInfo,
  saveUserInfo,
  saveUserTarget,
} from '../../stores/slices/userInfoSlice';
import {NavigationProps, validationRules} from '../../constants/constants';
import {calculateNutrTarget} from '../../util/targetCalculation';
//doobi Component
import {
  BtnBottomCTA,
  BtnText,
  Container,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  UserInfoTextInput,
} from '../../styles/styledConsts';
import Dropdown from '../../components/userInput/Dropdown';
//react-query
import {
  useWeightPurposeCode,
  useAerobicPurposeCode,
} from '../../query/queries/code';
import {useGetBaseLine} from '../../query/queries/baseLine';

interface IFormData {
  bmrKnown: string;
  weightTimeCd: string;
  aerobicTimeCd: string;
}

interface IFormField {
  field: {
    onChange: () => void;
    onBlur: () => void;
    value: string;
  };
}

const renderBmrKnownInput = (
  {field: {onChange, value}}: IFormField,
  handleSubmit: Function,
  userInfo1Refs?: React.MutableRefObject<any[]>,
) => {
  return (
    <>
      <InputHeader isActivated={value ? true : false}>
        기초대사량(kcal)
      </InputHeader>
      <Input
        placeholder="기초대사량을 알고있다면 적어주세요 (kcal)"
        value={value}
        onChangeText={onChange}
        isActivated={value ? true : false}
        keyboardType="numeric"
        maxLength={4}
      />
    </>
  );
};

const onHandlePress = (
  dispatch: Function,
  navigate: Function,
  userInfo: IUserInfo,
  bmrKnownValue: string,
  weightTimeCdValue: string,
  aerobicTimeCdValue: string,
) => {
  // 기초대사량 직접 입력된 경우는 입력된 bmr로
  const bmrMod = bmrKnownValue ? bmrKnownValue : userInfo.bmr;
  const nutrTarget = calculateNutrTarget(
    userInfo.weight,
    weightTimeCdValue,
    aerobicTimeCdValue,
    userInfo.dietPurposeCd,
    bmrMod,
  );
  dispatch(
    saveUserInfo({
      bmr: bmrMod,
      weightTimeCd: weightTimeCdValue,
      aerobicTimeCd: aerobicTimeCdValue,
    }),
  );
  dispatch(
    saveUserTarget({
      tmr: nutrTarget.tmr,
      calorie: nutrTarget.calorie,
      carb: nutrTarget.carb,
      protein: nutrTarget.protein,
      fat: nutrTarget.fat,
    }),
  );

  navigate('InputNav', {screen: 'ThirdInput', params: ''});
};

const SecondInput = ({navigation: {navigate}, route}: NavigationProps) => {
  //state
  const {userInfo} = useSelector((state: RootState) => state.userInfo);
  //react-query
  const {data, isLoading} = useGetBaseLine();
  const weightTimeCd = useWeightPurposeCode('SP003');
  const weightTimeCdCategory = weightTimeCd.data;
  const newWeightTimeCdCategory = weightTimeCdCategory?.map(item => {
    return {value: item.cd, label: item.cdNm};
  });

  const aerobicTimeCd = useAerobicPurposeCode('SP004');
  const aerobicTimeCdCategory = aerobicTimeCd.data;
  const newAerobicTimeCdCategory = aerobicTimeCdCategory?.map(item => {
    return {value: item.cd, label: item.cdNm};
  });
  // redux
  const dispatch = useDispatch();

  // react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    defaultValues: {
      bmrKnown: '',
      weightTimeCd: data?.weightTimeCd ? data?.weightTimeCd : 'SP003001',
      aerobicTimeCd: data?.aerobicTimeCd ? data?.aerobicTimeCd : 'SP004001',
    },
  });
  const bmrKnownValue = useWatch({control, name: 'bmrKnown'});
  const weightTimeCdValue = useWatch({control, name: 'weightTimeCd'});
  const aerobicTimeCdValue = useWatch({control, name: 'aerobicTimeCd'});
  //useEffect
  useEffect(() => {
    handleSubmit(() => {})();
  }, []);
  return (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}>
        <Title>{'선택정보를\n입력해주세요'}</Title>
        <Controller
          control={control}
          rules={validationRules.bmrKnown}
          render={field => renderBmrKnownInput(field, handleSubmit)}
          name="bmrKnown"
        />
        {errors.bmrKnown && (
          <ErrorBox>
            <ErrorText>{errors.bmrKnown.message}</ErrorText>
          </ErrorBox>
        )}
        <Dropdown
          placeholder="웨이트 운동시간"
          items={weightTimeCd.isLoading ? [] : newWeightTimeCdCategory}
          value={weightTimeCdValue}
          setValue={setValue}
          reactHookFormName="weightTimeCd"
        />
        <Dropdown
          placeholder="유산소 운동시간"
          items={aerobicTimeCd.isLoading ? [] : newAerobicTimeCdCategory}
          value={aerobicTimeCdValue}
          setValue={setValue}
          reactHookFormName="aerobicTimeCd"
        />
      </ScrollView>
      <BtnBottomCTA
        btnStyle={
          Object.keys(errors).length === 0 ? 'activated' : 'inactivated'
        }
        disabled={Object.keys(errors).length === 0 ? false : true}
        onPress={() =>
          onHandlePress(
            dispatch,
            navigate,
            userInfo,
            bmrKnownValue,
            weightTimeCdValue,
            aerobicTimeCdValue,
          )
        }>
        <BtnText>다음</BtnText>
      </BtnBottomCTA>
    </Container>
  );
};

export default SecondInput;

const Title = styled(TextMain)`
  font-size: 24px;
  font-weight: bold;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;
