import {useState, SetStateAction} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {
  BtnCTA,
  BtnText,
  Col,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {
  commaToNum,
  makePriceObjBySeller,
  reGroupBySeller,
} from '../../util/sumUp';
import colors from '../../styles/colors';
import {IDietDetailData} from '../../query/types/diet';

import {
  useListDietDetail,
  useListDietDetailAll,
  useUpdateDietDetail,
} from '../../query/queries/diet';

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
  dietDetailData,
}: {
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
  dietDetailData: IDietDetailData;
}) => {
  // react-query
  const {data: dietAllData} = useListDietDetailAll();
  const updateDietDetailMutation = useUpdateDietDetail();

  const currentQty = '1';
  // const currentQty = dietDetailData
  //   ? getCurrentQty(productNm, dietDetailData)
  //   : '1';

  // state
  const [number, setNumber] = useState(parseInt(currentQty, 10));

  // etc
  // 판매자별 총액계산
  const reGroupedProducts = dietAllData && reGroupBySeller(dietAllData);
  const priceBySeller =
    reGroupedProducts && makePriceObjBySeller(reGroupedProducts);
  const currentSellerPrice = 0;
  // const currentSellerPrice = priceBySeller ? priceBySeller[platformNm] : 0;

  // 현재 설정하는 수량 포함한 총 가격
  const totalPrice =
    currentSellerPrice + (number - parseInt(currentQty)) * 5000;
  const isFreeShipping = totalPrice >= 30000;
  const minCheck = 1 <= number ? true : false;

  const saveQty = () => {
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
          <SellerText>[테스트셀러]</SellerText>
          <ProductNm numberOfLines={1} ellipsizeMode="tail">
            개맛있는 닭가슴살 보끔빱
          </ProductNm>
          <Col style={{marginTop: 16}}>
            {isFreeShipping ? (
              <FreeShippingNotice>배송비 무료!</FreeShippingNotice>
            ) : (
              <FreeShippingPriceText>
                얼마원 이상 무료배송 (배송비: 오백만원)
              </FreeShippingPriceText>
            )}
            <MinQtyText>
              최소주문수량: <MinQtyValue>1개</MinQtyValue>
            </MinQtyText>
            <HorizontalSpace height={12} />
            <FreeShippingPriceText>
              (현재 [테스트셀러] 상품 전체: 오천만원)
            </FreeShippingPriceText>
          </Col>
        </Col>
        <Col>
          <BtnPlusMinus onPress={() => setNumber(v => v + 1)}>
            <BtnImage source={icons.plus_48} />
          </BtnPlusMinus>
          <HorizontalSpace height={12} />
          <BtnPlusMinus onPress={() => number > 1 && setNumber(v => v - 1)}>
            <BtnImage source={icons.minus_48} />
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
  width: 24px;
  height: 24px;
`;
