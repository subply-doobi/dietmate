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
import {PAGES} from './util/contentByPages';
import BackArrow from '../../components/common/navigation/BackArrow';
import {getPageIdx} from './util/pageIdx';
import GuideTitle from '../../shared/ui/GuideTitle';
import CtaButton from '../../shared/ui/CtaButton';
import {useListDiet, useListDietTotal} from '../../shared/api/queries/diet';
import colors from '../../shared/colors';

const AutoMenu = () => {
  // navigation
  const route = useRoute();
  const {setOptions, goBack} = useNavigation();

  // react-query
  const {data: dData} = useListDiet();
  const dietTotalData = useListDietTotal(dData, {enabled: !!dData});

  // useState
  const [progress, setProgress] = useState<number[]>([0]);
  const [pageloaded, setPageloaded] = useState<boolean>(false);
  // 각 페이지에서 autoMenu에 필요한 state
  const [selectedDietNo, setSelectedDietNo] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [wantedCompany, setWantedCompany] = useState<string>('');
  const [priceSliderValue, setPriceSliderValue] = useState<number[]>([
    6000, 12000,
  ]);

  // memo
  const {dTData, dTDataStatus} = useMemo(() => {
    const dTDataStatus =
      dietTotalData && dietTotalData.map(menu => menu.isLoading).includes(true)
        ? 'isLoading'
        : 'isSuccess';
    const dTData =
      dietTotalData && dTDataStatus === 'isSuccess'
        ? dietTotalData?.map((d, idx) => (d.data ? d.data : []))
        : undefined;

    return {
      dTData,
      dTDataStatus,
    };
  }, [dData, dietTotalData]);

  // useEffect
  // 자동구성 첫 페이지 설정
  // 1. 이미 구성중인 끼니 있으면 끼니 선택 페이지에서 시작 || 카테고리선택 페이지에서 시작
  // 2. 한 끼니 자동구성이면 카테고리 선택 페이지에서 시작
  useEffect(() => {
    if (!dTData) return;
    if (route?.params?.isOneMenuAuto) {
      setProgress([getPageIdx('Category')]);
      route?.params?.selectedOneDietNo &&
        setSelectedDietNo([route?.params?.selectedOneDietNo]);
      setPageloaded(true);
      return;
    }
    const menuLengthList = dTData.map((m: any) => m.length);
    if (menuLengthList.every((m: number) => m === 0)) {
      setProgress([getPageIdx('Category')]);
    }
    setPageloaded(true);
  }, []);

  // headerTitle 설정
  useEffect(() => {
    if (progress.length === 1) {
      setOptions({
        headerLeft: () => <BackArrow goBackFn={goBack} />,
      });
      return;
    }
    if (
      PAGES[currentIdx].name === 'Processing' ||
      PAGES[currentIdx].name === 'Error'
    ) {
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
        if (progress.length === 1) return false;
        if (
          PAGES[currentIdx].name === 'Processing' ||
          PAGES[currentIdx].name === 'Error'
        ) {
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

  // etc
  const currentIdx = progress[progress.length - 1];

  const goNext = (nextPage: string) => {
    const nextPageIdx = getPageIdx(nextPage);
    setProgress(v => [...v, nextPageIdx]);
  };
  const goPrev = () => {
    setProgress(v => v.slice(0, v.length - 1));
  };

  const btnStyle = PAGES[currentIdx].checkIsActive({
    selectedDietNo,
    selectedCategory,
  })
    ? 'active'
    : 'inactive';

  return !pageloaded ? (
    <Container></Container>
  ) : (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 120}}
        showsVerticalScrollIndicator={false}>
        <GuideTitle
          style={{
            marginTop: PAGES[currentIdx].name === 'Processing' ? 140 : 72,
          }}
          title={PAGES[currentIdx].title}
          subTitle={PAGES[currentIdx].subTitle}
          titleAlign={
            PAGES[currentIdx].name === 'Processing' ? 'center' : 'left'
          }
        />
        {!dTData ? (
          <ActivityIndicator
            size="large"
            color={colors.main}
            style={{marginTop: 64}}
          />
        ) : (
          PAGES[currentIdx].render({
            dTData,
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

      {PAGES[currentIdx].name === 'Processing' ||
        PAGES[currentIdx].name === 'Error' || (
          <CtaButton
            btnStyle={btnStyle}
            style={{position: 'absolute', bottom: 8}}
            btnText="다음"
            onPress={() => goNext(PAGES[currentIdx].getNextPage())}
          />
        )}
    </Container>
  );
};

export default AutoMenu;
