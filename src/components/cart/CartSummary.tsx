import {View} from 'react-native';
import styled from 'styled-components/native';

import {TextMain, TextSub} from '../../styles/StyledConsts';
import {commaToNum, reGroupBySeller, sumUpPrice} from '../../util/sumUp';

import {
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';
import colors from '../../styles/colors';
import {findMenuIncludingSeller} from '../../util/findMenuIncludingProduct';
import {SetStateAction, useEffect} from 'react';

interface ICartSummary {
  setActiveSections: React.Dispatch<SetStateAction<number[]>>;
}
const CartSummary = ({setActiveSections}: ICartSummary) => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietAllData} = useListDietDetailAll();
  const dietTotalData = useListDietTotal(dietData, {
    enabled: !!dietData,
  });

  const reGroupedProducts = dietAllData && reGroupBySeller(dietAllData);
  return (
    <TotalSummaryContainer>
      {reGroupedProducts?.map((seller, idx) => {
        const sellerProductPrice = sumUpPrice(seller);

        const sellerFreeShippingPrice = parseInt(seller[0].freeShippingPrice);
        const sellershippingPrice =
          sellerProductPrice < parseInt(seller[0].freeShippingPrice)
            ? seller[0].shippingPrice
            : 0;
        return (
          <View key={idx}>
            <SellerText>{seller[0]?.platformNm}</SellerText>
            {dietData && (
              <MenuFoundBox>
                {dietTotalData &&
                  findMenuIncludingSeller(
                    dietData,
                    dietTotalData,
                    seller[0].platformNm,
                  ).map(menu => (
                    <MenuFoundBtn
                      key={menu.dietSeq}
                      onPress={() => setActiveSections([menu.idx])}>
                      <MenuFoundText>{menu.dietSeq}</MenuFoundText>
                    </MenuFoundBtn>
                  ))}
                <MenuFoundText>에 포함되어 있습니다</MenuFoundText>
              </MenuFoundBox>
            )}
            <SellerProductPrice>
              식품: {commaToNum(sellerProductPrice)} 원 ({seller.length}개)
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
  padding: 0px 16px 24px 16px;
  background-color: ${colors.white};
`;

const SellerText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 24px;
`;

const SellerProductPrice = styled(TextMain)`
  font-size: 15px;
  margin-top: 6px;
`;
const SellerShippingPrice = styled(TextSub)`
  font-size: 15px;
`;

const MenuFoundBox = styled.View`
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
`;

const MenuFoundBtn = styled.TouchableOpacity`
  margin-right: 4px;
  height: 24px;
  width: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: ${colors.white};
  border-width: 1px;
  border-color: ${colors.inactivated};
`;

const MenuFoundText = styled(TextMain)`
  font-size: 12px;
`;
