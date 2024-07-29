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
} from '../../shared/ui/styledComps';
import MenuNumSelect from './MenuNumSelect';

// util, constants
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';
import colors from '../../shared/colors';
import {
  SCREENHEIGHT,
  SCREENWIDTH,
  SERVICE_PRICE_PER_PRODUCT,
} from '../../shared/constants';

// react-query
import {
  useListDietTotalObj,
  useUpdateDietDetail,
} from '../../shared/api/queries/diet';
import {
  reGroupBySellerFromDTOData,
  tfDTOToDDA,
} from '../../shared/utils/dataTransform';
import Config from 'react-native-config';

const MenuNumSelectContent = ({
  setMenuNumSelectShow,
  dietNoToNumControl,
}: {
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
  dietNoToNumControl: string;
}) => {
  // react-query
  const {data: dTOData} = useListDietTotalObj();

  const updateDietDetailMutation = useUpdateDietDetail();

  // useMemo
  const {dDData, dDAData} = useMemo(() => {
    const dDData = dTOData?.[dietNoToNumControl]?.dietDetail ?? [];
    const dDAData = dTOData ? tfDTOToDDA(dTOData) : [];
    return {dDData, dDAData};
  }, [dTOData]);

  // state
  const initialQty = dDData.length > 0 ? parseInt(dDData[0].qty, 10) : 1;
  const [qty, setQty] = useState(initialQty);

  // useEffect
  useEffect(() => {
    dDData && dDData.length > 0 && setQty(parseInt(dDData[0].qty));
  }, [dDData]);

  // etc
  const dietSeq = dTOData?.[dietNoToNumControl]?.dietSeq ?? '';

  // useMemo
  const {currentDDDataBySeller, otherDietSellerPrice} = useMemo(() => {
    if (!dDData || !dDAData)
      return {currentDDDataBySeller: [], otherDietSellerPrice: {}};

    // 현재 끼니의 판매자별 식품 데이터
    const currentDTODataBySeller = dTOData
      ? reGroupBySellerFromDTOData({
          [dietNoToNumControl]: dTOData[dietNoToNumControl],
        })
      : {};
    const currentDDDataBySeller = Object.values(currentDTODataBySeller);

    // 현재 끼니의 판매자별 식품 데이터 중 판매자명만 추출
    let currentDietSeller: string[] = [];
    currentDDDataBySeller.forEach(menu => {
      !currentDietSeller.includes(menu[0].platformNm) &&
        currentDietSeller.push(menu[0].platformNm);
    });

    // 다른 끼니의 현재끼니 판매자의 식품 데이터
    const otherDDData = dDAData
      .filter(p => p.dietNo !== dietNoToNumControl)
      .filter(p => p && currentDietSeller.includes(p.platformNm));

    // 다른 끼니의 현재끼니 판매자의 식품 데이터 중 판매자별 금액 합산
    let otherDietSellerPrice: {[key: string]: number} = {};
    otherDDData.forEach(p => {
      const price = parseInt(p.price, 10);
      const productQty = parseInt(p.qty, 10);
      otherDietSellerPrice[p.platformNm] = otherDietSellerPrice[p.platformNm]
        ? (otherDietSellerPrice[p.platformNm] +
            price +
            SERVICE_PRICE_PER_PRODUCT) *
          productQty
        : (price + SERVICE_PRICE_PER_PRODUCT) * productQty;
    });

    return {
      currentDDDataBySeller,
      otherDietSellerPrice,
    };
  }, [dDData, dDAData]);

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
            {dDData.map((food, idx) => (
              <Row
                key={idx}
                style={{
                  width: SCREENWIDTH - 32 - 40 - 8,
                  marginTop: 16,
                }}>
                <ThumbnailImg
                  source={{uri: `${Config.BASE_URL}${food.mainAttUrl}`}}
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
            {dDData?.length > 0 &&
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
            disabled={!dDData || dDData.length === 0}
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
