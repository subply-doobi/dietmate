import {useEffect, useState} from 'react';
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
  frequencyIdx: number,
  durationIdx: number,
  intensityIdx: number,
  weightTimeCdValue: string,
  aerobicTimeCdValue: string,
) => {
  // 기초대사량 직접 입력된 경우는 입력된 bmr로
  const bmrMod = bmrKnownValue ? bmrKnownValue : userInfo.bmr;

  // mets 변환 =>
  // 0: 1.3 (바느질ㅋ) | 1: 2.3 (천천히걷기) | 2: 6.4 (천천히뛰기) |
  // 3: 8.0 (빠르게뛰기) | 4: 10 (더 빠르게 / 쉬는시간 보정)
  const intensityIdxToMets = [1.3, 2.3, 6.4, 8.0, 10];
  const mets = intensityIdxToMets[intensityIdx];
  const duration = durationIdx * 30 + 15;
  const nutrTarget = calculateNutrTarget(
    userInfo.weight,
    frequencyIdx,
    mets,
    duration,
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
  const [frequencyIdx, setFrequencyIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(0);
  const [intensityIdx, setIntensityIdx] = useState(0);
  const {userInfo} = useSelector((state: RootState) => state.userInfo);
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
      value: [['~30'], ['30~60'], ['60~90'], ['90~120'], ['120~']],
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
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
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
                    clicked={frequencyIdx}
                    onPress={() => setFrequencyIdx(btnIdx)}>
                    <BtnText>{btn}</BtnText>
                  </Btn>
                ))}
              </BtnContainer>
            </Col>
          ))}
        </ButtonContainer>
        {frequencyIdx === 0 ? (
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
                        clicked={durationIdx}
                        onPress={() => setDurationIdx(btnIdx)}>
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
                clicked={intensityIdx}
                onPress={() => setIntensityIdx(index)}>
                <IntensityButtonText>{e}</IntensityButtonText>
              </ExerciseIntenSityButton>
            ))}
          </AcivateContainer>
        )}
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
      </ScrollView>
      <BtnBottomCTA
        btnStyle="activated"
        disabled={Object.keys(errors).length === 0 ? false : true}
        onPress={() =>
          onHandlePress(
            dispatch,
            navigate,
            userInfo,
            bmrKnownValue,
            frequencyIdx,
            durationIdx,
            intensityIdx,
            weightTimeCdValue,
            aerobicTimeCdValue,
          )
        }>
        <BtnCTAText>다음</BtnCTAText>
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
  margin-top: 16px;
`;
const Input = styled(UserInfoTextInput)``;

const ButtonContainer = styled.View`
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
const BtnCTAText = styled(TextMain)`
  font-size: 16px;
  color: ${colors.white};
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
