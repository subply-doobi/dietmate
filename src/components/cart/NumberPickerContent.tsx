import styled from 'styled-components/native';
import {
  BtnBottomCTA,
  BtnCTA,
  BtnText,
  Col,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {Text} from 'react-native';
import {
  commaToNum,
  makePriceObjBySeller,
  reGroupBySeller,
} from '../../util/sumUp';
import colors from '../../styles/colors';
import {useState, SetStateAction} from 'react';
import {
  useListDietDetail,
  useListDietDetailAll,
  useUpdateDietDetail,
} from '../../query/queries/diet';
import {RootState} from '../../stores/store';
import {useSelector} from 'react-redux';
import {IDietDetailData} from '../../query/types/diet';

const getCurrentQty = (productNm: string, dietDetail: IDietDetailData) => {
  let currentQty = '';
  dietDetail.forEach(food => {
    if (food.productNm === productNm) {
      currentQty = food.qty;
    }
  });
  return currentQty;
};

const NumberPickerContent = ({
  setNumberPickerShow,
  platformNm,
  productNo,
  productNm,
  price,
  minQty,
  freeShippingPrice,
  shippingPrice,
}: {
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
  platformNm: string;
  productNo: string;
  productNm: string;
  price: string;
  minQty: string;
  freeShippingPrice: string;
  shippingPrice: string;
}) => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: dietDetailData} = useListDietDetail(currentDietNo);
  const {data: dietAllData} = useListDietDetailAll();
  const updateDietDetailMutation = useUpdateDietDetail();

  const currentQty = dietDetailData
    ? getCurrentQty(productNm, dietDetailData)
    : '1';

  // state
  const [number, setNumber] = useState(parseInt(currentQty));

  // etc
  // 판매자별 총액계산
  const reGroupedProducts = dietAllData && reGroupBySeller(dietAllData);
  const priceBySeller =
    reGroupedProducts && makePriceObjBySeller(reGroupedProducts);
  const currentSellerPrice = priceBySeller ? priceBySeller[platformNm] : 0;

  // 현재 설정하는 수량 포함한 총 가격
  const totalPrice =
    currentSellerPrice + (number - parseInt(currentQty)) * parseInt(price);
  const isFreeShipping = totalPrice >= parseInt(freeShippingPrice);
  const minCheck = parseInt(minQty) <= number ? true : false;

  const saveQty = () => {
    updateDietDetailMutation.mutate({
      dietNo: currentDietNo,
      productNo: productNo,
      qty: String(number),
    });
    setNumberPickerShow(false);
  };
  return (
    <Container>
      <Row
        style={{
          marginTop: 40,
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Col style={{flex: 1}}>
          <SellerText>[{platformNm}]</SellerText>
          <ProductNm numberOfLines={1} ellipsizeMode="tail">
            {productNm}
          </ProductNm>
          <Col style={{marginTop: 16}}>
            {isFreeShipping ? (
              <FreeShippingNotice>배송비 무료!</FreeShippingNotice>
            ) : (
              <FreeShippingPriceText>
                {commaToNum(freeShippingPrice)}원 이상 무료배송 (배송비:{' '}
                {commaToNum(shippingPrice)}원)
              </FreeShippingPriceText>
            )}
            <MinQtyText>
              최소주문수량: <MinQtyValue>{minQty}개</MinQtyValue>
            </MinQtyText>
            <HorizontalSpace height={12} />
            <FreeShippingPriceText>
              (현재 [{platformNm}] 상품 전체: {commaToNum(totalPrice)}원)
            </FreeShippingPriceText>
          </Col>
        </Col>
        <Col>
          <BtnPlusMinus onPress={() => setNumber(v => v + 1)}>
            <BtnImage source={require(`../../assets/icons/48_btnPlus.png`)} />
          </BtnPlusMinus>
          <HorizontalSpace height={12} />
          <BtnPlusMinus
            onPress={() => number > parseInt(minQty) && setNumber(v => v - 1)}>
            <BtnImage source={require(`../../assets/icons/48_btnMinus.png`)} />
          </BtnPlusMinus>
        </Col>
      </Row>
      <HorizontalSpace height={56} />
      <BtnCTA
        btnStyle={minCheck ? 'activated' : 'inactivated'}
        onPress={saveQty}>
        <BtnText>{number}개</BtnText>
      </BtnCTA>
    </Container>
  );
};

export default NumberPickerContent;

const Container = styled.View`
  width: 100%;
`;

const SellerText = styled(TextSub)`
  font-size: 14px;
`;

const ProductNm = styled(TextMain)`
  font-size: 20px;
  font-weight: bold;
`;
const FreeShippingPriceText = styled(TextMain)`
  font-size: 14px;
`;
const CurrentPriceText = styled(TextMain)`
  font-size: 14px;
`;

const MinQtyText = styled(TextMain)`
  font-size: 14px;
`;
const MinQtyValue = styled(TextMain)`
  font-size: 14px;
  color: ${colors.warning};
`;
const FreeShippingNotice = styled(TextMain)`
  font-size: 14px;
  color: ${colors.warning};
`;

const BtnPlusMinus = styled.TouchableOpacity`
  margin-left: 8px;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${colors.inactivated};
`;

const BtnImage = styled.Image`
  width: 36px;
  height: 36px;
`;
