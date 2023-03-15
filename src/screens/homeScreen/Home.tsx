import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {TouchableWithoutFeedback, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {
  BtnCTA,
  BtnText,
  Container,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';

import NutrientsProgress from '../../components/common/NutrientsProgress';
import colors from '../../styles/colors';
import MenuSelect from '../../components/common/MenuSelect';
import MenuHeader from '../../components/common/MenuHeader';
import {queryFn} from '../../query/queries/requestFn';
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

const Home = () => {
  // state
  const [searchText, setSearchText] = useState('');
  const [menuSelectOpen, setMenuSelectOpen] = useState(false);
  let filterHeight = true;
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortParam, setSortParam] = useState('');
  const [sortImageToggle, setSortImageToggle] = useState(0);
  // console.log('HOME/sortParam:', sortParam);

  //sortParam 안에 DSC면 아래모양, ASC면 위모양 , 없으면 기본모양
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
  const {
    data: tData,
    refetch: refetchProduct,
    isFetching: productIsFetching,
  } = useListProduct(
    {dietNo: currentDietNo, categoryCd: '', sort: sortParam},
    {
      enabled: currentDietNo ? true : false,
      onSuccess: () => {
        dispatch(setListTitle('도시락'));
      },
    },
  );
  useEffect(() => {
    currentDietNo && refetchProduct();
  }, [sortParam]);
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

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
      }}>
      <Container>
        <MenuAndSearchBox>
          <MenuHeader
            menuSelectOpen={menuSelectOpen}
            setMenuSelectOpen={setMenuSelectOpen}
          />
          <SearchInput
            onChangeText={setSearchText}
            value={searchText}
            placeholder="검색어 입력"
            onSubmitEditing={() => console.log('search!!')}
          />
        </MenuAndSearchBox>
        {currentDietNo && <NutrientsProgress currentDietNo={currentDietNo} />}
        <Row style={{justifyContent: 'space-between', marginTop: 32}}>
          <Row>
            <ListTitle>{listTitle}</ListTitle>
            <NoOfFoods> {tData?.length}개</NoOfFoods>
          </Row>
          <SortBtn onPress={() => setSortModalShow(true)}>
            <SortBtnText>정렬</SortBtnText>
            {sortImageToggle === 0 ? (
              <SortImage source={require('../../assets/icons/24_sort.png')} />
            ) : sortImageToggle === 1 ? (
              <SortImage
                source={require('../../assets/icons/24_sort_descending.png')}
              />
            ) : (
              <SortImage
                source={require('../../assets/icons/24_sort_ascending.png')}
              />
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
        />
        <DBottomSheet
          alertShow={filterModalShow}
          setAlertShow={setFilterModalShow}
          renderContent={() => <FilterModalContent filterIndex={filterIndex} />}
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
  flex: 1;
  height: 32px;
  margin-left: 8px;
  border-radius: 4px;
  background-color: ${colors.bgBox};
  padding: 5px 8px 5px 8px;
  font-size: 14px;
  color: ${colors.textSub};
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
