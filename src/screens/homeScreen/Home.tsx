// react, RN, 3rd
import {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, Animated} from 'react-native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {setCurrentDiet, setTotalFoodList} from '../../stores/slices/cartSlice';
import {setListTitle} from '../../stores/slices/filterSlice';
import {FOOD_LIST_ITEM_HEIGHT, categoryCode} from '../../constants/constants';
import {queryFn} from '../../query/queries/requestFn';
import {IProductData, IProductsData} from '../../query/types/product';
import {SCREENWIDTH} from '../../constants/constants';
import {filterAvailableFoods} from '../../util/home/filterAvailableFoods';
import colors from '../../styles/colors';

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

const Home = () => {
  // redux
  const dispatch = useDispatch();
  const {totalFoodList, currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.cart,
  );

  // state
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [remainNutrProductData, setRemainNutrProductData] = useState<
    IProductData[] | undefined
  >();

  // react-query
  const {data: baseLineData} = useGetBaseLine();
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
      filter: {filterParams},
    },
    {
      enabled: currentDietNo ? true : false,
      onSuccess: (data: IProductsData) => {
        dispatch(setListTitle('전체'));

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
          remainNutrProductData={remainNutrProductData}
          setRemainNutrProductData={setRemainNutrProductData}
          productData={productData}
          searchText={searchText}
          setSearchText={setSearchText}
          refetchProduct={refetchProduct}
          sortImageToggle={sortImageToggle}
          setSortParam={setSortParam}
          sortParam={sortParam}
          setFilterModalShow={setFilterModalShow}
          filterParams={filterParams}
          setFilterIndex={setFilterIndex}
          categoryName={categoryName}
        />
        {productData &&
        dietDetailData &&
        remainNutrProductData === undefined ? (
          // 일반 필터를 이용한 식품 리스트
          <FlatList
            contentContainerStyle={{marginTop: 104}} // 숨겨지는 header의 높이만큼 margin
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
            onScroll={e => scrollY.setValue(e.nativeEvent.contentOffset.y)}
            ref={flatListRef}
          />
        ) : (
          // 영양맞춤 필터를 이용한 식품 리스트
          <FlatList
            contentContainerStyle={{marginTop: 104}}
            data={remainNutrProductData}
            renderItem={renderFoodList}
            keyExtractor={extractListKey}
            getItemLayout={getItemLayout}
            initialNumToRender={5}
            windowSize={2}
            maxToRenderPerBatch={7}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            refreshing={productIsFetching}
            onRefresh={() =>
              baseLineData &&
              dietDetailData &&
              filterAvailableFoods(totalFoodList, baseLineData, dietDetailData)
            }
            onScroll={e => scrollY.setValue(e.nativeEvent.contentOffset.y)}
          />
        )}

        {/* 홈화면 기본 툴팁 */}
        <DTooltip
          tooltipShow={tooltipShow}
          text={`식단 고민하기 싫다면\n장바구니페이지의 자동구성을 이용하세요`}
          showCheck={true}
          boxRight={8}
          triangleRight={SCREENWIDTH / 8 - 8}
          onPressFn={() => setTooltipShow(false)}
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
            setRemainNutrProductData={setRemainNutrProductData}
          />
        )}
        filterHeight={514}
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
