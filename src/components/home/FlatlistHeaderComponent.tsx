import {Animated, TextInput} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import colors from '../../styles/colors';
import {
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {icons} from '../../assets/icons/iconSource';
import DBottomSheet from '../common/DBottomSheet';
import SortModalContent from './SortModalContent';
import FilterHeader from './FilterHeader';

interface IFlatlistHeaderComponent {
  translateY: any;
  remainNutrProductData: any;
  setRemainNutrProductData: any;
  productData: any;
  searchText: any;
  setSearchText: any;
  refetchProduct: any;
  sortImageToggle: any;
  setSortParam: any;
  sortParam: any;
  setFilterModalShow: any;
  filterParams: any;
  setFilterIndex: any;
  categoryName: any;
}
const FlatlistHeaderComponent = ({
  translateY,
  remainNutrProductData,
  setRemainNutrProductData,
  productData,
  searchText,
  setSearchText,
  refetchProduct,
  sortImageToggle,
  setSortParam,
  sortParam,
  setFilterModalShow,
  filterParams,
  setFilterIndex,
  categoryName,
}: IFlatlistHeaderComponent) => {
  //state
  const [sortModalShow, setSortModalShow] = useState(false);
  const [searchBarFocus, setSearchBarFocus] = useState(false);

  // ref
  const searchInputRef = useRef<TextInput | null>(null);
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchBarFocus]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        transform: [{translateY: translateY}],
        zIndex: 10000,
        backgroundColor: colors.white,
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
        filterHeaderText={categoryName}
        setRemainNutrProductData={setRemainNutrProductData}
      />

      <HorizontalSpace height={16} />
    </Animated.View>
  );
};

export default FlatlistHeaderComponent;

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
