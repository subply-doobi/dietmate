import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {TouchableWithoutFeedback, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {
  BtnCTA,
  BtnText,
  Col,
  Container,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {categoryCode} from '../../constants/constants';

import NutrientsProgress from '../../components/common/NutrientsProgress';
import colors from '../../styles/colors';
import MenuSelect from '../../components/common/MenuSelect';
import MenuHeader from '../../components/common/MenuHeader';
import {queryFn} from '../../query/queries/requestFn';
import {useListCategory, useCountCategory} from '../../query/queries/category';
import {LIST_DIET} from '../../query/queries/urls';
import {setCurrentDietNo} from '../../stores/slices/cartSlice';
import {useListProduct} from '../../query/queries/product';
import {setListTitle} from '../../stores/slices/filterSlice';
import FoodList from '../../components/home/FoodList';
import {IProductData} from '../../query/types/product';
import {useListDietDetail} from '../../query/queries/diet';
import DBottomSheet from '../../components/common/DBottomSheet';
import SortModalContent from '../../components/home/SortModalContent';
import FilterModalContent from '../../components/home/FilterModalContent';
import FilterHeader from '../../components/home/FilterHeader';
import DTooltip from '../../components/common/DTooltip';
import {SCREENWIDTH} from '../../constants/constants';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../../assets/icons/iconSource';

const Home = () => {
  // navigation
  const navigation = useNavigation();
  const {navigate} = navigation;

  // state
  const [tooltipShow, setTooltipShow] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [menuSelectOpen, setMenuSelectOpen] = useState(false);
  let filterHeight = true;
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  const [filterCategoryParam, setFilterCategoryParam] = useState('');
  const [filterParams, setFilterParams] = useState({});
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

  // redux
  const dispatch = useDispatch();
  const {listTitle} = useSelector((state: RootState) => state.filter);
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  // const filter.Calorie = params?.filter?.Calorie ? 'Calorie',params?.filter?.Calorie[0],params?.filter?.Calorie[1] : ''
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const keyOfcategoryCode = Object.keys(categoryCode);
  const key = keyOfcategoryCode.find(
    key => categoryCode[key] === filterParams.categoryParam,
  );
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
      enabled: false,
      onSuccess: () => {
        dispatch(setListTitle('전체'));
      },
    },
  );

  useEffect(() => {
    currentDietNo && refetchProduct();
  }, [sortParam, filterParams]);

  useEffect(() => {
    // 앱 시작할 때 내가 어떤 끼니를 보고 있는지 redux에 저장해놓기 위해 필요함
    queryFn(LIST_DIET).then(res => {
      res[0] && dispatch(setCurrentDietNo(res[0]?.dietNo));
    });
  }, []);

  //modal
  const [sortModalShow, setSortModalShow] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const renderFoodList = ({item}: {item: IProductData}) =>
    dietDetailData ? (
      <FoodList item={item} dietDetailData={dietDetailData} />
    ) : (
      <></>
    );

  // const renderFoods = useCallback(
  //   ({item}: {item: IProductData}) =>
  //     dietDetailData ? (
  //       <FoodList item={item} dietDetailData={dietDetailData} />
  //     ) : null,
  //   [],
  // );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setMenuSelectOpen(false);
        setTooltipShow(false);
      }}>
      <Container>
        <MenuAndSearchBox>
          <MenuHeader
            menuSelectOpen={menuSelectOpen}
            setMenuSelectOpen={setMenuSelectOpen}
          />
          <Col style={{flex: 1, justifyContent: 'center'}}>
            <SearchInput
              onChangeText={setSearchText}
              value={searchText}
              placeholder="검색어 입력"
              onSubmitEditing={() => refetchProduct()}
            />
            <SearchCancelBtn
              onPress={() => {
                setSearchText('');
              }}>
              <SearchCancelImage source={icons.cancelRound_24} />
            </SearchCancelBtn>
          </Col>
        </MenuAndSearchBox>
        {currentDietNo && <NutrientsProgress currentDietNo={currentDietNo} />}
        <Row style={{justifyContent: 'space-between', marginTop: 32}}>
          <Row>
            <ListTitle>{key ? key : '검색된 결과:'}</ListTitle>
            <NoOfFoods> {tData?.length}개</NoOfFoods>
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

        {tData && dietDetailData && (
          <FlatList
            data={tData}
            keyExtractor={item => item.productNo}
            renderItem={renderFoodList}
            ItemSeparatorComponent={() => <HorizontalSpace height={16} />}
            initialNumToRender={2}
            windowSize={2}
            maxToRenderPerBatch={1}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            refreshing={productIsFetching}
            onRefresh={refetchProduct}
          />
        )}

        {menuSelectOpen && <MenuSelect setOpen={setMenuSelectOpen} />}
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
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Home;

const MenuAndSearchBox = styled.View`
  flex-direction: row;
  width: 100%;
  height: 48px;
  align-items: center;
`;

const HeaderText = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const Arrow = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchInput = styled.TextInput`
  height: 32px;
  margin-left: 8px;
  border-radius: 4px;
  background-color: ${colors.bgBox};
  padding: 5px 8px 5px 8px;
  font-size: 14px;
  color: ${colors.textSub};
`;

const SearchCancelBtn = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
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
  align-items: center;
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
const FilterMenuContainer = styled.View`
  background: white;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 10px;
`;
