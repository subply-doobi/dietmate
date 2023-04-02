import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  TouchableWithoutFeedback,
  FlatList,
  View,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
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
} from '../../styles/styledConsts';
import {FOOD_LIST_ITEM_HEIGHT, categoryCode} from '../../constants/constants';
import colors from '../../styles/colors';
import {queryFn} from '../../query/queries/requestFn';
import {IProductData, IProductsData} from '../../query/types/product';
import {SCREENWIDTH} from '../../constants/constants';
import {findDietSeq} from '../../util/findDietSeq';

import NutrientsProgress from '../../components/common/NutrientsProgress';
import MenuSelect from '../../components/common/MenuSelect';
import FoodList from '../../components/home/FoodList';
import DBottomSheet from '../../components/common/DBottomSheet';
import SortModalContent from '../../components/home/SortModalContent';
import FilterModalContent from '../../components/home/FilterModalContent';
import FilterHeader from '../../components/home/FilterHeader';
import DTooltip from '../../components/common/DTooltip';
import MenuSelectCard from '../../components/cart/MenuSelectCard';
import DAlert from '../../components/common/alert/DAlert';
import DeleteAlertContent from '../../components/common/alert/DeleteAlertContent';

import {LIST_DIET} from '../../query/queries/urls';
import {
  useListDietDetail,
  useListDiet,
  useDeleteDiet,
} from '../../query/queries/diet';
import {useListProduct} from '../../query/queries/product';
import {ScrollView} from 'react-native-gesture-handler';
import {IDietData} from '../../query/types/diet';

const Home = () => {
  // redux
  const dispatch = useDispatch();
  const {listTitle} = useSelector((state: RootState) => state.filter);
  const {currentDietNo, totalFoodListIsLoaded} = useSelector(
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

  let filterHeight = true;
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const deleteDietMutation = useDeleteDiet();
  const onDeleteDiet = () => {
    if (!dietData) {
      return;
    }
    dietNoToDelete && deleteDietMutation.mutate({dietNo: dietNoToDelete});
    setDeleteAlertShow(false);
  };

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
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const {data: dietData} = useListDiet();
  const {
    data: tData,
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
      dietDetailData ? <FoodList item={item} /> : <></>,
    [tData],
  );
  const extractListKey = useCallback(
    (item: IProductData) => item.productNo,
    [tData],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: FOOD_LIST_ITEM_HEIGHT + 20,
      offset: (FOOD_LIST_ITEM_HEIGHT + 20) * index,
      index,
    }),
    [tData],
  );
  // const getSeperator = useCallback(() => <HorizontalSpace height={20} />, []);

  return (
    <Container>
      <MenuSection>
        <HeaderRow>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <MenuSelectCard />
          </ScrollView>
          <DeleteBtn
            onPress={() => {
              setDietNoToDelete(currentDietNo);
              setDeleteAlertShow(true);
            }}>
            <DeleteImg source={icons.deleteRound_18} />
          </DeleteBtn>
        </HeaderRow>
        <DAlert
          alertShow={deleteAlertShow}
          renderContent={() => (
            <DeleteAlertContent
              deleteText={
                dietData ? findDietSeq(dietData, dietNoToDelete).dietSeq : ''
              }
            />
          )}
          onConfirm={() => onDeleteDiet()}
          onCancel={() => setDeleteAlertShow(false)}
        />
        <ProgressContainer>
          {currentDietNo && <NutrientsProgress currentDietNo={currentDietNo} />}
        </ProgressContainer>
      </MenuSection>
      <HomeContainer>
        <TouchableWithoutFeedback
          onPress={() => {
            setTooltipShow(false);
          }}>
          <View>
            <Row
              style={{
                justifyContent: 'space-between',
                marginTop: 16,
                width: '100%',
              }}>
              <Row style={{alignItems: 'flex-end', flex: 1}}>
                <ListTitle>{key ? key : '검색된 결과'}</ListTitle>
                <NoOfFoods> {tData?.length}개</NoOfFoods>

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
            <HorizontalSpace height={16} />
            <FilterHeader
              setFilterIndex={setFilterIndex}
              onPress={() => {
                setFilterModalShow(true);
              }}
              filterParams={filterParams}
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
                />
              )}
              onCancel={() => {
                console.log('oncancel');
              }}
              filterHeight={filterHeight}
            />
            <HorizontalSpace height={16} />
          </View>
        </TouchableWithoutFeedback>

        {tData && dietDetailData && (
          <FlatList
            data={tData}
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
          />
        )}
        <DTooltip
          tooltipShow={tooltipShow}
          text={`식단 고민하기 싫다면\n자동구성을 이용해보세요`}
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

const Container = styled.View`
  flex: 1;
`;

const HomeContainer = styled.View`
  padding: 0px 16px 0px 16px;
  flex: 1;
  background-color: ${colors.white};
`;
const MenuSection = styled.View`
  background-color: ${colors.backgroundLight2};
  padding: 0 0 8px;
  width: 100%;
`;
const SearchBox = styled.View`
  flex-direction: row;
  margin-left: 8px;
  height: 32px;
  align-items: center;
  background-color: ${colors.bgBox};
  justify-content: space-between;
`;

const HeaderText = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const DeleteImg = styled.Image`
  width: 18px;
  height: 18px;
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
const FilterBtn = styled.TouchableOpacity`
  height: 20px;
  margin-right: 36px;
`;
const FilterBtnText = styled(TextMain)`
  font-size: 14px;
`;
const DeleteBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
const HeaderRow = styled(Row)`
  justify-content: space-between;
  align-items: flex-end;
`;

const ProgressContainer = styled.View`
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${colors.white};
`;

const SearchImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchBtn = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  margin-left: 12px
  background-color: ${colors.backgroundLight2};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;
