// Description: 장바구니 페이지에서 총 끼니 수, 상품 수, 금액을 보여주는 컴포넌트
//RN, 3rd
import styled from 'styled-components/native';
//doobi util, redux, etc
import colors from '../../styles/colors';
//doobi Component
import {HorizontalLine, TextMain, TextSub} from '../../styles/styledConsts';
import {
  commaToNum,
  reGroupByDietNo,
  reGroupBySeller,
  sumUpDietTotal,
  getTotalShippingPrice,
  priceByPlatform,
} from '../../util/sumUp';

import {useListDietDetailAll} from '../../query/queries/diet';
import {useDispatch} from 'react-redux';
import {setMenuActiveSection} from '../../stores/slices/cartSlice';
import {View} from 'react-native';
import {icons} from '../../assets/icons/iconSource';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {setShippingPrice} from '../../stores/slices/orderSlice';
import {
  applySortFilter,
  updateSearch,
} from '../../stores/slices/sortFilterSlice';

const CartSummary = (props: any) => {
  //state
  const [searchOpen, setSearchOpen] = useState(false);
  // navigation
  const {navigate} = useNavigation();
  const {onScrollToTop} = props;

  //redux
  const dispatch = useDispatch();
  // react-query
  const {data: dietDetailAllData} = useListDietDetailAll();

  //platformNm으로 그룹핑
  const regroupedDDAData =
    dietDetailAllData && reGroupBySeller(dietDetailAllData);

  // 총 끼니 수, 상품 수, 금액 계산
  const dietTotalData = reGroupByDietNo(dietDetailAllData);
  const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotalData);

  //총 배송비 계산
  let shippingPriceTotal = getTotalShippingPrice(
    regroupedDDAData,
    dietDetailAllData,
  );

  // 배송비 redux에 저장
  useEffect(() => {
    dispatch(setShippingPrice(shippingPriceTotal));
  }, [shippingPriceTotal, dispatch]);

  return (
    //장바구니 하단에 보여지는 총 끼니 수, 상품 수, 금액
    <TotalSummaryContainer>
      <Row style={{marginTop: 24, justifyContent: 'space-between'}}>
        <SummaryText>총 끼니 ({menuNum} 개)</SummaryText>
        <SummaryValue>
          끼니 당{' '}
          {menuNum === 0 ? 0 : commaToNum(Math.floor(priceTotal / menuNum))} 원
        </SummaryValue>
      </Row>
      <HorizontalLine style={{marginTop: 8}} />

      {/* //식품사별로 그룹핑 */}
      {regroupedDDAData?.map((item, index) => {
        //식품사별 가격, 배송비 합계
        const {sellerPrice, sellerShippingText} = priceByPlatform(
          dietDetailAllData,
          item[0].platformNm,
        );
        return (
          <View key={index}>
            <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
              <SummarySellerText>{item[0].platformNm}</SummarySellerText>
              <SearchBtn
                onPress={() => (
                  dispatch(updateSearch(item[0].platformNm)),
                  dispatch(applySortFilter()),
                  setSearchOpen(true),
                  navigate('Home', {param: searchOpen})
                )}>
                <SearchImage source={icons.search_18} />
              </SearchBtn>
            </Row>
            <SummaryText style={{marginTop: 12}}>
              식품: {commaToNum(sellerPrice)}원
            </SummaryText>
            <TextSub style={{marginTop: 2}}>
              배송비:
              {sellerShippingText}
            </TextSub>

            {/* 끼니 버튼 렌더링 컴포넌트 */}
            <Row style={{marginTop: 16}}>
              {item.map((dietItem, dietIndex) => {
                //dietItem.dietSeq가 중복일 경우 하나만 가져오기
                const isDietSeq = item.findIndex(
                  i => i.dietSeq === dietItem.dietSeq,
                );
                if (isDietSeq !== dietIndex) {
                  return null;
                }
                //dietItem.dietSeq에서 숫자만 가져오기
                const getNumber = parseInt(
                  dietItem.dietSeq.replace(/[^0-9]/g, ''),
                  10,
                );
                return (
                  <SmallButton
                    key={dietIndex}
                    onPress={() => {
                      dispatch(setMenuActiveSection([getNumber - 1]));
                      onScrollToTop();
                    }}>
                    <TextMain>{dietItem.dietSeq}</TextMain>
                  </SmallButton>
                );
              })}
            </Row>
          </View>
        );
      })}

      <HorizontalLine style={{marginTop: 8}} />

      <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
        <SummaryText>상품 가격 (총 {productNum} 개)</SummaryText>
        <SummaryValue>{commaToNum(priceTotal)} 원</SummaryValue>
      </Row>
      <Row style={{marginTop: 8, justifyContent: 'space-between'}}>
        <SummaryText>배송비 합계</SummaryText>
        <SummaryValue>{commaToNum(shippingPriceTotal)}원</SummaryValue>
      </Row>
    </TotalSummaryContainer>
  );
};

export default CartSummary;

const TotalSummaryContainer = styled.View`
  padding: 0px 16px 24px 16px;
  background-color: ${colors.white};
`;

const SummaryText = styled(TextMain)`
  font-size: 14px;
`;

const SummaryValue = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const SummarySellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const SmallButton = styled.TouchableOpacity`
  width: 46px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid ${colors.lineLight};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const SearchImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const SearchBtn = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  background-color: ${colors.backgroundLight2};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const Row = styled.View`
  flex-direction: row;
`;
