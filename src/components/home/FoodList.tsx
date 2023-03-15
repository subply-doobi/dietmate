import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import styled from 'styled-components/native';
import colors from '../../styles/colors';
import {Col, Row, TextMain, TextSub} from '../../styles/styledConsts';
import {BASE_URL} from '../../query/queries/urls';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {NavigationProps} from '../../constants/constants';
import {SCREENWIDTH} from '../../constants/constants';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../query/queries/diet';
import {IProductData} from '../../query/types/product';
import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';
import {commaToNum} from '../../util/sumUp';
import {useNavigation} from '@react-navigation/native';
import {addNutr, minusNutr} from '../../stores/slices/cartSlice';

interface IFoodList extends NavigationProps {
  item: IProductData;
  dietDetailData: IProductData[];
}

const FoodList = ({item, dietDetailData}: IFoodList) => {
  const navigation = useNavigation();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // etc
  const onDelete = () => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item.productNo,
    });
    setDeleteAlertShow(false);
  };

  const onAdd = (productNo: string) => {
    addMutation.mutate({dietNo: currentDietNo, productNo});
  };

  return (
    <Container>
      <FoodDetailBtn
        onPress={() => navigation.navigate('FoodDetail', {item: item})}>
        <Row>
          <Thumbnail
            source={{
              uri: `${BASE_URL}${item?.mainAttUrl}`,
            }}
            resizeMode="center"
          />
          <ProductInfoContainer>
            <Col>
              <SellerText numberOfLines={1} ellipsizeMode="tail">
                {item?.platformNm}
              </SellerText>
              <ProductName numberOfLines={2} ellipsizeMode="tail">
                {item?.productNm}
              </ProductName>
            </Col>
            <Price>{commaToNum(item?.price)}원</Price>
          </ProductInfoContainer>
          <AddOrDeleteBtn
            onPress={() => {
              if (item.productChoiceYn === 'Y') {
                // 실제 삭제는 DAlert callback에서!
                setDeleteAlertShow(true);
              } else {
                onAdd(item.productNo);
              }
            }}>
            {item.productChoiceYn === 'Y' ? (
              <AddToCartBtnImage
                source={require('../../assets/icons/24_foodDelete.png')}
              />
            ) : (
              <AddToCartBtnImage
                source={require('../../assets/icons/24_foodAdd.png')}
              />
            )}
          </AddOrDeleteBtn>
        </Row>
      </FoodDetailBtn>

      <NutrSummaryContainer>
        <Nutr>
          <NutrText>칼로리</NutrText>
          <NutrValue> {parseInt(item.calorie)} kcal</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>탄수화물</NutrText>
          <NutrValue> {parseInt(item.carb)} g</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>단백질</NutrText>
          <NutrValue> {parseInt(item.protein)} g</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>지방</NutrText>
          <NutrValue> {parseInt(item.fat)} g</NutrValue>
        </Nutr>
      </NutrSummaryContainer>
      <DAlert
        alertShow={deleteAlertShow}
        confirmLabel="삭제"
        onConfirm={onDelete}
        onCancel={() => {
          setDeleteAlertShow(false);
        }}
        renderContent={() => <DeleteAlertContent dietSeq={'해당식품을'} />}
      />
    </Container>
  );
};

export default FoodList;

const Container = styled.View`
  width: 100%;
`;

const Thumbnail = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  /* background-color: ${colors.highlight}; */
`;

const ProductInfoContainer = styled.View`
  flex: 1;
  height: 100px;
  margin-left: 16px;
  justify-content: space-between;
  /* background-color: ${colors.highlight}; */
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const ProductName = styled(TextMain)`
  margin-top: 4px;
  font-size: 14px;
`;

const Price = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
const NutrSummaryContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 22px;
  border-radius: 5px;
  margin-top: 10px;
  padding: 3px 8px 3px 8px;
  justify-content: space-between;
  background-color: ${colors.bgBox};
`;

const Nutr = styled.View`
  flex-direction: row;
  /* width: ${(SCREENWIDTH - 16) / 5}px; */
`;

const NutrText = styled(TextSub)`
  font-size: 12px;
`;

const NutrValue = styled(TextMain)`
  font-size: 12px;
`;

const AddOrDeleteBtn = styled.TouchableOpacity`
  height: 100%;
  margin-left: 16px;
  align-self: flex-start;
  /* background-color: ${colors.highlight}; */
`;

const AddToCartBtnImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const FoodDetailBtn = styled.TouchableOpacity``;
