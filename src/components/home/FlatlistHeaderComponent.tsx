//RN, 3rd
import {Animated, TextInput} from 'react-native';
import {SetStateAction, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
//doobi util, redux, etc
import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';
//doobi Component
import DBottomSheet from '../common/DBottomSheet';
import {
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import SortModalContent from './SortModalContent';
import FilterHeader from './FilterHeader';
import {IFilterParams} from '../../query/types/product';

interface IFlatlistHeaderComponent {
  translateY: any;
  productData: any;
  searchText: any;
  setSearchText: any;
  refetchProduct: any;
  sortImageToggle: any;
  setSortParam: any;
  sortParam: any;
  setFilterModalShow: any;
  filterParams: IFilterParams;
  setFilterParams: React.Dispatch<SetStateAction<IFilterParams>>;
  setFilterIndex: any;
  categoryName: any;
}
const FlatlistHeaderComponent = ({
  translateY,
  productData,
  searchText,
  setSearchText,
  refetchProduct,
  sortImageToggle,
  setSortParam,
  sortParam,
  setFilterModalShow,
  filterParams,
  setFilterParams,
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
        transform: [{translateY: translateY}],
        zIndex: 10000,
        backgroundColor: 'white',
        width: '100%',
        marginLeft: 16,
        // paddingLeft: 16,
        // paddingRight: 16,
      }}>
      <Row
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginTop: 16,
          alignItems: 'flex-end',
        }}>
        <Row style={{alignItems: 'flex-end', flex: 1}}>
          <ListTitle>검색된 결과 </ListTitle>

          <NoOfFoods>
            {!!productData ? `${productData?.length}개` : ``}
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
        onCancel={() => {}}
      />
      <HorizontalLine style={{marginTop: 8}} />
      <HorizontalSpace height={8} />
      <FilterHeader
        setFilterIndex={setFilterIndex}
        onPress={() => {
          setFilterModalShow(true);
        }}
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        setSortParam={setSortParam}
        filterHeaderText={categoryName}
        setSearchText={setSearchText}
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
  /* align-items: flex-end; */
  align-items: center;
  /* justify-content: center; */
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
