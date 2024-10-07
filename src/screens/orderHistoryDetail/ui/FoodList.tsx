// 3rd
import Config from 'react-native-config';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

// doobi
import {RootState} from '../../../app/store/reduxStore';
import {IProductData} from '../../../shared/api/types/product';
import {IOrderedProduct} from '../../../shared/api/types/order';
import {SERVICE_PRICE_PER_PRODUCT} from '../../../shared/constants';
import {icons} from '../../../shared/iconSource';
import {commaToNum} from '../../../shared/utils/sumUp';
import colors from '../../../shared/colors';
import {
  useListDietTotalObj,
  useCreateDietDetail,
  useDeleteDietDetail,
} from '../../../shared/api/queries/diet';
import {
  Col,
  Row,
  HorizontalLine,
  TextMain,
  TextSub,
} from '../../../shared/ui/styledComps';

const FoodList = ({menu}: {menu: IOrderedProduct[]}) => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dDData = dTOData?.[currentDietNo]?.dietDetail ?? [];
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();

  // etc
  const onAdd = (item: IProductData) => {
    addMutation.mutate({dietNo: currentDietNo, food: item});
  };
  const onDelete = (item: IProductData) => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item?.productNo,
    });
  };

  return menu.map((item, thumbnailIndex: number) => (
    <Col key={thumbnailIndex} style={{marginTop: 24}}>
      <Row style={{alignItems: 'flex-start'}}>
        <ThumbnailImage
          source={{uri: `${Config.BASE_URL}${item?.mainAttUrl}`}}
        />
        <Col
          style={{
            marginLeft: 8,
            flex: 1,
          }}>
          <MakeVertical>
            <SellerText>{item.platformNm}</SellerText>
            <ProductNmText numberOfLines={1} ellipsizeMode="tail">
              {item.productNm}
            </ProductNmText>
            <NutrientText numberOfLines={1} ellipsizeMode="tail">
              칼 <NutrientValue>{parseInt(item.calorie)}kcal</NutrientValue>
              {'    '}탄 <NutrientValue>{parseInt(item.carb)}g</NutrientValue>
              {'    '}단{' '}
              <NutrientValue>{parseInt(item.protein)}g</NutrientValue>
              {'    '}지 <NutrientValue>{parseInt(item.fat)}g</NutrientValue>
            </NutrientText>
          </MakeVertical>
          {currentDietNo && (
            <>
              {dDData?.find(({productNo}) => productNo === item.productNo) ? (
                <DeleteBtn
                  onPress={() => {
                    onDelete(item);
                  }}>
                  <DeleteImage source={icons.cancelRound_24} />
                </DeleteBtn>
              ) : (
                <PlusBtn
                  onPress={() => {
                    onAdd(item);
                  }}>
                  <PlusImage source={icons.plusRoundSmall_24} />
                </PlusBtn>
              )}
            </>
          )}
        </Col>
      </Row>
      <ProductPrice>
        {commaToNum(parseInt(item.price) + SERVICE_PRICE_PER_PRODUCT)}원
      </ProductPrice>

      <HorizontalLine />
    </Col>
  ));
};

export default FoodList;

const MakeVertical = styled.View`
  flex-direction: column;
`;

const PlusBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
`;
const PlusImage = styled.Image`
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
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
  background-color: ${colors.white};
`;

const ProductNmText = styled(TextMain)`
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

const TotalPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
  margin-top: 16px;
`;

const OrderLinkBtn = styled.TouchableOpacity`
  height: 24px;
  align-self: flex-end;
  margin-top: 12px;
  padding-right: 4px;
`;
const OrderLinkText = styled(TextMain)`
  font-size: 12px;
  color: ${colors.main};
`;

const ProductPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 80px;
  margin-bottom: 16px;
`;
