// react, RN, 3rd
import {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, Animated, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

// doobi util, const
import {
  FOOD_LIST_ITEM_HEIGHT,
  HOME_FILTER_HEADER_HEIGHT,
} from '../../shared/constants';
import {IProductData} from '../../shared/api/types/product';
import {SCREENWIDTH} from '../../shared/constants';
import colors from '../../shared/colors';
import {icons} from '../../shared/iconSource';
import {
  getNotShowAgainList,
  updateNotShowAgainList,
} from '../../shared/utils/asyncStorage';

// doobi Component
import FoodList from './ui/FoodList';
import DBottomSheet from '../../components/common/bottomsheet/DBottomSheet';
import FilterModalContent from './ui/FilterModalContent';
import DTooltip from '../../components/common/tooltip/DTooltip';
import MenuSection from '../../components/common/menuSection/MenuSection';
import FlatlistHeaderComponent from './ui/FlatlistHeaderComponent';

// react-query
import {
  useListDietDetail,
  useListDiet,
  useCreateDiet,
} from '../../shared/api/queries/diet';
import {useListProduct} from '../../shared/api/queries/product';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

import SortModalContent from './ui/SortModalContent';
import BusinessInfo from '../../components/common/businessInfo/BusinessInfo';
import {applySortFilter} from '../../features/reduxSlices/sortFilterSlice';
import CtaButton from '../../shared/ui/CtaButton';
import {
  setCurrentDiet,
  setMenuAcActive,
} from '../../features/reduxSlices/commonSlice';
import {findDietSeq} from '../../shared/utils/findDietSeq';

const Search = () => {
  // navigation
  const {navigate, goBack} = useNavigation();
  const route = useRoute();

  // redux
  const dispatch = useDispatch();
  const {currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.common,
  );
  const {applied: appliedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // state
  const [productAlertShow, setProductAlertShow] = useState(false);
  const [sortModalShow, setSortModalShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(false);

  // react-query
  const {isLoading: getBaseLineIsLoading} = useGetBaseLine(); // 미리 캐싱
  const {data: dietData, isLoading: listDietIsLoading} = useListDiet();
  const {data: dietDetailData, isLoading: listDDIsLoading} = useListDietDetail(
    currentDietNo,
    {
      enabled: currentDietNo ? true : false,
    },
  );
  const {
    data: productData,
    refetch: refetchProduct,
    isFetching: productIsFetching,
  } = useListProduct(
    {
      dietNo: currentDietNo,
      appliedSortFilter,
    },
    {
      enabled: currentDietNo ? true : false,
    },
  );

  // flatList render fn
  const renderFoodList = useCallback(
    ({item}: {item: IProductData}) =>
      dietDetailData ? <FoodList item={item} screen="Search" /> : <></>,
    [dietDetailData],
  );
  const extractListKey = useCallback(
    (item: IProductData) => item.productNo,
    [productData],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: FOOD_LIST_ITEM_HEIGHT,
      offset: FOOD_LIST_ITEM_HEIGHT * index,
      index,
    }),
    [productData],
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

  // useEffect

  // "식단 고민하기 싫다면 장바구니페이지의 자동구성을 이용하세요" 툴팁
  // useEffect(() => {
  //   //tooltip 관련
  //   const initializeTooltip = async () => {
  //     const isTooltipShow = await getNotShowAgainList().then(
  //       v => !v.homeTooltip,
  //     );
  //     setTooltipShow(isTooltipShow);
  //   };
  //   initializeTooltip();
  // }, []);

  // 정렬, 필터 바뀔 때마다 refetch / 스크롤 맨 위로
  useEffect(() => {
    if (!totalFoodListIsLoaded) return;
    currentDietNo &&
      refetchProduct().then(
        res => res?.data?.length === 0 && setProductAlertShow(true),
      );
    scrollTop();
  }, [appliedSortFilter]);

  if (getBaseLineIsLoading || listDietIsLoading || listDDIsLoading) {
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

      {dietData?.length === 0 ? (
        <HomeContainer></HomeContainer>
      ) : (
        <HomeContainer>
          {/* 검색결과 수 및 정렬 필터 */}
          <FlatlistHeaderComponent
            translateY={translateY}
            searchedNum={productData?.length}
            setFilterModalShow={setFilterModalShow}
            setSortModalShow={setSortModalShow}
          />

          {/* 식품 리스트 */}
          {productData && dietDetailData && (
            <FlatList
              contentContainerStyle={{
                marginTop: HOME_FILTER_HEADER_HEIGHT,
                paddingBottom: 120,
              }} // 숨겨지는 header의 높이만큼 margin
              data={productData}
              keyExtractor={extractListKey}
              renderItem={renderFoodList}
              getItemLayout={getItemLayout}
              initialNumToRender={5}
              windowSize={2}
              maxToRenderPerBatch={7}
              removeClippedSubviews={true}
              onEndReachedThreshold={0.4}
              showsVerticalScrollIndicator={false}
              refreshing={productIsFetching}
              onRefresh={() => {
                dispatch(applySortFilter());
                refetchProduct();
              }}
              progressViewOffset={HOME_FILTER_HEADER_HEIGHT}
              onScroll={e => {
                scrollY.setValue(
                  e.nativeEvent.contentOffset.y < 0
                    ? 0
                    : e.nativeEvent.contentOffset.y,
                );
              }}
              ref={flatListRef}
              // 하단 사업자 정보
              ListFooterComponent={() => (
                <BusinessInfo bgColor={colors.backgroundLight} />
              )}
            />
          )}
          {route?.params?.from && route?.params?.from === 'Home' && (
            <CtaButton
              btnStyle="active"
              style={{
                width: SCREENWIDTH - 32,
                position: 'absolute',
                bottom: 8,
                backgroundColor: colors.dark,
              }}
              btnText="완료"
              onPress={() => {
                goBack();
                const {idx} = findDietSeq(dietData, currentDietNo);
                dispatch(setMenuAcActive([idx]));
              }}
            />
          )}

          {/* 홈화면 기본 툴팁 */}
          {/* {!route?.params?.from || route?.params?.from !== 'Home' ? (
          <DTooltip
            tooltipShow={tooltipShow}
            text={`식단 고민하기 싫다면\n장바구니페이지의 자동구성을 이용하세요`}
            showIcon={true}
            renderCustomIcon={() => (
              <CartIcon source={icons.cartWhiteFilled_36} />
            )}
            boxRight={8}
            triangleRight={SCREENWIDTH / 8 - 8}
            onPressFn={() => {
              setTooltipShow(false);
              updateNotShowAgainList({key: 'homeTooltip', value: true});
              navigate('BottomTabNav', {screen: 'Diet'});
            }}
          />
        ) : (
          <></>
        )} */}
        </HomeContainer>
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
    </Container>
  );
};

export default Search;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const CartIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;
