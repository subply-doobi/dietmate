// react, RN, 3rd
import {useRef, useState} from 'react';
import {ActivityIndicator, Animated, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

// doobi util, const
import colors from '../../shared/colors';

// doobi Component
import FilterModalContent from './ui/FilterModalContent';
import MenuSection from '../../components/common/menuSection/MenuSection';
import {useHeaderHeight} from '@react-navigation/elements';

// react-query
import {useListDietTotalObj} from '../../shared/api/queries/diet';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

import SortModalContent from './ui/SortModalContent';
import DTPScreen from '../../shared/ui/DTPScreen';
import HomeContainer from './ui/HomeFoodListAndBtn';
import DBottomSheet from '../../components/common/bottomsheet/DBottomSheet';
import FlatlistHeaderComponent from './ui/FlatlistHeaderComponent';
import {useListProduct} from '../../shared/api/queries/product';
import {ISortFilter} from '../../features/reduxSlices/sortFilterSlice';
import HomeFoodListAndBtn from './ui/HomeFoodListAndBtn';
import {IProductData} from '../../shared/api/types/product';
import DTooltip from '../../components/common/tooltip/DTooltip';
import {Col} from '../../shared/ui/styledComps';
import NutrientsProgress from '../../components/common/nutrient/NutrientsProgress';
import {tutorialSortFilter} from '../../shared/constants';

const Search = () => {
  // navigation
  const headerHeight = useHeaderHeight();

  // redux
  const {currentDietNo, isTutorialMode, tutorialProgress} = useSelector(
    (state: RootState) => state.common,
  );
  const {applied: appliedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // state
  const [productAlertShow, setProductAlertShow] = useState(false);
  const [sortModalShow, setSortModalShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);

  // react-query
  const {isLoading: getBaseLineIsLoading} = useGetBaseLine(); // 미리 캐싱
  const {data: dTOData, isLoading: isDTODataLoading} = useListDietTotalObj();
  const dDData = dTOData?.[currentDietNo]?.dietDetail ?? [];
  const numOfDiet = dTOData ? Object.keys(dTOData).length : 0;
  const {data: productData} = useListProduct(
    {
      dietNo: currentDietNo,
      appliedSortFilter: isTutorialMode
        ? tutorialSortFilter
        : appliedSortFilter,
    },
    {
      enabled: currentDietNo ? true : false,
    },
  );

  // Animation
  // flatList header hide Event
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
  });
  // flatlist scrollToTop
  const flatListRef = useRef<FlatList<IProductData> | null>(null);
  const scrollTop = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  // etc
  const currentNumOfFoods = dDData?.length || 0;

  // render
  if (getBaseLineIsLoading || isDTODataLoading) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.main} />
      </Container>
    );
  }
  return (
    <Container>
      {/* 끼니선택, progressBar section */}
      <MenuSection />

      {numOfDiet === 0 ? (
        <ContentContainer></ContentContainer>
      ) : (
        <ContentContainer>
          {/* 검색결과 수 및 정렬 필터 */}
          <FlatlistHeaderComponent
            translateY={translateY}
            searchedNum={productData?.length}
            setFilterModalShow={setFilterModalShow}
            setSortModalShow={setSortModalShow}
          />

          {/* 상품 리스트 */}
          {!isTutorialMode && (
            <HomeFoodListAndBtn
              scrollY={scrollY}
              flatListRef={flatListRef}
              scrollTop={scrollTop}
              setProductAlertShow={setProductAlertShow}
              setSortModalShow={setSortModalShow}
              setFilterModalShow={setFilterModalShow}
            />
          )}
        </ContentContainer>
      )}

      {/* 정렬, 필터 모달 */}
      <DBottomSheet
        alertShow={filterModalShow}
        setAlertShow={setFilterModalShow}
        renderContent={() => (
          <FilterModalContent setFilterModalShow={setFilterModalShow} />
        )}
        filterHeight={514}
      />
      <DBottomSheet
        alertShow={sortModalShow}
        setAlertShow={setSortModalShow}
        renderContent={() => (
          <SortModalContent setSortModalShow={setSortModalShow} />
        )}
        onCancel={() => {}}
      />

      {/* 알럿창 */}
      <DAlert
        alertShow={productAlertShow}
        onConfirm={() => setProductAlertShow(false)}
        onCancel={() => setProductAlertShow(false)}
        renderContent={() => (
          <CommonAlertContent text="해당 필터에 적용되는 상품이 없어요" />
        )}
        NoOfBtn={1}
      />

      {/* 튜토리얼 */}
      <DTPScreen
        contentDelay={500}
        visible={isTutorialMode && tutorialProgress === 'SelectFood'}
        renderContent={() => (
          <>
            <Col
              style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: colors.white,
                paddingHorizontal: 16,
                marginTop: headerHeight + 40,
              }}>
              <NutrientsProgress dietDetailData={dDData} />
            </Col>
            <DTooltip
              tooltipShow={
                isTutorialMode &&
                tutorialProgress === 'SelectFood' &&
                currentNumOfFoods === 0
              }
              text="영양성분 부분을 눌러 식품 하나를 추가해봐요"
              boxTop={headerHeight + 40 + 70 + 8 + 140 - 40}
              boxLeft={16}
            />
            <HomeFoodListAndBtn
              style={{marginTop: headerHeight + 40 + 70 + 8 + 140}}
              scrollY={scrollY}
              flatListRef={flatListRef}
              scrollTop={scrollTop}
              setProductAlertShow={setProductAlertShow}
              setSortModalShow={setSortModalShow}
              setFilterModalShow={setFilterModalShow}
            />
          </>
        )}
      />
    </Container>
  );
};

export default Search;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;
