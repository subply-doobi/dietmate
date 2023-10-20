import {ActivityIndicator, Linking} from 'react-native';
import styled from 'styled-components/native';

import {
  BtnBottomCTA,
  BtnText,
  TextMain,
  Col,
  Row,
  HorizontalLine,
  HorizontalSpace,
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {IProductData} from '../../query/types/product';
import {commaToNum, reGroupBySeller} from '../../util/sumUp';
import {icons} from '../../assets/icons/iconSource';
import {SCREENWIDTH} from '../../constants/constants';

import {BASE_URL} from '../../query/queries/urls';
import {useListDiet, useListDietDetail} from '../../query/queries/diet';
import {ScrollView} from 'react-native-gesture-handler';
import {useKakaoPayReady, useCreateOrder} from '../../query/queries/order';
import {useUpdateDiet, useCreateDiet} from '../../query/queries/diet';
import {useUpdateOrder, useDeleteOrder} from '../../query/queries/order';

//판매사별로 묶어주기 => util sumUp regroupBySeller 함수에 reduce적용해보기
// const groupBySeller = (arg: any) => {
//   const group = arg.reduce((acc, cur) => {
//     acc[cur.platformNm] = [...(acc[cur.platformNm] || []), cur];
//     return acc;
//   }, {});
//   return group;
// };

interface IProductInfo {
  group: IProductData[];
}
const ProductInfo = ({group}: IProductInfo) => {
  return (
    <Col>
      {group.map((product, index: number) => (
        <Row key={product.productNo} style={{marginTop: 16}}>
          <FoodThumbnail source={{uri: `${BASE_URL}${product?.mainAttUrl}`}} />
          <ProductInfoBox>
            <ProductName>{product?.productNm}</ProductName>
            <PriceAndQuantity>{commaToNum(product?.price)}원</PriceAndQuantity>
            <Row style={{alignSelf: 'flex-end'}}>
              <LinkButton onPress={() => Linking.openURL('https://naver.com')}>
                <LinkText>구매링크</LinkText>
              </LinkButton>
            </Row>
          </ProductInfoBox>
        </Row>
      ))}
    </Col>
  );
};

interface IMenuCard {
  dietNo: string;
  dietSeq: string;
}

const MenuCard = ({dietNo, dietSeq}: IMenuCard) => {
  const {data: dietDetailData, isLoading: isListDietDetailLoading} =
    useListDietDetail(dietNo);
  const reGroupedDataBySeller =
    dietDetailData && reGroupBySeller(dietDetailData);

  if (isListDietDetailLoading) {
    return <ActivityIndicator />;
  }
  return (
    <Card>
      <CardTitle>
        {dietSeq}{' '}
        <CardTitle style={{color: colors.textSub}}>
          (x {dietDetailData && dietDetailData[0]?.qty}개)
        </CardTitle>{' '}
      </CardTitle>
      <HorizontalSpace height={16} />
      <HorizontalLine style={{backgroundColor: colors.black}} />

      <MenuBox>
        {reGroupedDataBySeller?.map((group, index: number) => (
          // 판매자별 구매상품 묶음
          <SellerGroupBox>
            <Row style={{marginTop: 24}}>
              <HomeLinkButton
                onPress={() => Linking.openURL('https://naver.com')}>
                <SellerText>{group[0].platformNm}</SellerText>
                <HomeLinkImage source={icons.mainPurpleLine_20} />
              </HomeLinkButton>
            </Row>

            {/* 각 상품 정보 */}
            <ProductInfo group={group} />

            <HorizontalLine style={{marginTop: 24}} />
          </SellerGroupBox>
        ))}
      </MenuBox>
    </Card>
  );
};

const SelfOrder = () => {
  const {data: listDiet, isLoading: isListDietLoading} = useListDiet();
  const createOrderMutation = useCreateOrder();
  const updateDietMutation = useUpdateDiet();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();
  const createDietMutation = useCreateDiet();

  if (isListDietLoading) {
    return <ActivityIndicator />;
  }
  return (
    <Container>
      <HorizontalSpace height={4} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        {listDiet?.map(diet => (
          <MenuCard
            key={diet.dietNo}
            dietNo={diet.dietNo}
            dietSeq={diet.dietSeq}
          />
        ))}
      </ScrollView>

      {/* 주문내역 저장하기 버튼 */}
      <BtnBottomCTA
        width={SCREENWIDTH - 16}
        btnStyle={'activated'}
        onPress={
          async () => {
            const orderNumber = await createOrderMutation.mutateAsync({});
            updateDietMutation.mutate({
              statusCd: 'SP006005',
              orderNo: orderNumber.orderNo,
            }),
              updateOrderMutation.mutate({
                statusCd: 'SP006005',
                orderNo: orderNumber.orderNo,
                customData: 'SELF_ORDER',
                appScheme: 'string',
                escrow: 'string',
                customerUid: 'string',
                buyDate: 'string',
                productShippingPrice: 'string',
                statusNm: 'string',
              }),
              createDietMutation.mutate();
          }
          // async () => {
          //   const orderNumber = await createOrderMutation.mutateAsync({});
          //   console.log('주문내역 저장하기', orderNumber.orderNo);
          // }
        }>
        <BtnText>주문내역에 저장하기</BtnText>
      </BtnBottomCTA>
    </Container>
  );
};

interface FoodInOneDietProps {
  dietNo: string;
}

export default SelfOrder;

const Container = styled.View`
  flex: 1;
`;

const Card = styled.View`
  background-color: ${colors.white};

  border-radius: 5px;

  margin: 20px 8px 0px 8px;
  padding: 0px 8px 16px 8px;
`;

const CardTitle = styled(TextMain)`
  margin-top: 24px;
  font-size: 16px;
  font-weight: bold;
`;

const MenuBox = styled.View`
  padding: 0px 8px 0px 8px;
`;

const SellerGroupBox = styled.View``;

const HomeLinkButton = styled.TouchableOpacity`
  flex-direction: row;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
`;

const HomeLinkImage = styled.Image`
  width: 20px;
  height: 20px;
`;

const FoodThumbnail = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 5px;
`;

const ProductInfoBox = styled.View`
  margin-left: 8px;

  flex: 1;

  height: 64px;
  padding: 2px 0px 2px 0px;
`;

const ProductName = styled(TextMain)`
  font-size: 12px;
`;

const PriceAndQuantity = styled(TextMain)`
  margin-top: 4px;
  font-size: 16px;
  font-weight: bold;
`;
const LinkButton = styled.TouchableOpacity``;

const LinkText = styled(TextMain)`
  font-size: 12px;
  color: ${colors.main};
`;
