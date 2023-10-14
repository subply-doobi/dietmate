// react, RN, 3rd
import {SetStateAction, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {
  Col,
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import {commaToNum} from '../../util/sumUp';

import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';

import {BASE_URL} from '../../query/queries/urls';
import {
  useDeleteDietDetail,
  useListDiet,
  useListDietDetail,
} from '../../query/queries/diet';

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
      {dietDetailData?.map((food, idx) => (
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
            <ThumbnailImage
              source={{uri: `${BASE_URL}${food.mainAttUrl}`}}
              resizeMode="center"
            />
            {selectedFoods[dietNo]?.includes(food.productNo) ? (
              <SelectedBtn
                onPress={() => {
                  deleteFromSelected(food.productNo);
                }}>
                <SelectedCheckImage source={icons.checkboxCheckedGreen_24} />
              </SelectedBtn>
            ) : (
              <SelectedBtn
                onPress={() => {
                  addToSelected(food.productNo);
                }}>
                <SelectedCheckImage source={icons.checkbox_24} />
              </SelectedBtn>
            )}
            <Col style={{marginLeft: 8, flex: 1}}>
              <Row style={{justifyContent: 'space-between'}}>
                <SellerText>{food.platformNm}</SellerText>
                <DeleteBtn
                  onPress={() => {
                    setProductNoToDelete(food.productNo);
                    setDeleteAlertShow(true);
                  }}>
                  <DeleteImage source={icons.cancelRound_24} />
                </DeleteBtn>
              </Row>
              <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                {food.productNm}
              </ProductNmText>
              <NutrientText numberOfLines={1} ellipsizeMode="tail">
                칼 <NutrientValue>{parseInt(food.calorie)}kcal </NutrientValue>
                {'    '}탄{' '}
                <NutrientValue>{parseInt(food.carb)}g </NutrientValue>
                {'    '}단{' '}
                <NutrientValue>{parseInt(food.protein)}g </NutrientValue>
                {'    '}지 <NutrientValue>{parseInt(food.fat)}g </NutrientValue>
              </NutrientText>
              <Row style={{marginTop: 12, justifyContent: 'space-between'}}>
                <ProductPrice>{commaToNum(food.price)}원</ProductPrice>
              </Row>
            </Col>
          </Row>
          <HorizontalLine style={{marginTop: 16}} />
        </FoodBox>
      ))}
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
  margin-top: 12px;
`;

const FoodBox = styled.TouchableOpacity`
  width: 100%;
  margin-top: 12px;
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
  width: 72px;
  height: 72px;
  background-color: ${colors.highlight};
  border-radius: 3px;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  align-items: flex-end;
  width: 36px;
  height: 36px;
  /* background-color: ${colors.highlight}; */
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ProductNmText = styled(TextMain)`
  margin-top: 8px;
  font-size: 14px;
`;

const NutrientText = styled(TextSub)`
  margin-top: 4px;
  font-size: 12px;
`;
const NutrientValue = styled(TextMain)`
  font-size: 12px;
  font-weight: bold;
`;

const ProductPrice = styled(TextMain)`
  font-size: 16px;
`;
