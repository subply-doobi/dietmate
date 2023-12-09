import {useState, SetStateAction, useEffect} from 'react';
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
import {commaToNum, reGroupBySeller, sumUpPrice} from '../../util/sumUp';
import colors from '../../styles/colors';
import {findDietSeq} from '../../util/findDietSeq';
import {BASE_URL} from '../../query/queries/urls';
import {SCREENWIDTH} from '../../constants/constants';

// react-query
import {
  useListDiet,
  useListDietDetail,
  useUpdateDietDetail,
} from '../../query/queries/diet';

const MenuNumSelectContent = ({
  setMenuNumSelectShow,
  dietNoToNumControl,
}: {
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
  dietNoToNumControl: string;
}) => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietDetailData} = useListDietDetail(dietNoToNumControl);
  const updateDietDetailMutation = useUpdateDietDetail();

  // state
  const initialQty =
    dietDetailData && dietDetailData.length > 0
      ? parseInt(dietDetailData[0].qty, 10)
      : 1;
  const [qty, setQty] = useState(initialQty);

  // useEffect
  useEffect(() => {
    dietDetailData &&
      dietDetailData.length > 0 &&
      setQty(parseInt(dietDetailData[0].qty));
  }, [dietDetailData]);

  // etc
  const {dietSeq} = findDietSeq(dietData, dietNoToNumControl);
  const productNum = dietDetailData ? dietDetailData.length : 0;
  const regroupedDDData = reGroupBySeller(dietDetailData);
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
          <>
            <HorizontalSpace height={12} />
            <TitleText>{dietSeq}</TitleText>

            {/* 현재 끼니 식품 리스트 */}
            <HorizontalSpace height={8} />
            {dietDetailData &&
              dietDetailData.map(
                (food, idx) =>
                  idx < 2 && (
                    <Row key={idx} style={{marginTop: 16}}>
                      <ThumbnailImg
                        source={{uri: `${BASE_URL}${food.mainAttUrl}`}}
                      />
                      <Col
                        style={{
                          flex: 1,
                          marginLeft: 8,
                        }}>
                        <TextGrey>{food.platformNm}</TextGrey>
                        <Row style={{justifyContent: 'space-between'}}>
                          <Text numberOfLines={1} ellipsizeMode="tail">
                            {food.productNm}
                          </Text>
                          <TextGrey>{commaToNum(food.price)}원</TextGrey>
                        </Row>
                      </Col>
                    </Row>
                  ),
              )}
            <PlusNum>외 {productNum - 2}개 상품</PlusNum>
            <HorizontalLine style={{marginTop: 24}} />

            {/* 전체 끼니 중 현재 끼니 상품들 판매자별로 보여주기 */}
            <HorizontalSpace height={24} />
            <TitleText>전체 끼니 중</TitleText>
            <HorizontalSpace height={8} />
            {dietDetailData &&
              dietDetailData?.length > 0 &&
              regroupedDDData &&
              regroupedDDData.map((seller, idx) => {
                const sellerPrice = sumUpPrice(seller) * qty;
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
          </>
        </TouchableWithoutFeedback>
      </ScrollView>

      <Col style={{marginTop: -144}}>
        {/* 수량조절버튼 */}
        <Col style={{alignSelf: 'flex-end'}}>
          <MenuNumSelect
            disabled={!dietDetailData || dietDetailData.length === 0}
            isForOpenModal={false}
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
  width: 100%;
  height: 638px;
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

const PlusNum = styled(TextSub)`
  font-size: 12px;

  margin-top: 24px;
  align-self: center;
`;

const BtnBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
