// RN
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import {useEffect, useMemo} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {
  setCurrentDiet,
  setMenuActiveSection,
  setTotalFoodList,
} from '../../features/reduxSlices/commonSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';

// doobi
import {
  useCreateDiet,
  useListDiet,
  useListDietTotal,
} from '../../shared/api/queries/diet';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {useListProduct} from '../../shared/api/queries/product';
import {Container, HorizontalSpace} from '../../shared/ui/styledComps';
import {getMenuAcContent} from '../../shared/utils/menuAccordion';
import GuideTitle from '../../shared/ui/GuideTitle';
import CtaButton from '../../shared/ui/CtaButton';
import colors from '../../shared/colors';
import {SCREENWIDTH} from '../../shared/constants';

const Home = () => {
  // navigation
  const {navigate} = useNavigation();
  const route = useRoute();

  // redux
  const dispatch = useDispatch();
  const {menuActiveSection, currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.common,
  );
  const {applied: appliedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // react-query
  const createDietMutation = useCreateDiet();
  const {data: dietData, refetch: refetchListDiet} = useListDiet();
  const {data: baseLineData} = useGetBaseLine();
  const {data: listProductData} = useListProduct(
    {
      dietNo: currentDietNo,
      appliedSortFilter,
    },
    {
      enabled: currentDietNo ? true : false,
    },
  );
  const dietTotalData = useListDietTotal(dietData, {enabled: !!dietData});

  // useEffect
  // 앱 시작할 때 내가 어떤 끼니를 보고 있는지 redux에 저장해놓기 위해 필요함
  useEffect(() => {
    const initializeDiet = async () => {
      const dietData = (await refetchListDiet()).data;
      if (!dietData) return;
      const numOfDiet = dietData.length;
      const firstDietNo = numOfDiet !== 0 ? dietData[0].dietNo : '';
      let firstAddedDietNo = '';
      for (let i = 0; i < 5 - numOfDiet; i++) {
        if (i === 0) {
          await createDietMutation
            .mutateAsync()
            .then(res => (firstAddedDietNo = res.dietNo));
        }
        await createDietMutation.mutateAsync();
      }

      if (currentDietNo !== '') return;
      dispatch(
        setCurrentDiet(numOfDiet === 0 ? firstAddedDietNo : firstDietNo),
      );
    };

    initializeDiet();
  }, []);

  // 처음 앱 켰을 때 totalFoodList를 redux에 저장해놓고 끼니 자동구성에 사용
  useEffect(() => {
    if (!listProductData) return;
    if (totalFoodListIsLoaded) return;
    dispatch(setTotalFoodList(listProductData));
  }, [listProductData]);

  // memo
  const {dTData, dTDataStatus, accordionContent} = useMemo(() => {
    const dTDataStatus =
      dietTotalData && dietTotalData.map(menu => menu.isLoading).includes(true)
        ? 'isLoading'
        : 'isSuccess';
    const dTData =
      dietTotalData && dTDataStatus === 'isSuccess'
        ? dietTotalData?.map((d, idx) => (d.data ? d.data : []))
        : undefined;

    const accordionContent = getMenuAcContent({
      currentDietNo,
      bLData: baseLineData,
      dData: dietData,
      dTData,
    });

    return {
      accordionContent,
      dTDataStatus: 'isSuccess',
      dTData,
    };
  }, [dietData, dietTotalData]);

  //etc
  const title =
    route?.params?.from && route.params.from === 'AutoMenu'
      ? '끼니 구성이\n완료되었어요'
      : '끼니 구성을\n도와드릴게요';
  const subTitle =
    route?.params?.from && route.params.from === 'AutoMenu'
      ? '끼니별로 각 식품을 교체할 수 있어요\n식품을 추가한 상태에서 나머지 자동구성도 가능해요'
      : '자동구성 / 전체 자동구성 버튼을 이용해보세요\n식품을 추가한 상태에서 나머지 자동구성도 가능해요';

  // fn
  const updateSections = (activeSections: number[]) => {
    dispatch(setMenuActiveSection(activeSections));
    if (activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = dietData && dietData[currentIdx].dietNo;
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 140}}>
        <GuideTitle title={title} subTitle={subTitle} style={{marginTop: 40}} />
        {!dTData ? (
          <ActivityIndicator
            size="large"
            color={colors.main}
            style={{marginTop: 64}}
          />
        ) : (
          <Accordion
            containerStyle={{marginTop: 64}}
            activeSections={menuActiveSection}
            sections={accordionContent}
            touchableComponent={TouchableOpacity}
            renderHeader={(section, _, isActive) =>
              isActive ? section.activeHeader : section.inactiveHeader
            }
            renderContent={section => section.content}
            renderFooter={() => <HorizontalSpace height={24} />}
            onChange={updateSections}
          />
        )}
      </ScrollView>
      <BtnBox>
        <CtaButton
          style={{
            backgroundColor: route?.params?.from ? colors.white : colors.dark,
          }}
          btnStyle={route?.params?.from === 'AutoMenu' ? 'border' : 'active'}
          btnText="전체 자동구성"
          onPress={() =>
            navigate('AutoMenu', {
              isOneMenuAuto: false,
              selectedOneDietNo: undefined,
              initialMenu: [],
            })
          }
        />
        {route?.params?.from === 'AutoMenu' && (
          <CtaButton
            style={{
              backgroundColor: colors.dark,
              marginTop: 8,
            }}
            btnStyle={'active'}
            btnText="장바구니 확인"
            onPress={() => navigate('BottomTabNav', {screen: 'Cart'})}
          />
        )}
      </BtnBox>
    </Container>
  );
};

export default Home;

const BtnBox = styled.View`
  position: absolute;
  bottom: 8px;
  width: ${SCREENWIDTH - 32}px;
  align-self: center;
`;
