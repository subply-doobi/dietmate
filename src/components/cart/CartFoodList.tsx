// react, RN, 3rd
import {SetStateAction, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';
import colors from '../../shared/colors';
import {
  Col,
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import {commaToNum} from '../../shared/utils/sumUp';

import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';

import {BASE_URL} from '../../shared/api/urls';
import {
  useDeleteDietDetail,
  useListDiet,
  useListDietDetail,
} from '../../shared/api/queries/diet';
import {SERVICE_PRICE_PER_PRODUCT} from '../../shared/constants';

interface ICartFoodList {
  selectedFoods: {[key: string]: string[]};
  setSelectedFoods: React.Dispatch<SetStateAction<{[key: string]: string[]}>>;
  dietNo: string;
}

const CartFoodList = ({
  selectedFoods,
  setSelectedFoods,
  dietNo,
}: ICartFoodList) => {
  // navigation
  const navigation = useNavigation();

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietDetailData} = useListDietDetail(dietNo);
  const deleteMutation = useDeleteDietDetail();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [productNoToDelete, setProductNoToDelete] = useState('');

  // etc
  const onDelete = () => {
    dietData &&
      deleteMutation.mutate({
        dietNo: dietNo,
        productNo: productNoToDelete,
      });
    setDeleteAlertShow(false);
  };

  const addToSelected = (productNo: string) => {
    const newArr = selectedFoods[dietNo]
      ? [...selectedFoods[dietNo], productNo]
      : [productNo];
    const newObj = {
      ...selectedFoods,
      [dietNo]: newArr,
    };
    setSelectedFoods(newObj);
  };
  const deleteFromSelected = (productNo: string) => {
    const newObj = {
      ...selectedFoods,
      [dietNo]: [...selectedFoods[dietNo]?.filter(v => v !== productNo)],
    };
    setSelectedFoods(newObj);
  };

  return (
    <Container>
      {dietDetailData?.map((food, idx) => {
        const isSelected = selectedFoods[dietNo]?.includes(food.productNo);
        const checkIconSource = isSelected
          ? icons.checkboxCheckedGreen_24
          : icons.checkbox_24;
        return (
          <FoodBox
            key={idx}
            onPress={() => {
              navigation.navigate('FoodDetail', {
                productNo: food.productNo,
              });
            }}>
            <Row
              style={{
                width: '100%',
                alignItems: 'flex-start',
              }}>
              {/* 식품 이미지 */}
              <ThumbnailImage
                source={{uri: `${BASE_URL}${food.mainAttUrl}`}}
                resizeMode="center"
              />
              <SelectedBtn
                onPress={() =>
                  isSelected
                    ? deleteFromSelected(food.productNo)
                    : addToSelected(food.productNo)
                }>
                <SelectedCheckImage source={checkIconSource} />
              </SelectedBtn>

              {/* 식품정보 */}
              <Col style={{flex: 1, marginLeft: 8}}>
                <Row style={{justifyContent: 'space-between'}}>
                  <SellerText>{food.platformNm}</SellerText>
                </Row>
                <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                  {food.productNm}
                </ProductNmText>

                {/* 영양정보 */}
                <NutrientBox>
                  <NutrientText>
                    칼 <NutrientValue>{parseInt(food.calorie)} </NutrientValue>
                    kcal
                  </NutrientText>
                  <NutrientText>
                    탄 <NutrientValue>{parseInt(food.carb)} </NutrientValue>g
                  </NutrientText>
                  <NutrientText>
                    단 <NutrientValue>{parseInt(food.protein)} </NutrientValue>g
                  </NutrientText>
                  <NutrientText>
                    지 <NutrientValue>{parseInt(food.fat)} </NutrientValue>g
                  </NutrientText>
                </NutrientBox>
                <ProductPrice>
                  {commaToNum(parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT)}
                  원
                </ProductPrice>
              </Col>
              <DeleteBtn
                onPress={() => {
                  setProductNoToDelete(food.productNo);
                  setDeleteAlertShow(true);
                }}>
                <DeleteImage source={icons.cancelRound_24} />
              </DeleteBtn>
            </Row>
          </FoodBox>
        );
      })}
      {/* <HorizontalLine style={{marginTop: 16}} /> */}
      <DAlert
        alertShow={deleteAlertShow}
        confirmLabel="삭제"
        onConfirm={onDelete}
        onCancel={() => {
          setDeleteAlertShow(false);
        }}
        renderContent={() => <DeleteAlertContent deleteText={'해당식품을'} />}
      />
    </Container>
  );
};

export default CartFoodList;

const Container = styled.View`
  width: 100%;
  margin-top: 24px;
  row-gap: 16px;
`;

const FoodBox = styled.TouchableOpacity`
  width: 100%;
`;

const SelectedBtn = styled.TouchableOpacity`
  position: absolute;
  width: 24px;
  height: 24px;
`;

const SelectedCheckImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ThumbnailImage = styled.Image`
  width: 88px;
  height: 88px;
  border-radius: 5px;
`;

const SellerText = styled(TextSub)`
  font-size: 12px;
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  justify-content: flex-start;
  align-items: flex-end;
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ProductNmText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const NutrientBox = styled.View`
  flex-direction: row;
  background-color: ${colors.backgroundLight};
  padding: 2px 4px;
  align-items: center;
  margin-top: 4px;
  column-gap: 12px;
`;

const NutrientText = styled(TextSub)`
  font-size: 12px;
`;
const NutrientValue = styled(TextSub)`
  font-size: 12px;
  font-weight: bold;
`;

const ProductPrice = styled(TextMain)`
  margin-top: 8px;
  font-size: 16px;
`;
