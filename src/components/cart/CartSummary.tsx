// Description: 장바구니 페이지에서 총 끼니 수, 상품 수, 금액을 보여주는 컴포넌트
//RN, 3rd
import {SetStateAction, useEffect} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

//doobi util, redux, etc
import {useDispatch} from 'react-redux';
import colors from '../../shared/colors';
import {setShippingPrice} from '../../features/reduxSlices/orderSlice';
import {
  applySortFilter,
  updateSearch,
} from '../../features/reduxSlices/sortFilterSlice';
import {icons} from '../../shared/iconSource';
import {
  commaToNum,
  sumUpDietTotal,
  getTotalShippingPrice,
  getSellerShippingPrice,
} from '../../shared/utils/sumUp';

//doobi Component
import {HorizontalLine, TextMain, TextSub} from '../../shared/ui/styledComps';

// react-query
import {useListDietDetailAll} from '../../shared/api/queries/diet';
import {reGroupByDietNo, reGroupDietBySeller} from '../../shared/utils/regroup';

const CartSummary = ({
  setMenuNumSelectShow,
  setDietNoToNumControl,
}: {
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
  setDietNoToNumControl: React.Dispatch<SetStateAction<string>>;
}) => {
  // navigation
  const {navigate} = useNavigation();

  //redux
  const dispatch = useDispatch();

  // react-query
  const {data: dietDetailAllData} = useListDietDetailAll();

  // etc
  // 판매자별 상품 데이터
  const regroupedDDAData =
    dietDetailAllData && reGroupDietBySeller(dietDetailAllData);

  // 총 끼니 수, 상품 수, 금액 계산
  const dietTotalData = reGroupByDietNo(dietDetailAllData);
  const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotalData);

  //총 배송비
  let shippingPriceTotal = getTotalShippingPrice(regroupedDDAData);

  // useEffect
  // 배송비 redux에 저장
  useEffect(() => {
    dispatch(setShippingPrice(shippingPriceTotal));
  }, [shippingPriceTotal, dispatch]);

  const onSearchBtnPress = (platformNm: string) => {
    dispatch(updateSearch(platformNm));
    dispatch(applySortFilter());
    navigate('Search');
  };

  return regroupedDDAData && regroupedDDAData[0].length === 0 ? null : (
    //장바구니 하단에 보여지는 총 끼니 수, 상품 수, 금액
    <TotalSummaryContainer>
      <Row style={{marginTop: 40, justifyContent: 'space-between'}}>
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
        const {sellerPrice, sellerShippingText} = getSellerShippingPrice(item);
        return (
          <View key={index}>
            <Row style={{marginTop: 24, justifyContent: 'space-between'}}>
              <SummarySellerText>{item[0]?.platformNm}</SummarySellerText>
              <SearchBtn onPress={() => onSearchBtnPress(item[0].platformNm)}>
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
                      setDietNoToNumControl(dietItem.dietNo);
                      setMenuNumSelectShow(true);
                    }}>
                    <TextMain>{dietItem.dietSeq}</TextMain>
                  </SmallButton>
                );
              })}
            </Row>
          </View>
        );
      })}

      <HorizontalLine style={{marginTop: 24}} />

      <Row style={{marginTop: 24, justifyContent: 'space-between'}}>
        <SummaryText>상품 가격 (총 {productNum}개)</SummaryText>
        <SummaryValue>{commaToNum(priceTotal)} 원</SummaryValue>
      </Row>
      <Row style={{marginTop: 2, justifyContent: 'space-between'}}>
        <SummmaryTextSub>배송비 합계</SummmaryTextSub>
        <SummaryValueSub>{commaToNum(shippingPriceTotal)}원</SummaryValueSub>
      </Row>
    </TotalSummaryContainer>
  );
};

export default CartSummary;

const TotalSummaryContainer = styled.View`
  padding: 0px 16px 104px 16px;
  background-color: ${colors.white};
`;

const SummaryText = styled(TextMain)`
  font-size: 14px;
`;

const SummmaryTextSub = styled(TextSub)`
  font-size: 14px;
`;

const SummaryValue = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;
const SummaryValueSub = styled(TextSub)`
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
  position: absolute;
  top: 0px;
  right: 0px;
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
