import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useListDiet, useListDietDetailAll} from '../../query/queries/diet';
import {IProductData} from '../../query/types/product';
import {RootState} from '../../stores/store';
import {TextMain, TextSub} from '../../styles/styledConsts';
import {commaToNum, reGroupBySeller, sumUpPrice} from '../../util/sumUp';
import {View} from 'react-native';

const CartSummary = () => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietAllData} = useListDietDetailAll();

  // 끼니1+끼니2+.... 텍스트
  const menuTotalText = dietData?.reduce(
    (acc, cur, idx) =>
      (acc += idx === 0 ? `${cur.dietSeq}` : `+${cur.dietSeq}`),
    '',
  );

  const reGroupedProducts = dietAllData && reGroupBySeller(dietAllData);
  return (
    <TotalSummaryContainer>
      <MenuTotalText>{menuTotalText}</MenuTotalText>
      {reGroupedProducts?.map((seller, idx) => {
        const sellerProductPrice = sumUpPrice(seller);
        const sellerFreeShippingPrice = 30000;
        // TBD | 아직 freeShippingPrice 서버에서 값 못받아서 수기로
        // const sellerFreeShippingPrice = seller[0].freeShippingPrice
        // const sellershippingPrice =
        //   sellerProductPrice < seller[0].freeShippingPrice
        //     ? seller[0].shippingPrice
        //     : 0;
        const sellershippingPrice =
          sellerProductPrice < sellerFreeShippingPrice ? 3000 : 0;
        return (
          <View key={idx}>
            <SellerText>{seller[0]?.platformNm}</SellerText>
            <SellerProductPrice>
              식품: {commaToNum(sellerProductPrice)} 원
            </SellerProductPrice>
            <SellerShippingPrice>
              배송비: {commaToNum(sellershippingPrice)}원 (
              {commaToNum(sellerFreeShippingPrice)}원 이상 무료배송)
            </SellerShippingPrice>
          </View>
        );
      })}
    </TotalSummaryContainer>
  );
};

export default CartSummary;

const TotalSummaryContainer = styled.View`
  padding: 0px 8px 0px 8px;
`;

const MenuTotalText = styled(TextMain)`
  align-self: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 16px;
`;

const SellerText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
`;

const SellerProductPrice = styled(TextMain)`
  font-size: 14px;
  margin-top: 4px;
`;
const SellerShippingPrice = styled(TextSub)`
  font-size: 14px;
`;
