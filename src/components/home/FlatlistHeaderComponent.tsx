//RN, 3rd
import {Animated, TextInput} from 'react-native';
import {SetStateAction, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
//doobi util, redux, etc
import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';
//doobi Component
import {
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {useDispatch, useSelector} from 'react-redux';
import {
  applySortFilter,
  copySortFilter,
  initializeSearch,
  updateSearch,
} from '../../stores/slices/sortFilterSlice';
import {RootState} from '../../stores/store';
import Filter from './Filter';
import {SORT_LIST} from '../../constants/constants';

interface ISortImg {
  [key: string]: any;
  ASC: any;
  DESC: any;
  '': any;
}
const sortImg: ISortImg = {
  ASC: icons.sortAscending_24,
  DESC: icons.sortDescending_24,
  '': icons.sort_24,
};

interface IFlatlistHeaderComponent {
  translateY: any;
  searchedNum: number | undefined;
  setFilterModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  setSortModalShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const FlatlistHeaderComponent = ({
  translateY,
  searchedNum,
  setSortModalShow,
  setFilterModalShow,
}: IFlatlistHeaderComponent) => {
  // redux
  const dispatch = useDispatch();
  const {copied: sortFilterCopied, applied: sortFilterApplied} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  //state
  const [searchBarFocus, setSearchBarFocus] = useState(false);

  // ref
  const searchInputRef = useRef<TextInput | null>(null);
  useEffect(() => {
    searchBarFocus &&
      sortFilterCopied.filter.search === '' &&
      searchInputRef.current?.focus();
  }, [searchBarFocus]);

  useEffect(() => {
    sortFilterApplied.filter.search !== '' && setSearchBarFocus(true);
  }, [sortFilterApplied]);

  // etc
  // 현재 정렬 value, label
  const sortKey = Object.keys(sortFilterApplied.sort).find(
    key => sortFilterApplied.sort[key],
  );
  const sortValue = sortKey ? sortFilterApplied.sort[sortKey] : '';
  const sortLabel = sortKey
    ? SORT_LIST[SORT_LIST.findIndex(item => item.name === sortKey)].label
    : '정렬';

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        transform: [{translateY: translateY}],
        zIndex: 10000,
        backgroundColor: 'white',
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

          <NoOfFoods>{searchedNum ? `${searchedNum}개` : ``}</NoOfFoods>

          {searchBarFocus ? (
            <SearchBox style={{flex: 1, marginRight: 8}}>
              <SearchInput
                onChangeText={text => dispatch(updateSearch(text))}
                value={sortFilterCopied.filter.search}
                ref={searchInputRef}
                placeholder="검색어 입력"
                onSubmitEditing={() => dispatch(applySortFilter())}
              />
              <SearchCancelBtn
                onPress={() => {
                  dispatch(initializeSearch());
                  dispatch(applySortFilter());
                  setSearchBarFocus(false);
                }}>
                <SearchCancelImage source={icons.cancelRound_24} />
              </SearchCancelBtn>
            </SearchBox>
          ) : (
            <SearchBtn onPress={() => setSearchBarFocus(true)}>
              <SearchImage source={icons.search_18} />
            </SearchBtn>
          )}
        </Row>

        {/* 정렬 */}
        <SortBtn
          onPress={() => {
            // sort bottom sheet 열 때 적용되어있는 sort, filter 복사
            dispatch(copySortFilter());
            setSortModalShow(true);
          }}>
          <SortBtnText>{sortLabel}</SortBtnText>
          <SortImage source={sortImg[sortValue]} />
        </SortBtn>
      </Row>

      <HorizontalLine style={{marginTop: 8}} />
      <HorizontalSpace height={8} />

      {/* 필터 (검색 제외) */}
      <Filter
        setFilterModalShow={setFilterModalShow}
        setSearchBarFocus={setSearchBarFocus}
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
