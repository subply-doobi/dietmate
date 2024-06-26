// react, RN, 3rd
import {SetStateAction, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';
import colors from '../../shared/colors';
import {Icon, Row, TextMain, TextSub} from '../../shared/ui/styledComps';
import {commaToNum} from '../../shared/utils/sumUp';

import DAlert from '../../shared/ui/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';

import {BASE_URL} from '../../shared/api/urls';
import {
  useDeleteDietDetail,
  useListDietTotalObj,
} from '../../shared/api/queries/diet';
import {SERVICE_PRICE_PER_PRODUCT} from '../../shared/constants';

interface IFoodList {
  selectedFoods: {[key: string]: string[]};
  setSelectedFoods: React.Dispatch<SetStateAction<{[key: string]: string[]}>>;
  dietNo: string;
}

const FoodList = ({selectedFoods, setSelectedFoods, dietNo}: IFoodList) => {
  // navigation
  const {navigate} = useNavigation();

  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dietDetailData = dTOData?.[dietNo]?.dietDetail ?? [];
  const deleteMutation = useDeleteDietDetail();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [productNoToDelete, setProductNoToDelete] = useState('');

  // etc
  const onDelete = () => {
    dTOData &&
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
        return (
          <FoodBox key={idx}>
            <Row
              style={{
                width: '100%',
                alignItems: 'flex-start',
              }}>
              {/* 식품 이미지 */}
              <FoodDetailBtn
                onPress={() => {
                  navigate('FoodDetail', {
                    productNo: food.productNo,
                  });
                }}>
                <ThumbnailImage
                  source={{uri: `${BASE_URL}${food.mainAttUrl}`}}
                  resizeMode="center"
                />
              </FoodDetailBtn>
              {isSelected && (
                <SelectedCheckImage source={icons.checkboxCheckedGreen_24} />
              )}

              {/* 식품정보 */}
              <SelectBtn
                onPress={() =>
                  isSelected
                    ? deleteFromSelected(food.productNo)
                    : addToSelected(food.productNo)
                }>
                <Row style={{justifyContent: 'space-between'}}>
                  <SellerText>{food.platformNm}</SellerText>
                </Row>
                <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                  {food.productNm}
                </ProductNmText>

                {/* 영양정보 */}
                <NutrientBox>
                  <NutrientText>
                    칼로리{' '}
                    <NutrientValue>{parseInt(food.calorie)} kcal</NutrientValue>
                  </NutrientText>
                  <Row style={{columnGap: 8}}>
                    <NutrientText>
                      탄 <NutrientValue>{parseInt(food.carb)} g</NutrientValue>
                    </NutrientText>
                    <NutrientText>
                      단{' '}
                      <NutrientValue>{parseInt(food.protein)} g</NutrientValue>
                    </NutrientText>
                    <NutrientText>
                      지 <NutrientValue>{parseInt(food.fat)} g</NutrientValue>
                    </NutrientText>
                  </Row>
                </NutrientBox>
                <ProductPrice>
                  {commaToNum(parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT)}
                  원
                </ProductPrice>
              </SelectBtn>

              <RightBtnBox>
                <DeleteBtn
                  onPress={() => {
                    setProductNoToDelete(food.productNo);
                    setDeleteAlertShow(true);
                  }}>
                  <Icon source={icons.cancelRound_24} />
                </DeleteBtn>
                <ChangeBtn
                  onPress={() => {
                    navigate('Change', {
                      dietNo: dietNo,
                      productNo: food.productNo,
                      food,
                    });
                  }}>
                  <Icon source={icons.changeRound_24} />
                </ChangeBtn>
              </RightBtnBox>
            </Row>
          </FoodBox>
        );
      })}
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

export default FoodList;

const Container = styled.View`
  width: 100%;
  margin-top: 24px;
  row-gap: 20px;
`;

const FoodBox = styled.View`
  width: 100%;
  height: 104px;
`;

const FoodDetailBtn = styled.TouchableOpacity``;

const SelectBtn = styled.TouchableOpacity`
  flex: 1;
  margin: 0 8px;
`;

const SelectedCheckImage = styled.Image`
  position: absolute;

  width: 24px;
  height: 24px;
`;

const ThumbnailImage = styled.Image`
  width: 104px;
  height: 104px;
  border-radius: 5px;
`;

const SellerText = styled(TextSub)`
  margin-left: 4px;
  font-size: 11px;
`;

const RightBtnBox = styled.View`
  width: 32px;
  height: 100%;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.lineLight};
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
`;

const ChangeBtn = styled.TouchableOpacity`
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-color: ${colors.lineLight};
`;

const ProductNmText = styled(TextMain)`
  margin-left: 4px;
  font-size: 14px;
  font-weight: bold;
`;

const NutrientBox = styled.View`
  background-color: ${colors.backgroundLight};
  padding: 8px 4px;
  margin-top: 4px;
  column-gap: 12px;
`;

const NutrientText = styled(TextSub)`
  font-size: 11px;
`;
const NutrientValue = styled(TextMain)`
  font-size: 11px;
`;

const ProductPrice = styled(TextMain)`
  margin-top: 4px;
  margin-left: 4px;
  font-size: 11px;
`;
