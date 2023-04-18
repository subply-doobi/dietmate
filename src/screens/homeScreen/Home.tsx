// react, RN, 3rd
import {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, View, TextInput, Animated} from 'react-native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '../../stores/store';
import {setCurrentDiet, setTotalFoodList} from '../../stores/slices/cartSlice';
import {setListTitle} from '../../stores/slices/filterSlice';
import {icons} from '../../assets/icons/iconSource';
import {
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import {FOOD_LIST_ITEM_HEIGHT, categoryCode} from '../../constants/constants';
import colors from '../../styles/colors';
import {queryFn} from '../../query/queries/requestFn';
import {IProductData, IProductsData} from '../../query/types/product';
import {SCREENWIDTH} from '../../constants/constants';

// doobi Component
import FoodList from '../../components/home/FoodList';
import DBottomSheet from '../../components/common/DBottomSheet';
import SortModalContent from '../../components/home/SortModalContent';
import FilterModalContent from '../../components/home/FilterModalContent';
import FilterHeader from '../../components/home/FilterHeader';
import DTooltip from '../../components/common/DTooltip';

// react-query
import {LIST_DIET} from '../../query/queries/urls';
import {useListDietDetail} from '../../query/queries/diet';
import {useListProduct} from '../../query/queries/product';
import {IDietData} from '../../query/types/diet';
import MenuSection from '../../components/common/menuSection/MenuSection';
import {filterAvailableFoods} from '../../util/home/filterAvailableFoods';
import {useGetBaseLine} from '../../query/queries/baseLine';

const Home = () => {
  // redux
  const dispatch = useDispatch();
  const {totalFoodList, currentDietNo, totalFoodListIsLoaded} = useSelector(
    (state: RootState) => state.cart,
  );

  // navigation
  const {navigate} = useNavigation();

  // state
  const [sortModalShow, setSortModalShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  const [remainNutrProductData, setRemainNutrProductData] = useState<
    IProductData[] | undefined
  >();

  let filterHeight = true;
  //scrollHeader Event
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
  });
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  console.log(filterParams);
  // ref
  const searchInputRef = useRef<TextInput | null>(null);
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchBarFocus]);

  // console.log('HOME/filterParam:', filterParams);
  // console.log('HOME/sortParam:', sortParam);

  const checkSortImageToggle = () => {
    sortParam.includes('DESC')
      ? setSortImageToggle(1)
      : sortParam.includes('ASC')
      ? setSortImageToggle(2)
      : setSortImageToggle(0);
  };
  useEffect(() => {
    checkSortImageToggle();
  }, [sortParam]);

  // react-query
  // const filter.Calorie = params?.filter?.Calorie ? 'Calorie',params?.filter?.Calorie[0],params?.filter?.Calorie[1] : ''
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
  const keyOfcategoryCode = Object.keys(categoryCode);
  const key = keyOfcategoryCode.find(
    key => categoryCode[key] === filterParams.categoryParam,
  );
  // 앱 시작할 때 내가 어떤 끼니를 보고 있는지 redux에 저장해놓기 위해 필요함
  useEffect(() => {
    const initializeDietNo = async () => {
      const initialDietNo = (await queryFn<IDietData>(LIST_DIET))[0].dietNo;
      initialDietNo && dispatch(setCurrentDiet(initialDietNo));
    };
    initializeDietNo();
  }, []);

  // 정렬, 필터 바뀔 때마다 refetch
  useEffect(() => {
    if (!totalFoodListIsLoaded) return;
    currentDietNo && refetchProduct();
  }, [sortParam, filterParams]);

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
  // const getSeperator = useCallback(() => <HorizontalSpace height={20} />, []);
  const flatListRef = useRef<FlatList<IProductData> | null>(null);
  const scrollTop = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };
  useEffect(() => {
    scrollTop();
  }, [filterParams, sortParam]);
  const FlatlistHeaderComponent = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: colors.white,
          zIndex: 100,
          paddingLeft: 16,
          paddingRight: 16,
        }}>
        <Row
          style={{
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 16,
          }}>
          <Row style={{alignItems: 'flex-end', flex: 1}}>
            <ListTitle>검색된 결과</ListTitle>
            <NoOfFoods>
              {' '}
              {remainNutrProductData === undefined
                ? productData?.length
                : remainNutrProductData.length}
              개
            </NoOfFoods>

            {searchBarFocus ? (
              <SearchBox style={{flex: 1, marginRight: 8}}>
                <SearchInput
                  onChangeText={setSearchText}
                  value={searchText}
                  ref={searchInputRef}
                  placeholder="검색어 입력"
                  onSubmitEditing={() => refetchProduct()}
                />
                <SearchCancelBtn
                  onPress={() => {
                    setSearchText('');
                    setSearchBarFocus(false);
                  }}>
                  <SearchCancelImage source={icons.cancelRound_24} />
                </SearchCancelBtn>
              </SearchBox>
            ) : (
              <SearchBtn
                onPress={() => {
                  setSearchBarFocus(true);
                  searchInputRef.current?.focus();
                }}>
                <SearchImage source={icons.search_18} />
              </SearchBtn>
            )}
          </Row>

          <SortBtn onPress={() => setSortModalShow(true)}>
            <SortBtnText>정렬</SortBtnText>
            {sortImageToggle === 0 ? (
              <SortImage source={icons.sort_24} />
            ) : sortImageToggle === 1 ? (
              <SortImage source={icons.sortDescending_24} />
            ) : (
              <SortImage source={icons.sortAscending_24} />
            )}
          </SortBtn>
        </Row>
        <DBottomSheet
          alertShow={sortModalShow}
          setAlertShow={setSortModalShow}
          renderContent={() => (
            <SortModalContent
              closeModal={setSortModalShow}
              setSortParam={setSortParam}
              sortParam={sortParam}
            />
          )}
          onCancel={() => {
            console.log('oncancel');
          }}
        />
        <HorizontalLine style={{marginTop: 8}} />
        <HorizontalSpace height={8} />
        <FilterHeader
          setFilterIndex={setFilterIndex}
          onPress={() => {
            setFilterModalShow(true);
          }}
          filterParams={filterParams}
          filterHeaderText={key}
          setRemainNutrProductData={setRemainNutrProductData}
        />
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
          onCancel={() => {
            console.log('oncancel');
          }}
          filterHeight={filterHeight}
        />
        <HorizontalSpace height={16} />
      </View>
    );
  };
  return (
    <Container>
      <MenuSection />
      <Animated.View
        style={{
          transform: [{translateY}],
          elevation: 4,
          zIndex: 4,
        }}>
        <FlatlistHeaderComponent />
      </Animated.View>

      <HomeContainer>
        {productData &&
        dietDetailData &&
        remainNutrProductData === undefined ? (
          // 일반 필터를 이용한 식품 리스트
          <FlatList
            data={productData}
            keyExtractor={extractListKey}
            renderItem={renderFoodList}
            getItemLayout={getItemLayout}
            // ItemSeparatorComponent={getSeperator}
            initialNumToRender={5}
            windowSize={2}
            maxToRenderPerBatch={7}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            refreshing={productIsFetching}
            onRefresh={refetchProduct}
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
            ref={flatListRef}
            ListHeaderComponent={
              <View style={{marginTop: FOOD_LIST_ITEM_HEIGHT - 50}} />
            }
          />
        ) : (
          // 영양맞춤 필터를 이용한 식품 리스트
          <FlatList
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
              filterAvailableFoods(
                totalFoodList,
                baseLineData,
                dietDetailData,
                setRemainNutrProductData,
              )
            }
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
          />
        )}
        <DTooltip
          tooltipShow={tooltipShow}
          text={`식단 고민하기 싫다면\n자동구성을 이용해보세요`}
          showCheck={true}
          boxRight={8}
          triangleRight={SCREENWIDTH / 8 - 8}
          onPressFn={() => {
            setTooltipShow(false);
            navigate('BottomTabNav', {screen: 'Cart'});
          }}
        />
      </HomeContainer>
    </Container>
  );
};

export default Home;

const Twf = styled.TouchableWithoutFeedback``;
const Container = styled.View`
  flex: 1;
`;

const HomeContainer = styled.View`
flex:1
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;

const SearchBox = styled.View`
  flex-direction: row;
  margin-left: 8px;
  height: 32px;
  align-items: center;
  background-color: ${colors.bgBox};
  justify-content: space-between;
`;

const SearchInput = styled.TextInput`
  border-radius: 4px;
  font-size: 14px;
  color: ${colors.textSub};
  padding: 0 8px;
`;

const SearchCancelBtn = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`;

const SearchCancelImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
const NoOfFoods = styled(TextSub)`
  font-size: 16px;
  font-weight: bold;
`;

const SortBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  height: 32px;
`;

const SortBtnText = styled(TextSub)`
  font-size: 14px;
`;

const SortImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchBtn = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  margin-left: 12px;
  background-color: ${colors.backgroundLight2};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;
