// react, RN, 3rd
import {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, Animated} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi util, redux, etc
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {setCurrentDiet, setTotalFoodList} from '../../stores/slices/cartSlice';
import {setListTitle} from '../../stores/slices/filterSlice';
import {
  FOOD_LIST_ITEM_HEIGHT,
  HOME_FILTER_HEADER_HEIGHT,
  categoryCode,
} from '../../constants/constants';
import {queryFn} from '../../query/queries/requestFn';
import {
  IFilterParams,
  IProductData,
  IProductsData,
} from '../../query/types/product';
import {SCREENWIDTH} from '../../constants/constants';
import {filterAvailableFoods} from '../../util/home/filterUtils';
import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';

// doobi Component
import FoodList from '../../components/home/FoodList';
import DBottomSheet from '../../components/common/DBottomSheet';
import FilterModalContent from '../../components/home/FilterModalContent';
import DTooltip from '../../components/common/DTooltip';
import MenuSection from '../../components/common/menuSection/MenuSection';
import FlatlistHeaderComponent from '../../components/home/FlatlistHeaderComponent';

// react-query
import {LIST_DIET} from '../../query/queries/urls';
import {useListDietDetail} from '../../query/queries/diet';
import {useListProduct} from '../../query/queries/product';
import {IDietData} from '../../query/types/diet';
import {useGetBaseLine} from '../../query/queries/baseLine';
import DAlert from '../../components/common/alert/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

import {useHandleError} from '../../util/handleError';
const Home = () => {
  // navigation
  const {navigate} = useNavigation();
  // console.log('HOME:', useHandleError()(new Error('test')));
  // redux
  const dispatch = useDispatch();
  const {currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.cart,
  );

  // state
  const [productAlertShow, setProductAlertShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    categoryParam: '',
    nutritionParam: {
      calorieParam: [],
      carbParam: [],
      proteinParam: [],
      fatParam: [],
    },
    priceParam: [],
  });

  // react-query
  const {data: baseLineData} = useGetBaseLine(); // 미리 캐싱
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const {
    data: productData,
    refetch: refetchProduct,
    isFetching: productIsFetching,
  } = useListProduct(
    {
      dietNo: currentDietNo,
      searchText,
      categoryCd: filterParams.categoryParam,
      sort: sortParam,
      filter: filterParams,
    },
    {
      enabled: currentDietNo ? true : false,
      onSuccess: (data: IProductsData) => {
        dispatch(setListTitle('전체'));

        if (data.length === 0) setProductAlertShow(true);

        // 처음 앱 켰을 때 totalFoodList를 redux에 저장해놓고 끼니 자동구성에 사용
        if (totalFoodListIsLoaded) return;
        dispatch(setTotalFoodList(data));
      },
    },
  );

  // etc
  // category code로 category name 찾기
  const categoryNameArr = Object.keys(categoryCode);
  const categoryName = categoryNameArr.find(
    name => categoryCode[name] === filterParams.categoryParam,
  );

  // flatList render fn
  const renderFoodList = useCallback(
    ({item}: {item: IProductData}) =>
      dietDetailData ? <FoodList item={item} screen="HomeScreen" /> : <></>,
    [productData],
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
    const initializeDietNo = async () => {
      const initialDietNo = (await queryFn<IDietData>(LIST_DIET))[0].dietNo;
      initialDietNo && dispatch(setCurrentDiet(initialDietNo));
    };
    initializeDietNo();
  }, []);

  // 정렬, 필터 바뀔 때마다 sortImageToggle 바꿔주기
  useEffect(() => {
    const checkSortImageToggle = () => {
      sortParam.includes('DESC')
        ? setSortImageToggle(1)
        : sortParam.includes('ASC')
        ? setSortImageToggle(2)
        : setSortImageToggle(0);
    };
    checkSortImageToggle();
  }, [sortParam]);

  // 정렬, 필터 바뀔 때마다 refetch / 스크롤 맨 위로
  useEffect(() => {
    if (!totalFoodListIsLoaded) return;
    currentDietNo && refetchProduct();
    scrollTop();
  }, [sortParam, filterParams]);

  return (
    <Container>
      {/* 끼니선택, progressBar section */}
      <MenuSection />
      <HomeContainer>
        {/* 검색결과 수 및 정렬 필터 */}
        <FlatlistHeaderComponent
          translateY={translateY}
          productData={productData}
          searchText={searchText}
          setSearchText={setSearchText}
          refetchProduct={refetchProduct}
          sortImageToggle={sortImageToggle}
          setSortParam={setSortParam}
          sortParam={sortParam}
          setFilterModalShow={setFilterModalShow}
          filterParams={filterParams}
          setFilterParams={setFilterParams}
          setFilterIndex={setFilterIndex}
          categoryName={categoryName}
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
            onScroll={e => scrollY.setValue(e.nativeEvent.contentOffset.y)}
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
            navigate('BottomTabNav', {screen: 'Cart'});
          }}
        />
      </HomeContainer>

      {/* 정렬, 필터 모달 */}
      <DBottomSheet
        alertShow={filterModalShow}
        setAlertShow={setFilterModalShow}
        renderContent={() => (
          <FilterModalContent
            closeModal={setFilterModalShow}
            filterParams={filterParams}
            setFilterParams={setFilterParams}
            filterIndex={filterIndex}
          />
        )}
        filterHeight={514}
      />
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

const Container = styled.View`
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
