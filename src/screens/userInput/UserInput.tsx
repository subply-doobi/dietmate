// RN
import {useCallback, useEffect, useRef, useState} from 'react';

// 3rd
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import {styled} from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

// doobi
import {SCREENWIDTH} from '../../shared/constants';
import colors from '../../shared/colors';
import {Col, Container, Row} from '../../shared/ui/styledComps';
import GuideTitle from '../../shared/ui/GuideTitle';
import BackArrow from '../../shared/ui/BackArrow';
import {getPageItem} from './util/pageIdx';
import {BackHandler, ScrollView} from 'react-native';
import CtaButton from '../../shared/ui/CtaButton';
import {setSubmitData} from './util/userInfoSubmit';
import {
  useGetBaseLine,
  useUpdateBaseLine,
  useCreateBaseLine,
} from '../../shared/api/queries/baseLine';

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

  // useState
  const [progress, setProgress] = useState<string[]>(['Start']);

  // useRef
  const scrollRef = useRef<ScrollView | null>(null);

  // etc
  const currentPage = progress[progress.length - 1];
  const goNext = (nextPage: string) => {
    setProgress(v => [...v, nextPage]);
  };
  const goPrev = () => {
    setProgress(v => v.slice(0, v.length - 1));
  };
  const goStart = () => {
    setProgress(['Start']);
  };
  const onComplete = async () => {
    const requestBody = setSubmitData(userInputState);

    !baseLineData || Object.keys(baseLineData).length === 0
      ? await createBaseLineMutation.mutateAsync(requestBody)
      : await updateBaseLineMutation.mutateAsync(requestBody);

    reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabNav',
          params: {
            screen: 'NewHome',
          },
        },
      ],
    });
    setProgress(['Start']);
  };

  const onCtaPress = () => {
    if (
      currentPage === 'Result' ||
      currentPage === 'ChangeResult' ||
      currentPage === 'ResultSimple'
    ) {
      onComplete();
      return;
    }
    goNext(getPageItem(currentPage).getNextPage(userInputState));
  };

  // Cta 버튼 설정
  const btnStyle = getPageItem(currentPage).checkIsActive(userInputState)
    ? 'active'
    : 'inactive';

  const btnText =
    currentPage === 'TargetCalorie'
      ? `${userInputState.calorie.value} kcal 로 결정`
      : '다음';

  const numerator = parseInt(getPageItem(currentPage).header.split('/')[0]);
  const denominator = parseInt(getPageItem(currentPage).header.split('/')[1]);

  // useEffect
  // headerTitle 설정
  useEffect(() => {
    if (currentPage === 'Start' || currentPage === 'CalculationOptions') {
      setOptions({
        headerTitle: '',
        headerLeft: () => <BackArrow goBackFn={goBack} />,
        headerRight: () => null,
      });
      return;
    }
    setOptions({
      headerTitle: `${getPageItem(currentPage).header}`,
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
        if (currentPage === 'Start') return false;

        goPrev();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [progress]),
  );

  useEffect(() => {
    route?.params?.from === 'Checklist' &&
      setProgress(['Start', 'ChangeWeight']);
  }, [route]);

  return (
    <Container>
      <ProgressBox>
        <Progress.Bar
          progress={numerator / denominator}
          width={null}
          height={4}
          color={colors.main}
          unfilledColor={colors.highlight2}
          borderWidth={0}
        />
      </ProgressBox>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{paddingBottom: 200}}
        scrollEnabled={currentPage === 'Start' ? false : true}
        showsVerticalScrollIndicator={false}>
        <GuideTitle
          style={{
            marginTop: 48,
            marginBottom: 64,
          }}
          title={getPageItem(currentPage).title}
          subTitle={getPageItem(currentPage).subTitle}
        />

        {/* 각 페이지 내용 */}
        {getPageItem(currentPage).render(userInputState, scrollRef)}
      </ScrollView>

      {/* CTA버튼 */}
      {currentPage !== 'CalculationOptions' ? (
        <Col style={{marginTop: -120}}>
          {currentPage === 'Start' &&
            baseLineData &&
            Object.keys(baseLineData).length !== 0 && (
              <>
                <CtaButton
                  btnStyle="border"
                  btnText="몸무게, 목표영양만 변경하기"
                  onPress={() => goNext('ChangeWeight')}
                />
              </>
            )}
          <CtaButton
            btnStyle={btnStyle}
            btnText={btnText}
            style={{marginTop: 8, marginBottom: 16}}
            onPress={() => onCtaPress()}
          />
        </Col>
      ) : (
        <Row style={{columnGap: 8, marginBottom: 16}}>
          <CtaButton
            btnStyle="border"
            btnText="자세하게"
            onPress={() => goNext('Gender')}
            style={{flex: 1}}
          />
          <CtaButton
            btnStyle="active"
            btnText="간단하게"
            onPress={() => goNext('GenderSimple')}
            style={{flex: 1}}
          />
        </Row>
      )}
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
