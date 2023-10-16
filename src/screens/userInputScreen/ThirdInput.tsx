//RN, 3rd
import React, {useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useForm, useWatch} from 'react-hook-form';
import Accordion from 'react-native-collapsible/Accordion';
import {useNavigation} from '@react-navigation/native';
//doobi util, redux, etc
import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {nutrRatioCategory} from '../../constants/constants';
import {convertDataByMethod} from '../../util/userInfoSubmit';
//doobi Component
import {
  BtnBottomCTA,
  BtnText,
  Container,
  HorizontalSpace,
  StyledProps,
  TextMain,
} from '../../styles/StyledConsts';

import Auto from '../../components/userInput/Auto';
import CalculateByRatio from '../../components/userInput/CalculateByRatio';
import Manual from '../../components/userInput/Manual';

import {
  useCreateBaseLine,
  useGetBaseLine,
  useUpdateBaseLine,
} from '../../query/queries/baseLine';
import {
  useCreateDiet,
  useListDiet,
  useListDietDetail,
} from '../../query/queries/diet';

interface IFormData {
  ratioType: string;
  caloriePerMeal: string;
  carbManual: string;
  proteinManual: string;
  fatManual: string;
}
interface IRequestBody {
  calorie: string;
  carb: string;
  protein: string;
  fat: string;
  companyCd: string;
  userId: string;
  nickNm: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  dietPurposeCd: string;
  sportsSeqCd: string;
  sportsTimeCd: string;
  sportsStrengthCd: string;
  dietPurposeNm: string;
  sportsSeqNm: string;
  sportsTimeNm: string;
  sportsStrengthNm: string;
}

const ThirdInput = () => {
  // navigation
  const navigation = useNavigation();
  const {navigate} = navigation;

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const updateMutation = useUpdateBaseLine();
  const createMutation = useCreateBaseLine();
  const {data: dietData} = useListDiet();
  console.log('ThirdInput/dietData', dietData?.length);
  const createDietMutation = useCreateDiet();
  const {data: dietDetailData, isLoading: listDietLoading} = useListDietDetail(
    currentDietNo,
    {
      enabled: currentDietNo ? true : false,
    },
  );
  // redux
  const {userInfo, userTarget} = useSelector(
    (state: RootState) => state.userInfo,
  );
  const {currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.cart,
  );
  console.log('ThirdInput/currentDietNo', currentDietNo);
  const totalBaseLine: IRequestBody = {...userInfo, ...userTarget};
  // ref
  const scrollRef = useRef<ScrollView>(null);

  // react-hook-form
  const calorieRecommended = userTarget.calorie;
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    defaultValues: {
      ratioType: nutrRatioCategory[0].value,
      caloriePerMeal: '',
      carbManual: '',
      proteinManual: '',
      fatManual: '',
    },
  });
  //check validation
  const ratioType = useWatch({control, name: 'ratioType'});
  const caloriePerMeal = useWatch({control, name: 'caloriePerMeal'});
  const carbManual = useWatch({control, name: 'carbManual'});
  const proteinManual = useWatch({control, name: 'proteinManual'});
  const fatManual = useWatch({control, name: 'fatManual'});

  // accordion
  // activeSections[0] == 1 : 두비가 알아서 / 탄단지 비율 / 영양성분 직접 입력
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const CONTENT = [
    {
      title: <Text>귀찮다 두비가 알아서 다해줘</Text>,
      content: <Auto />,
    },
    {
      title: <Text>탄:단:지 비율로 계산하기</Text>,
      content: (
        <CalculateByRatio
          ratioType={ratioType}
          calorie={caloriePerMeal}
          setValue={setValue}
          control={control}
          handleSubmit={handleSubmit}
          calorieRecommended={calorieRecommended}
          errors={errors}
        />
      ),
    },
    {
      title: <Text>각 영양성분 직접 입력 (고수용)</Text>,
      content: (
        <Manual
          carbManual={carbManual}
          proteinManual={proteinManual}
          fatManual={fatManual}
          setValue={setValue}
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          scrollRef={scrollRef}
        />
      ),
    },
  ];
  const renderHeader = (section: any, index: number, isActive: boolean) => {
    // return section.title;
    return (
      <AccordionHeader isActivated={isActive}>
        {isActive ? (
          <CheckIcon source={icons.checkboxCheckedPurple_24} />
        ) : (
          <CheckIcon source={icons.checkboxCheckedGrey_24} />
        )}
        <AccordionHeaderTitle isActivated={isActive}>
          {section.title}
        </AccordionHeaderTitle>
        {isActive ? (
          <ArrowIcon source={icons.arrowUpPurple_20} />
        ) : (
          <ArrowIcon source={icons.arrowDown_20} />
        )}
      </AccordionHeader>
    );
  };
  const renderContent = (section: any, index: number, isActive: boolean) => {
    return section.content;
  };
  const updateSections = (actives: Array<number>) => {
    setActiveSections(actives);
  };

  const btnIsActive =
    activeSections[0] === 0 ||
    (activeSections[0] === 1 && !errors.caloriePerMeal) ||
    (activeSections[0] === 2 &&
      !errors.carbManual &&
      !errors.proteinManual &&
      !errors.fatManual)
      ? true
      : false;
  const btnStyle = btnIsActive ? 'activated' : 'inactivated';

  const onSubmit = () => {
    //기존 값이 존재하면 update 없으면 create
    const calculationMethod = activeSections[0];
    const dataToConvert = {
      userInfo,
      userTarget,
      ratioType,
      caloriePerMeal,
      carbManual,
      proteinManual,
      fatManual,
    };
    const requestBody: IRequestBody =
      convertDataByMethod[calculationMethod](dataToConvert);
    if (!baseLineData) return;
    if (Object.keys(baseLineData).length === 0 && dietData?.length === 0) {
      createDietMutation.mutate();
      createMutation.mutate(requestBody);
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
      });
    } else if (Object.keys(baseLineData).length === 0 && dietData?.length > 0) {
      createMutation.mutate(requestBody);
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
      });
    } else {
      updateMutation.mutate(requestBody);
      navigation.reset({
        index: 1,
        routes: [
          // {name: 'BottomTabNav', params: {screen: 'Home'}},
          {name: 'BottomTabNav', params: {screen: 'Mypage'}},
        ],
      });
    }
    // navigate('BottomTabNav', {screen: 'Home'});
  };
  // TBD | 스크롤뷰 ref를 Manual에 넘겨서 단백질입력 활성화시 스크롤 내려주기
  return (
    <Container>
      <Title>
        <TitleText>
          <TitleTextHighlight>한 끼</TitleTextHighlight> 기준{' '}
        </TitleText>
        <TitleText>목표섭취량을 입력해주세요</TitleText>
      </Title>
      <HorizontalSpace height={16} />
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <Accordion
          activeSections={activeSections}
          sections={CONTENT}
          touchableComponent={TouchableOpacity}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={200}
          onChange={updateSections}
          renderFooter={() => <HorizontalSpace height={20} />}
          containerStyle={{marginTop: 32}}
        />
      </ScrollView>
      <BtnBottomCTA
        btnStyle={btnStyle}
        disabled={btnIsActive ? false : true}
        onPress={() => {
          onSubmit();
        }}>
        <BtnText>완료</BtnText>
      </BtnBottomCTA>
    </Container>
  );
};

export default ThirdInput;

const Title = styled.View`
  width: 100%;
`;

const TitleText = styled(TextMain)`
  font-size: 24px;
  font-weight: bold;
`;

const TitleTextHighlight = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.main};
`;

const AccordionHeader = styled.View`
  height: 52px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
`;

const AccordionHeaderTitle = styled.Text`
  font-size: 16px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.textSub};
`;

const CheckIcon = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  align-self: flex-start;
  left: 8px;
`;

const ArrowIcon = styled.Image`
  width: 20px;
  height: 20px;
  position: absolute;
  align-self: flex-end;
  right: 8px;
`;
