import {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, useForm, useWatch} from 'react-hook-form';

import {RootState} from '../../stores/store';
import {
  IUserInfo,
  saveUserInfo,
  saveUserTarget,
} from '../../stores/slices/userInfoSlice';
import {NavigationProps, validationRules} from '../../constants/constants';
import colors from '../../styles/colors';
import {
  BtnBottomCTA,
  Container,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  UserInfoTextInput,
  Col,
} from '../../styles/StyledConsts';
import {calculateNutrTarget} from '../../util/targetCalculation';

import Dropdown from '../../components/userInput/Dropdown';

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
  const [countExercise, setCountExercise] = useState(0);
  const [timeExercise, setTimeExercise] = useState(0);
  const [intensityExercise, setIntensityExercise] = useState(0);
  const {userInfo} = useSelector((state: RootState) => state.userInfo);
  // console.log('userInfo2: userInfo:', userInfo);
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
    // 나중에 사용자 정보 있으면 초기값으로 넣어줘야함.
    defaultValues: {
      bmrKnown: '',
      weightTimeCd: data?.weightTimeCd ? data?.weightTimeCd : 'SP003001',
      aerobicTimeCd: data?.aerobicTimeCd ? data?.aerobicTimeCd : 'SP004001',
    },
  });
  const bmrKnownValue = useWatch({control, name: 'bmrKnown'});
  const weightTimeCdValue = useWatch({control, name: 'weightTimeCd'});
  const aerobicTimeCdValue = useWatch({control, name: 'aerobicTimeCd'});
  useEffect(() => {
    handleSubmit(() => {})();
  }, []);
  const exerciseBtnRange = [
    {
      label: '주간 운동 횟수',
      value: [
        ['안함'],
        ['1회'],
        ['2회'],
        ['3회'],
        ['4회'],
        ['5회'],
        ['6회'],
        ['헬창'],
      ],
    },
  ];
  const exerciseTimeBtnRange = [
    {
      label: '회당 운동 시간(분)',
      value: [['~30'], ['~60'], ['~90'], ['~120'], ['120~']],
    },
  ];
  const intensityBtn = [
    '이정도면 잠들기도 가능',
    '적당한 산책 느낌',
    '숨이 가쁘지만 버틸 만한 정도',
    '중간중간 쉬지 않으면 못버틴다',
    '유언장이 준비되어 있다 ',
  ];
  return (
    <Container>
      <ScrollView>
        <Title>{'선택 정보를\n입력해주세요'}</Title>
        <SubText>입력된 정보로 목표 칼로리를 계산해드려요</SubText>
        <ButtonContainer>
          {exerciseBtnRange.map((nutr, nutrIdx) => (
            <Col key={nutrIdx}>
              <Nutr>{nutr.label}</Nutr>
              <BtnContainer>
                {nutr.value.map((btn, btnIdx) => (
                  <Btn
                    key={btnIdx}
                    id={btnIdx}
                    clicked={countExercise}
                    onPress={() => setCountExercise(btnIdx)}>
                    <BtnText>{btn}</BtnText>
                  </Btn>
                ))}
              </BtnContainer>
            </Col>
          ))}
        </ButtonContainer>
        {countExercise === 0 ? (
          <></>
        ) : (
          <AcivateContainer>
            <ButtonContainer>
              {exerciseTimeBtnRange.map((nutr, nutrIdx) => (
                <Col key={nutrIdx}>
                  <Nutr>{nutr.label}</Nutr>
                  <BtnContainer>
                    {nutr.value.map((btn, btnIdx) => (
                      <Btn
                        key={btnIdx}
                        id={btnIdx}
                        clicked={timeExercise}
                        onPress={() => setTimeExercise(btnIdx)}>
                        <BtnText>{btn}</BtnText>
                      </Btn>
                    ))}
                  </BtnContainer>
                </Col>
              ))}
            </ButtonContainer>
            <ExerciseIntensityText>
              운동 강도(누가 뭐래도 내 느낌)
            </ExerciseIntensityText>
            {intensityBtn.map((e, index) => (
              <ExerciseIntenSityButton
                key={index}
                id={index}
                clicked={intensityExercise}
                onPress={() => setIntensityExercise(index)}>
                <IntensityButtonText>{e}</IntensityButtonText>
              </ExerciseIntenSityButton>
            ))}
            <Controller
              control={control}
              rules={validationRules.bmrKnown}
              render={field => renderBmrKnownInput(field, handleSubmit)}
              name="bmrKnown"
            />
          </AcivateContainer>
        )}
        {errors.bmrKnown && (
          <ErrorBox>
            <ErrorText>{errors.bmrKnown.message}</ErrorText>
          </ErrorBox>
        )}
      </ScrollView>
      <BtnBottomCTA
        btnStyle={'inactivated'}
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
const SubText = styled(TextMain)`
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 48px;
  color: ${colors.textSub};
`;
const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;

const ButtonContainer = styled.View`
  row-gap: 64px;
  margin-bottom: 64px;
`;

const Nutr = styled(TextMain)`
  font-size: 18px;
`;

const BtnContainer = styled.View`
  margin-top: 16px;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Btn = styled.TouchableOpacity`
  width: 72px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.inactivated};
  background-color: ${({id, clicked}) =>
    id === clicked ? colors.inactivated : colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 14px;
`;
const ExerciseIntensityText = styled(TextMain)`
  font-size: 18px;
  margin-bottom: 16px;
`;
const IntensityButtonText = styled(TextMain)`
  font-size: 14px;
`;
const ExerciseIntenSityButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.inactivated};
  margin-bottom: 8px;
  background-color: ${({id, clicked}) =>
    id === clicked ? colors.inactivated : colors.white};
`;

const AcivateContainer = styled.View``;
