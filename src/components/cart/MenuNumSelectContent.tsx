import {useState, SetStateAction, useEffect, useMemo} from 'react';
import {ScrollView, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';

// doobi comps
import {
  BtnCTA,
  BtnText,
  Col,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import MenuNumSelect from './MenuNumSelect';

// util, constants
import {commaToNum, sumUpPrice} from '../../util/sumUp';
import colors from '../../styles/colors';
import {findDietSeq} from '../../util/findDietSeq';
import {BASE_URL} from '../../query/queries/urls';
import {
  SCREENHEIGHT,
  SCREENWIDTH,
  SERVICE_PRICE_PER_PRODUCT,
} from '../../constants/constants';

// react-query
import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
  useListDietTotal,
  useUpdateDietDetail,
} from '../../query/queries/diet';
import {reGroupDietBySeller} from '../../util/common/regroup';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/store';

const MenuNumSelectContent = ({
  setMenuNumSelectShow,
  dietNoToNumControl,
}: {
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
  dietNoToNumControl: string;
}) => {
  // react-query
  const {data: dietData} = useListDiet();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});
  const {data: dietDetailData} = useListDietDetail(dietNoToNumControl);
  const updateDietDetailMutation = useUpdateDietDetail();

  // state
  const initialQty =
    dietDetailData && dietDetailData.length > 0
      ? parseInt(dietDetailData[0].qty, 10)
      : 1;
  const [qty, setQty] = useState(initialQty);
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // useEffect
  useEffect(() => {
    dietDetailData &&
      dietDetailData.length > 0 &&
      setQty(parseInt(dietDetailData[0].qty));
  }, [dietDetailData]);

  // etc
  const {dietSeq} = findDietSeq(dietData, dietNoToNumControl);

  // useMemo
  const {currentDDDataBySeller, otherDietSellerPrice} = useMemo(() => {
    if (!dietDetailData || !dietTotalData)
      return {currentDDDataBySeller: [], otherDietSellerPrice: {}};

    // 현재 끼니의 판매자별 식품 데이터
    const currentDDDataBySeller = reGroupDietBySeller(dietDetailData);

    // 현재 끼니의 판매자별 식품 데이터 중 판매자명만 추출
    let currentDietSeller: string[] = [];
    currentDDDataBySeller.forEach(menu => {
      !currentDietSeller.includes(menu[0].platformNm) &&
        currentDietSeller.push(menu[0].platformNm);
    });

    // 다른 끼니의 현재끼니 판매자의 식품 데이터
    const otherDDDataBySeller = dietTotalData
      .map(menu => menu.data)
      .filter(menu => menu && menu[0]?.dietNo !== currentDietNo)
      .filter(menu => menu && currentDietSeller.includes(menu[0]?.platformNm));

    // 다른 끼니의 현재끼니 판매자의 식품 데이터 중 판매자별 금액 합산
    let otherDietSellerPrice: {[key: string]: number} = {};
    otherDDDataBySeller.forEach(menu => {
      const seller = menu && menu[0].platformNm;
      if (!seller) return;
      otherDietSellerPrice[seller] = sumUpPrice(menu, true);
    });

    return {
      currentDDDataBySeller,
      otherDietSellerPrice,
    };
  }, [dietData, dietDetailData, dietTotalData]);

  const saveQty = () => {
    updateDietDetailMutation.mutate({
      dietNo: dietNoToNumControl,
      qty: String(qty),
    });
    setMenuNumSelectShow(false);
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 168}}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <Col>
            <HorizontalSpace height={24} />
            <TitleText>{dietSeq}</TitleText>

            {/* 현재 끼니 식품 리스트 */}
            <HorizontalSpace height={8} />
            {dietDetailData &&
              dietDetailData.map((food, idx) => (
                <Row
                  key={idx}
                  style={{
                    width: SCREENWIDTH - 32 - 40 - 8,
                    marginTop: 16,
                  }}>
                  <ThumbnailImg
                    source={{uri: `${BASE_URL}${food.mainAttUrl}`}}
                  />
                  <Col
                    style={{
                      width: '100%',
                      marginLeft: 8,
                    }}>
                    <TextGrey>{food.platformNm}</TextGrey>
                    <Row
                      style={{
                        width: '100%',
                      }}>
                      <Col style={{flex: 1}}>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {food.productNm}
                        </Text>
                      </Col>
                      <TextGrey style={{marginLeft: 8, textAlign: 'right'}}>
                        {commaToNum(
                          parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT,
                        )}
                        원
                      </TextGrey>
                    </Row>
                  </Col>
                </Row>
              ))}
            <HorizontalLine style={{marginTop: 24}} />

            {/* 전체 끼니 중 현재 끼니 판매자별 금액 보여주기 */}
            <HorizontalSpace height={24} />
            <TitleText>해당 식품사 총 금액</TitleText>
            <HorizontalSpace height={8} />
            {dietDetailData &&
              dietDetailData?.length > 0 &&
              currentDDDataBySeller &&
              currentDDDataBySeller.map((seller, idx) => {
                const currentSellerPrice = sumUpPrice(seller) * qty;
                const sellerPriceInOtherDiet =
                  otherDietSellerPrice[seller[0].platformNm] || 0;
                const sellerPrice = currentSellerPrice + sellerPriceInOtherDiet;
                const sellerShippingPrice = seller[0].shippingPrice;
                const freeShippingPrice = parseInt(seller[0].freeShippingPrice);
                const noticeText =
                  freeShippingPrice <= sellerPrice
                    ? '무료'
                    : `${commaToNum(sellerShippingPrice)}원 (${commaToNum(
                        freeShippingPrice - sellerPrice,
                      )}원 더 담으면 무료배송)`;

                return (
                  <Col key={idx} style={{marginTop: 16}}>
                    <Text>{seller[0].platformNm}</Text>
                    <HorizontalSpace height={12} />
                    <TextGrey>식품 : {commaToNum(sellerPrice)}원</TextGrey>
                    <TextGrey>배송비 : {noticeText}</TextGrey>
                  </Col>
                );
              })}
          </Col>
        </TouchableWithoutFeedback>
      </ScrollView>

      <Col style={{marginTop: -144}}>
        {/* 수량조절버튼 */}
        <Col style={{alignSelf: 'flex-end'}}>
          <MenuNumSelect
            disabled={!dietDetailData || dietDetailData.length === 0}
            action="setQty"
            setQty={setQty}
            currentQty={qty}
          />
        </Col>
        <HorizontalSpace height={40} />

        {/* 취소 - 수량적용 버튼 */}
        <BtnBox>
          <BtnCTA
            height={48}
            width={(SCREENWIDTH - 16 - 16 - 8) / 2}
            btnStyle="border"
            onPress={() => setMenuNumSelectShow(false)}>
            <BtnText style={{color: colors.textSub}}>취소</BtnText>
          </BtnCTA>
          <BtnCTA
            height={48}
            width={(SCREENWIDTH - 16 - 16 - 8) / 2}
            btnStyle="activated"
            onPress={() => saveQty()}>
            <BtnText>수량 적용</BtnText>
          </BtnCTA>
        </BtnBox>
      </Col>
    </Container>
  );
};

export default MenuNumSelectContent;

const Container = styled.View`
  width: ${SCREENWIDTH - 32}px;
  height: ${SCREENHEIGHT - 200}px;
`;

const TitleText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const ThumbnailImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

const TextGrey = styled(TextSub)`
  font-size: 14px;
`;
const Text = styled(TextMain)`
  font-size: 14px;
`;

const BtnBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
