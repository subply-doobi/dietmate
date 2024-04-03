// RN
import {useCallback, useEffect, useState} from 'react';

// 3rd
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import {styled} from "styled-components/native";
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

// doobi
import {SCREENWIDTH} from '../../shared/constants';
import colors from '../../shared/colors';
import {Col, Container} from '../../shared/ui/styledComps';
import GuideTitle from './ui/GuideTitle';
import {PAGES} from './util/contentBypages';
import BackArrow from '../../components/common/navigation/BackArrow';
import {getPageIdx} from './util/pageIdx';
import {BackHandler, ScrollView} from 'react-native';
import CtaButton from '../../shared/ui/CtaButton';
import {convertDataByMethod} from './util/userInfoSubmit';
import {
  useGetBaseLine,
  useUpdateBaseLine,
  useCreateBaseLine,
} from '../../shared/api/queries/baseLine';
import {useListDiet, useCreateDiet} from '../../shared/api/queries/diet';

const UserInput = () => {
  // redux
  const userInputState = useSelector((state: RootState) => state.userInput);

  // navigation
  const {reset, setOptions, goBack} = useNavigation();
  const route = useRoute();

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const updateBaseLineMutation = useUpdateBaseLine();
  const createBaseLineMutation = useCreateBaseLine();
  const {data: dietData} = useListDiet();
  const createDietMutation = useCreateDiet();

  // useState
  const [progress, setProgress] = useState<number[]>([0]);
  const currentIdx = progress[progress.length - 1];

  // etc
  const goNext = (nextPage: string) => {
    const nextPageIdx = getPageIdx(nextPage);
    setProgress(v => [...v, nextPageIdx]);
  };
  const goPrev = () => {
    setProgress(v => v.slice(0, v.length - 1));
  };
  const goStart = () => {
    setProgress([0]);
  };
  const onComplete = async () => {
    const requestBody =
      convertDataByMethod[userInputState.targetOption.value[0]](userInputState);
    dietData?.length === 0 && (await createDietMutation.mutateAsync());
    !baseLineData || Object.keys(baseLineData).length === 0
      ? await createBaseLineMutation.mutateAsync(requestBody)
      : await updateBaseLineMutation.mutateAsync(requestBody);

    reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabNav',
          params: {
            screen: route?.params?.from === 'Mypage' ? 'Mypage' : 'Home',
          },
        },
      ],
    });
    setProgress([0]);
  };
  const onCtaPress = () => {
    if (currentIdx === PAGES.length - 1) {
      onComplete();
      return;
    }
    goNext(PAGES[currentIdx].getNextPage(userInputState));
  };

  // useEffect
  // headerTitle 설정
  useEffect(() => {
    if (PAGES[currentIdx].name === 'Start') {
      setOptions({
        headerTitle: '',
        headerLeft: () => <BackArrow goBackFn={goBack} />,
        headerRight: () => null,
      });
      return;
    }
    setOptions({
      headerTitle: `${currentIdx}/${PAGES.length - 1}`,
      headerLeft: () => <BackArrow goBackFn={goPrev} />,
      headerRight: () => (
        <GoStartBtn onPress={() => goStart()}>
          <GoStartBtnText>처음으로</GoStartBtnText>
        </GoStartBtn>
      ),
    });
  }, [progress]);


  // android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (PAGES[currentIdx].name === 'Start')
          return false;
        
        goPrev();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [progress])
  );
  return (
    <Container>
      <ProgressBox>
        <Progress.Bar
          progress={currentIdx / (PAGES.length - 1)}
          width={null}
          height={4}
          color={colors.main}
          unfilledColor={colors.backgroundLight}
          borderWidth={0}
        />
      </ProgressBox>
      <ScrollView
        contentContainerStyle={{paddingBottom: 200}}
        scrollEnabled={PAGES[currentIdx].name === 'Start' ? false : true}
        showsVerticalScrollIndicator={false}>
        <GuideTitle
          style={{
            marginTop: currentIdx >= getPageIdx('TargetOptions') ? 24 : 96,
            marginBottom: 64,
          }}
          title={PAGES[currentIdx].title}
          subTitle={PAGES[currentIdx].subTitle}
        />
        {PAGES[currentIdx].render(userInputState)}
      </ScrollView>

      <Col style={{marginTop: -120}}>
        {route?.params?.from === 'Mypage' &&
          PAGES[currentIdx].name === 'Start' && (
            <CtaButton
              btnStyle="border"
              btnText="목표영양만 변경하기"
              onPress={() => goNext('TargetOptions')}
            />
          )}
        <CtaButton
          btnStyle={
            PAGES[currentIdx].checkIsActive(userInputState)
              ? 'active'
              : 'inactive'
          }
          btnText="다음"
          style={{marginTop: 16, marginBottom: 16}}
          onPress={() => onCtaPress()}
        />
      </Col>
    </Container>
  );
};

export default UserInput;

const ProgressBox = styled.View`
  width: ${SCREENWIDTH - 32}px;
  height: 4px;
`;

const GoStartBtn = styled.TouchableOpacity`
  height: 32px;
  justify-content: center;
  align-items: center;
`;
const GoStartBtnText = styled.Text`
  font-size: 12px;
  color: ${colors.textMain};
`;
