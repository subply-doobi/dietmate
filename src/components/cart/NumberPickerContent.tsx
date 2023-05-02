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
} from '../../styles/StyledConsts';
import {
  commaToNum,
  makePriceObjBySeller,
  reGroupBySeller,
  sumUpPrice,
} from '../../util/sumUp';
import colors from '../../styles/colors';
import {IDietDetailData} from '../../query/types/diet';

import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
  useUpdateDietDetail,
} from '../../query/queries/diet';
import {FREE_SHIPPING_PRICE, SHIPPING_PRICE} from '../../constants/constants';
import {findDietSeq} from '../../util/findDietSeq';

const NumberPickerContent = ({
  setNumberPickerShow,
  dietNoToNumControl,
}: {
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
  dietNoToNumControl: string;
}) => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietDetailAllData} = useListDietDetailAll();
  const {data: dietDetailData} = useListDietDetail(dietNoToNumControl);
  const updateDietDetailMutation = useUpdateDietDetail();

  // state
  const initialQty = dietDetailData ? parseInt(dietDetailData[0].qty, 10) : 1;
  const [number, setNumber] = useState(
    dietDetailData ? parseInt(dietDetailData[0].qty, 10) : 1,
  );

  // etc
  const {dietSeq} = findDietSeq(dietData, dietNoToNumControl);
  const menuPrice = sumUpPrice(dietDetailData);
  const totalPrice = sumUpPrice(dietDetailAllData, true);
  console.log('numberPickerContent.tsx: totalPrice: ', menuPrice, totalPrice);
  const saveQty = () => {
    updateDietDetailMutation.mutate({
      dietNo: dietNoToNumControl,
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
          <DietSeq numberOfLines={1} ellipsizeMode="tail">
            {dietSeq} ({commaToNum(menuPrice)}원)
          </DietSeq>
          <Col style={{marginTop: 16}}>
            {FREE_SHIPPING_PRICE <= totalPrice ? (
              <FreeShippingNotice>배송비 무료!</FreeShippingNotice>
            ) : (
              <FreeShippingPriceText>
                {commaToNum(FREE_SHIPPING_PRICE)} 이상 무료배송 (배송비:{' '}
                {commaToNum(SHIPPING_PRICE)}원)
              </FreeShippingPriceText>
            )}
            <HorizontalSpace height={4} />
            <FreeShippingPriceText>
              (전체끼니 합계:{' '}
              {commaToNum(totalPrice + menuPrice * (number - initialQty))}원)
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
        btnStyle={number >= 0 ? 'activated' : 'inactivated'}
        onPress={saveQty}>
        <BtnText>
          {number}개 ({commaToNum(menuPrice * number)}원)
        </BtnText>
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

const DietSeq = styled(TextMain)`
  font-size: 20px;
  font-weight: bold;
`;
const FreeShippingPriceText = styled(TextMain)`
  font-size: 14px;
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
