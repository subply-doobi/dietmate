// react, RN, 3rd
import {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, Animated, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi util, redux, etc
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../stores/store';
import {setCurrentDiet, setTotalFoodList} from '../stores/slices/cartSlice';
import {
  FOOD_LIST_ITEM_HEIGHT,
  HOME_FILTER_HEADER_HEIGHT,
} from '../constants/constants';
import {IProductData} from '../query/types/product';
import {SCREENWIDTH} from '../constants/constants';
import colors from '../styles/colors';
import {icons} from '../assets/icons/iconSource';
import {checkNotShowAgain, updateNotShowAgain} from '../util/asyncStorage';

// doobi Component
import FoodList from '../components/home/FoodList';
import DBottomSheet from '../components/common/bottomsheet/DBottomSheet';
import FilterModalContent from '../components/home/FilterModalContent';
import DTooltip from '../components/common/tooltip/DTooltip';
import MenuSection from '../components/common/menuSection/MenuSection';
import FlatlistHeaderComponent from '../components/home/FlatlistHeaderComponent';

// react-query
import {
  useListDietDetail,
  useListDiet,
  useCreateDiet,
} from '../query/queries/diet';
import {useListProduct} from '../query/queries/product';
import {useGetBaseLine} from '../query/queries/baseLine';
import DAlert from '../components/common/alert/DAlert';
import CommonAlertContent from '../components/common/alert/CommonAlertContent';

import SortModalContent from '../components/home/SortModalContent';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.cart,
  );
  const {applied: appliedSortFilter, copied: copiedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // state
  const [productAlertShow, setProductAlertShow] = useState(false);
  const [sortModalShow, setSortModalShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(false);

  // react-query
  const {
    data: baseLineData,
    isLoading: baseLineLoading,
    isFetching: isBaseLineFetching,
  } = useGetBaseLine(); // 미리 캐싱
  const {data: dietDetailData, isLoading: listDietLoading} = useListDietDetail(
    currentDietNo,
    {
      enabled: currentDietNo ? true : false,
    },
  );
  const {refetch: refetchListDiet, isSuccess: isListDietSuccess} =
    useListDiet();
  const createDietMutation = useCreateDiet();
  const {
    data: productData,
    refetch: refetchProduct,
    isFetching: productIsFetching,
    isLoading: productIsLoading,
  } = useListProduct(
    {
      dietNo: currentDietNo,
      appliedSortFilter,
    },
    {
      enabled: currentDietNo ? true : false,
      onSuccess: (data: IProductData[]) => {
        if (data.length === 0) setProductAlertShow(true);
        // 처음 앱 켰을 때 totalFoodList를 redux에 저장해놓고 끼니 자동구성에 사용
        if (totalFoodListIsLoaded) return;
        dispatch(setTotalFoodList(data));
      },
    },
  );

  // flatList render fn
  const renderFoodList = useCallback(
    ({item}: {item: IProductData}) =>
      dietDetailData ? <FoodList item={item} screen="HomeScreen" /> : <></>,
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
  // 앱 시작할 때 내가 어떤 끼니를 보고 있는지 redux에 저장해놓기 위해 필요함
  useEffect(() => {
    const initializeDiet = async () => {
      const dietData = (await refetchListDiet()).data;
      if (!dietData) return;
      if (dietData?.length === 0) {
        createDietMutation.mutateAsync().then(res => {
          dispatch(setCurrentDiet(res.dietNo));
        });
        return;
      }
      dispatch(setCurrentDiet(dietData[0]?.dietNo));
    };

    initializeDiet();
  }, []);

  useEffect(() => {
    //tooltip 관련
    const initializeTooltip = async () => {
      const notShowAgain = await checkNotShowAgain('HOME_TOOLTIP');
      setTooltipShow(!notShowAgain);
    };
    initializeTooltip();
  }, []);

  // 정렬, 필터 바뀔 때마다 refetch / 스크롤 맨 위로
  useEffect(() => {
    if (!totalFoodListIsLoaded) return;
    currentDietNo && refetchProduct();
    scrollTop();
  }, [appliedSortFilter]);

  return (
    <Container>
      {/* 끼니선택, progressBar section */}
      {isBaseLineFetching === false &&
      listDietLoading === false &&
      productIsLoading === false ? (
        <MenuSection />
      ) : (
        <ActivityIndicator />
      )}

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
            onRefresh={refetchProduct}
            progressViewOffset={HOME_FILTER_HEADER_HEIGHT}
            onScroll={e => {
              scrollY.setValue(
                e.nativeEvent.contentOffset.y < 0
                  ? 0
                  : e.nativeEvent.contentOffset.y,
              );
            }}
            ref={flatListRef}
          />
        )}

        {/* 홈화면 기본 툴팁 */}
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
            updateNotShowAgain('HOME_TOOLTIP');
            navigate('BottomTabNav', {screen: 'Cart'});
          }}
        />
      </HomeContainer>

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

export default Home;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeContainer = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;

const CartIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;
