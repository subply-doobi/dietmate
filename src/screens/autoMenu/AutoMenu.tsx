// RN
import {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, BackHandler, ActivityIndicator} from 'react-native';

// 3rd
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

// doobi
import {Container} from '../../shared/ui/styledComps';
import {IAutoMenuSubPages, PAGES} from './util/contentByPages';
import BackArrow from '../../components/common/navigation/BackArrow';
import GuideTitle from '../../shared/ui/GuideTitle';
import CtaButton from '../../shared/ui/CtaButton';
import {useListDietTotalObj} from '../../shared/api/queries/diet';
import colors from '../../shared/colors';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

const AutoMenu = () => {
  // redux
  const {isTutorialMode, tutorialProgress} = useSelector(
    (RootState: RootState) => RootState.common,
  );

  // navigation
  const route = useRoute();
  const {setOptions, goBack} = useNavigation();

  // react-query
  const {data: dTOData} = useListDietTotalObj();

  // useState
  const [progress, setProgress] = useState<IAutoMenuSubPages[]>(['Select']);
  const [pageloaded, setPageloaded] = useState<boolean>(false);
  // 각 페이지에서 autoMenu에 필요한 state
  const [selectedDietNo, setSelectedDietNo] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [wantedCompany, setWantedCompany] = useState<string>('');
  const [priceSliderValue, setPriceSliderValue] = useState<number[]>([
    6000, 12000,
  ]);

  // etc
  const currentPage =
    progress.length > 0 ? progress[progress.length - 1] : 'Select';

  // etc
  const goNext = (nextPage: IAutoMenuSubPages) => {
    setProgress(v => [...v, nextPage]);
  };
  const goPrev = () => {
    setProgress(v => v.slice(0, v.length - 1));
  };

  const btnStyle = PAGES.find(p => p.name === currentPage)?.checkIsActive({
    selectedDietNo,
    selectedCategory,
  })
    ? 'active'
    : 'inactive';
  const guideStyle =
    currentPage === 'Processing' ? {marginTop: 140} : {marginTop: 40};
  const guideTitle = PAGES.find(p => p.name === currentPage)?.title || '';
  const guideSubTitle = PAGES.find(p => p.name === currentPage)?.subTitle || '';
  const guideTitleAlign =
    PAGES.find(p => p.name === currentPage)?.name === 'Processing'
      ? 'center'
      : 'left';

  // useEffect
  // 자동구성 첫 페이지 설정
  // 1. 이미 구성중인 끼니 있으면 끼니 선택 페이지에서 시작 || 카테고리선택 페이지에서 시작
  useEffect(() => {
    if (!dTOData) return;
    if (route?.params?.isOneMenuAuto) {
      setProgress(['Category']);
      route?.params?.selectedOneDietNo &&
        setSelectedDietNo([route?.params?.selectedOneDietNo]);
      setPageloaded(true);
      return;
    }
    const dietNoArr = Object.keys(dTOData);
    const menuLengthList = dietNoArr.map(
      dietNo => dTOData[dietNo].dietDetail.length,
    );
    if (menuLengthList.every((m: number) => m === 0)) {
      setSelectedDietNo(dietNoArr.map(dietNo => dietNo));
      setProgress(['Category']);
    }
    setPageloaded(true);
  }, []);

  // headerTitle 설정
  useEffect(() => {
    if (progress.length === 1) {
      setOptions({
        headerLeft: () =>
          isTutorialMode && tutorialProgress === 'AutoMenu' ? (
            <></>
          ) : (
            <BackArrow goBackFn={() => goBack()} />
          ),
      });
      return;
    }
    if (currentPage === 'Processing' || currentPage === 'Error') {
      setOptions({
        headerLeft: () => <></>,
      });
      return;
    }
    setOptions({
      headerLeft: () => <BackArrow goBackFn={goPrev} />,
    });
  }, [progress]);

  // android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isTutorialMode && tutorialProgress === 'AutoMenu') return true;
        if (progress.length === 1) return false;
        if (currentPage === 'Processing' || currentPage === 'Error') {
          return true;
        }

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

  return !pageloaded ? (
    <Container>
      <Box>
        <ActivityIndicator size={20} color={colors.main} />
      </Box>
    </Container>
  ) : (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 120}}
        showsVerticalScrollIndicator={false}>
        <GuideTitle
          style={guideStyle}
          title={guideTitle}
          subTitle={guideSubTitle}
          titleAlign={guideTitleAlign}
        />
        {!dTOData ? (
          <ActivityIndicator
            size="large"
            color={colors.main}
            style={{marginTop: 64}}
          />
        ) : (
          PAGES.find(p => p.name === currentPage)?.render({
            dTOData,
            setProgress,
            selectedCategory,
            setSelectedCategory,
            selectedDietNo,
            setSelectedDietNo,
            wantedCompany,
            setWantedCompany,
            priceSliderValue,
            setPriceSliderValue,
          })
        )}
      </ScrollView>

      {currentPage === 'Processing' || currentPage === 'Error' || (
        <CtaButton
          btnStyle={btnStyle}
          style={{position: 'absolute', bottom: 8}}
          btnText="다음"
          onPress={() =>
            goNext(
              PAGES.find(p => p.name === currentPage)?.getNextPage() ||
                'Select',
            )
          }
        />
      )}
    </Container>
  );
};

export default AutoMenu;

const Box = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
