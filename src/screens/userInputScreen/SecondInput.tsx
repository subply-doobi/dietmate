import {useEffect, useRef, useState} from 'react';
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
import {validationRules} from '../../constants/constants';
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
  StyledProps,
} from '../../styles/StyledConsts';
import {calculateNutrTarget} from '../../util/targetCalculation';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useNavigation, useRoute} from '@react-navigation/native';
import DTooltip from '../../components/common/tooltip/DTooltip';
import {
  useWorkoutPurposeCode,
  useWorkoutIntensityCode,
  useWorkoutFrequencyCode,
} from '../../query/queries/code';

interface IFormData {
  bmrKnown: string;
}

interface IFormField {
  field: {
    onChange: () => void;
    onBlur: () => void;
    value: string;
  };
}

//입력된 정보로 목표 칼로리를 계산해드려요
const renderBmrKnownInput = (
  {field: {onChange, value}}: IFormField,
  handleSubmit: Function,
  userInfo1Refs?: React.MutableRefObject<any[]>,
  scrollRef?: any,
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
        onFocus={() => {
          console.log('scrollToEnd!!');
          setTimeout(() => {
            scrollRef.current.scrollToEnd({animated: true});
          }, 50);
        }}
      />
    </>
  );
};

const onHandlePress = (
  dispatch: Function,
  navigate: Function,
  userInfo: IUserInfo,
  bmrKnownValue: string,
  frequencyIndex: number,
  frequencyCd: string,
  durationIdx: number,
  durationCd: string,
  intensityIdx: number,
  intensityCd: string,
  params: any,
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
    frequencyIndex,
    mets,
    duration,
    userInfo.dietPurposeCd,
    bmrMod,
  );
  dispatch(
    saveUserInfo({
      bmr: bmrMod,
      sportsSeqCd: frequencyCd.toString(),
      sportsTimeCd: durationCd.toString(),
      sportsStrengthCd: intensityCd.toString(),
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
  navigate('InputNav', {screen: 'ThirdInput', params});
};

const SecondInput = () => {
  const workoutPurposeCode = useWorkoutPurposeCode('SP008');
  const workoutFrequencyCode = useWorkoutFrequencyCode('SP009');
  const workoutIntensityCode = useWorkoutIntensityCode('SP010');
  // navigation
  const {params} = useRoute();
  const {navigate} = useNavigation();
  const [frequency, setFrequency] = useState({index: 0, cd: ''});
  const [duration, setDuration] = useState({index: 0, cd: ''});
  const [intensity, setIntensity] = useState({index: 0, cd: ''});
  const {userInfo} = useSelector((state: RootState) => state.userInfo);
  const {data: baseData, refetch} = useGetBaseLine();
  // redux
  const dispatch = useDispatch();

  // ref
  const scrollRef = useRef<ScrollView>(null);

  // react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    defaultValues: {
      bmrKnown: '',
    },
  });
  const bmrKnownValue = useWatch({control, name: 'bmrKnown'});

  const purposeValue = workoutPurposeCode?.data?.map((item, index) => {
    return {cdNm: item.cdNm, cd: item.cd, index: index};
  });
  const frequencyValue = workoutFrequencyCode?.data?.map((item, index) => {
    return {cdNm: item.cdNm, cd: item.cd, index: index};
  });
  const intensityValue = workoutIntensityCode?.data?.map((item, index) => {
    return {cdNm: item.cdNm, cd: item.cd, index: index};
  });
  //기본값 자동으로 설정하는 함수
  const setDefaultValue = async () => {
    await refetch();
    baseData?.sportsSeqCd &&
      setFrequency({
        cd: baseData?.sportsSeqCd,
        index: purposeValue?.findIndex(
          item => item.cd === baseData?.sportsSeqCd,
        ),
      });
    baseData?.sportsTimeCd &&
      setDuration({
        cd: baseData?.sportsTimeCd,
        index: frequencyValue?.findIndex(
          item => item.cd === baseData?.sportsTimeCd,
        ),
      });
    baseData?.sportsStrengthCd &&
      setIntensity({
        cd: baseData?.sportsStrengthCd,
        index: intensityValue?.findIndex(
          item => item.cd === baseData?.sportsStrengthCd,
        ),
      });
  };
  //useEffect
  useEffect(() => {
    handleSubmit(() => {})();
    setDefaultValue();
  }, [workoutPurposeCode.isSuccess]);

  const workoutButtonRange = [
    {
      label: '주간 운동 횟수',
      value: purposeValue,
    },
  ];
  const workoutFrequencyButtonRange = [
    {
      label: '회당 운동 시간(분)',
      value: frequencyValue,
    },
  ];
  const workoutIntensityButtonRange = intensityValue;
  const exerciseRangeTT =
    frequency.index === 0
      ? '두비는 주 3회 이상 운동을 권장합니다'
      : frequency.index === 7
      ? '그래도 두비는 헬창을 응원합니다'
      : '';

  return (
    <Container>
      <ScrollView contentContainerStyle={{paddingBottom: 80}} ref={scrollRef}>
        <Title>{'선택 정보를\n입력해주세요'}</Title>
        <SubText>입력된 정보로 목표 칼로리를 계산해드려요</SubText>

        <ButtonContainer>
          {workoutButtonRange?.map((nutr, nutrIdx) => (
            <Col key={nutrIdx}>
              <Nutr>{nutr.label}</Nutr>
              <BtnContainer>
                {nutr?.value?.map((btn, btnIdx) => (
                  <Btn
                    key={btnIdx}
                    isActivated={frequency.index === btnIdx ? true : false}
                    onPress={() => {
                      setFrequency({cd: btn.cd, index: btn.index});
                    }}>
                    <BtnText
                      isActivated={frequency.index === btnIdx ? true : false}>
                      {btn.cdNm}
                    </BtnText>
                  </Btn>
                ))}
              </BtnContainer>
            </Col>
          ))}
        </ButtonContainer>
        <Col>
          <DTooltip
            tooltipShow={frequency.index === 0 || frequency.index === 7}
            boxTop={8}
            boxLeft={0}
            triangle={false}
            text={exerciseRangeTT}
          />
        </Col>
        {frequency.index === 0 ? (
          <></>
        ) : (
          <AcivateContainer>
            <ButtonContainer>
              {workoutFrequencyButtonRange.map((nutr, nutrIdx) => (
                <Col key={nutrIdx}>
                  <Nutr>{nutr.label}</Nutr>
                  <BtnContainer>
                    {nutr?.value?.map((btn, btnIdx) => (
                      <Btn
                        key={btnIdx}
                        isActivated={duration.index === btnIdx ? true : false}
                        onPress={() => {
                          setDuration({cd: btn.cd, index: btnIdx});
                        }}>
                        <BtnText
                          isActivated={
                            duration.index === btnIdx ? true : false
                          }>
                          {btn.cdNm}
                        </BtnText>
                      </Btn>
                    ))}
                  </BtnContainer>
                </Col>
              ))}
            </ButtonContainer>
            <ExerciseIntensityText>
              운동 강도(누가 뭐래도 내 느낌)
            </ExerciseIntensityText>
            {workoutIntensityButtonRange?.map((e, index) => (
              <ExerciseIntenSityButton
                key={index}
                isActivated={intensity.index === index ? true : false}
                onPress={() => {
                  setIntensity({cd: e.cd, index: index});
                }}>
                <BtnText isActivated={intensity.index === index ? true : false}>
                  {e.cdNm}
                </BtnText>
              </ExerciseIntenSityButton>
            ))}
          </AcivateContainer>
        )}
        <Controller
          control={control}
          rules={validationRules.bmrKnown}
          render={field =>
            renderBmrKnownInput(field, handleSubmit, undefined, scrollRef)
          }
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
            frequency.index,
            frequency.cd,
            duration.index,
            duration.cd,
            intensity.index,
            intensity.cd,
            params,
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
  color: ${colors.textSub};
`;
const InputHeader = styled(InputHeaderText)`
  margin-top: 48px;
`;
const Input = styled(UserInfoTextInput)``;

const ButtonContainer = styled.View`
  margin-top: 48px;
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
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  background-color: ${colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
`;
const BtnCTAText = styled(TextMain)`
  font-size: 16px;
  color: ${colors.white};
`;

const ExerciseIntensityText = styled(TextMain)`
  font-size: 18px;
  margin-top: 48px;
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
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  margin-bottom: 8px;
  background-color: ${colors.white};
`;

const AcivateContainer = styled.View``;
