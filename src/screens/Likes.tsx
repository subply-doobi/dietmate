// doobi util, redux, etc
import {RootState} from '../stores/store';
import {useSelector} from 'react-redux';
import {FOOD_LIST_ITEM_HEIGHT} from '../constants/constants';
import colors from '../styles/colors';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';

// doobi Component
import {
  Col,
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../styles/styledConsts';
import FoodList from '../components/home/FoodList';
import MenuSection from '../components/common/menuSection/MenuSection';

// react-query
import {IProductData} from '../query/types/product';
import {useListDietDetail} from '../query/queries/diet';
import {useListProductMark} from '../query/queries/product';
import {useCallback} from 'react';

const Likes = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {
    data: likeData,
    refetch: refetchLikeData,
    isFetching: likeDataIsFetching,
  } = useListProductMark();
  const {data: dietDetailData} = useListDietDetail(currentDietNo);

  // flatList render fn
  const renderFoodList = useCallback(
    ({item}: {item: IProductData}) =>
      dietDetailData ? <FoodList item={item} screen="LikeScreen" /> : <></>,
    [],
  );
  const extractListKey = useCallback(
    (item: IProductData) => item.productNo,
    [],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: FOOD_LIST_ITEM_HEIGHT,
      offset: FOOD_LIST_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );
  return (
    <Container>
      <MenuSection />
      <Col style={{marginTop: 32, paddingHorizontal: 16}}>
        <Row>
          <ListTitle>찜한 상품 </ListTitle>
          <NoOfFoods>{!!likeData ? ` ${likeData.length}개` : ``}</NoOfFoods>
        </Row>
        <HorizontalLine style={{marginTop: 8}} />
      </Col>
      <FlatList
        data={likeData}
        style={{marginTop: 16}}
        keyExtractor={extractListKey}
        renderItem={renderFoodList}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        windowSize={2}
        maxToRenderPerBatch={7}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        refreshing={likeDataIsFetching}
        onRefresh={refetchLikeData}
      />
    </Container>
  );
};

export default Likes;

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const NoOfFoods = styled(TextSub)`
  font-size: 16px;
`;

const LikeContainer = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;
