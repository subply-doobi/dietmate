//RN, 3rd
import React, {useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootState} from '../../stores/store';

//doobi util, etc
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {convertDataByMethod} from '../../util/userInput/userInfoSubmit';

//doobi Component
import {
  BtnBottomCTA,
  BtnText,
  Container,
  HorizontalSpace,
  StyledProps,
  TextMain,
} from '../../styles/styledConsts';

import Auto from '../../components/userInput/Auto';
import CalculateByRatio from '../../components/userInput/CalculateByRatio';
import Manual from '../../components/userInput/Manual';

// react-query
import {
  useCreateBaseLine,
  useGetBaseLine,
  useUpdateBaseLine,
} from '../../query/queries/baseLine';
import {useCreateDiet, useListDiet} from '../../query/queries/diet';
import {SafeAreaView} from 'react-native-safe-area-context';

const ThirdInput = () => {
  // navigation
  const {params} = useRoute();
  const navigation = useNavigation();

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const updateBaseLineMutation = useUpdateBaseLine();
  const createBaseLineMutation = useCreateBaseLine();
  const {data: dietData} = useListDiet();
  const createDietMutation = useCreateDiet();

  // redux
  const userInputState = useSelector((state: RootState) => state.userInput);

  // ref
  const scrollRef = useRef<ScrollView>(null);

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
      content: <CalculateByRatio />,
    },
    {
      title: <Text>각 영양성분 직접 입력 (고수용)</Text>,
      content: <Manual scrollRef={scrollRef} />,
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

  // etc
  const btnIsActive =
    activeSections[0] === 0 ||
    (activeSections[0] === 1 && userInputState.calorie.isValid) ||
    (activeSections[0] === 2 &&
      userInputState.carb.isValid &&
      userInputState.protein.isValid &&
      userInputState.fat.isValid)
      ? true
      : false;
  const btnStyle = btnIsActive ? 'activated' : 'inactivated';

  const onSubmit = async () => {
    const calculationMethod = activeSections[0];
    // //기존 값이 존재하면 update 없으면 create
    const requestBody = convertDataByMethod[calculationMethod](userInputState);

    dietData?.length === 0 && (await createDietMutation.mutateAsync());
    !baseLineData || Object.keys(baseLineData).length === 0
      ? await createBaseLineMutation.mutateAsync(requestBody)
      : await updateBaseLineMutation.mutateAsync(requestBody);

    navigation.reset({
      index: 1,
      routes: [
        {
          name: 'BottomTabNav',
          params: {screen: params?.from === 'Mypage' ? 'Mypage' : 'Home'},
        },
      ],
    });
  };

  return (
    <Container>
      <SafeAreaView>
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
          disabled={!btnIsActive}
          onPress={async () => onSubmit()}>
          <BtnText>완료</BtnText>
        </BtnBottomCTA>
      </SafeAreaView>
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
