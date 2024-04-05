import React, {useState, useEffect, useMemo} from 'react';
import {
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  View,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {RootState} from '../../app/store/reduxStore';
import {icons} from '../../shared/iconSource';
import {
  BtnCTA,
  BtnText,
  Col,
  Row,
  TextMain,
  TextSub,
  StickyFooter,
  Dot,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {IProductData} from '../../shared/api/types/product';

import NutrientsProgress from '../../components/common/nutrient/NutrientsProgress';
import NutrientPart from './ui/NutrientPart';
import ShippingPart from './ui/ShippingPart';
import FoodPart from './ui/FoodPart';
import BusinessInfo from '../../components/common/businessInfo/BusinessInfo';

import {BASE_URL} from '../../shared/api/urls';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
  useListDietDetailAll,
} from '../../shared/api/queries/diet';
import {SCREENWIDTH, SERVICE_PRICE_PER_PRODUCT} from '../../shared/constants';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {commaToNum, sumUpPriceOfSeller} from '../../shared/utils/sumUp';
import {
  useCreateProductMark,
  useDeleteProductMark,
  useGetProduct,
  useListProductMark,
} from '../../shared/api/queries/product';
import {ITableItem, makeTableData} from './util/makeNutrTable';
import {ActivityIndicator} from 'react-native';

interface IShowPart {
  clicked: string;
  table: ITableItem[];
  data: IProductData;
}
const ShowPart = ({clicked, table, data}: IShowPart) => {
  if (clicked === '영양성분') return <NutrientPart table={table} />;
  if (clicked === '식품상세') return <FoodPart productData={data} />;
  if (clicked === '배송정책')
    return (
      <ShippingPart platformNm={data.platformNm} platformUrl={data.link1} />
    );
  return <NutrientPart table={table} />;
};

const FoodDetail = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // navigation
  const navigation = useNavigation();
  const route = useRoute();

  // react-query
  const {
    data: productData,
    refetch: refetchProduct,
    isFetching,
  } = useGetProduct({
    dietNo: currentDietNo,
    productNo: route?.params?.productNo,
  });
  const {data: likeData} = useListProductMark();
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const {data: dietDetailAllData} = useListDietDetailAll();
  const createProductMarkMutation = useCreateProductMark();
  const deleteProductMarkMutation = useDeleteProductMark();
  const createDietDetailMutation = useCreateDietDetail();
  const deleteDietDetailMutation = useDeleteDietDetail();

  //state
  const [clicked, setClicked] = useState('식품상세');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const detailMenu = ['영양성분', '식품상세', '배송정책'];

  // etc
  const isIncludedInLike =
    productData &&
    likeData?.map(food => food.productNo).includes(productData?.productNo);
  // 식품마다 headerTitle바꾸기
  // TBD : route.params.item 타입 관련 해결 및 만약 null값일 시 에러처리
  useEffect(() => {
    const waitPage = async () => {
      setTimeout(() => setIsPageLoading(false), 500);
    };
    const initializePage = async () => {
      const initialData = (await refetchProduct()).data;
      navigation.setOptions({
        headerTitleContainerStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          headerBackVisible: false,
        },
        headerTitle: () => {
          return (
            // -양쪽 패딩 16px -뒤로가기 36px -장바구니아이콘 36px
            <View style={{width: SCREENWIDTH - 32 - 72}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 18,
                  color: colors.textMain,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {initialData ? initialData.productNm : ''}
              </Text>
            </View>
          );
        },
      });
    };
    waitPage();
    initializePage();
  }, [navigation]);

  const handlePressLikeBtn = () => {
    // TBD : 찜된 목록인지 알 수 있는 API나오면 좋아요기능 완성하기
    if (!productData) return;
    isIncludedInLike
      ? deleteProductMarkMutation.mutate(productData.productNo)
      : createProductMarkMutation.mutate(productData.productNo);
  };

  const handlePressAddCartBtn = () => {
    if (!productData) return;

    productData.productChoiceYn === 'Y'
      ? deleteDietDetailMutation.mutate({
          dietNo: currentDietNo,
          productNo: productData.productNo,
        })
      : createDietDetailMutation.mutate({
          dietNo: currentDietNo,
          food: productData,
        });
  };
  const table = useMemo(() => {
    return makeTableData(productData, baseLineData);
  }, [baseLineData, productData]);

  return !productData || !baseLineData || isPageLoading ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        {/* 영양성분 그래프 */}
        <InnerContainer>
          {!!dietDetailData && (
            <NutrientsProgress dietDetailData={dietDetailData} />
          )}
        </InnerContainer>

        {/* 식품상세정보 */}
        <ScrollView
          style={{flex: 1, zIndex: -1}}
          showsVerticalScrollIndicator={false}>
          <View>
            {/* 식품 썸네일 */}
            <FoodImageContainer
              source={{
                uri: `${BASE_URL}${productData.mainAttUrl}`,
              }}
              style={{resizeMode: 'contain'}}
            />
            <NutritionInImage>
              {/* 테이블 중 칼탄단지 */}
              {[table[0], table[2], table[4], table[5]].map(el => {
                return (
                  <View
                    key={el.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 0.25,
                    }}>
                    <Dot
                      style={{
                        backgroundColor: el.color,
                        marginHorizontal: 8,
                      }}
                    />
                    <Text style={{color: 'white', fontSize: 12}}>
                      {el.column2}
                    </Text>
                  </View>
                );
              })}
            </NutritionInImage>
          </View>

          {/* 식품 정보 텍스트 */}
          <InnerContainer>
            <SellerText style={{marginTop: 20}}>
              [{productData.platformNm}]
            </SellerText>
            <ProductName>{productData.productNm}</ProductName>
            <Row style={{marginTop: 8, justifyContent: 'space-between'}}>
              <Col>
                <ShippingText numberOfLines={1} ellipsizeMode="tail">
                  배송비: {commaToNum(productData.shippingPrice)} 원 (
                  {commaToNum(productData.freeShippingPrice)}원 이상 무료)
                </ShippingText>
                <ShippingText numberOfLines={1} ellipsizeMode="tail">
                  현재 장바구니 {productData.platformNm} 상품 :{' '}
                  <ShippingText style={{color: colors.textMain}}>
                    {commaToNum(
                      sumUpPriceOfSeller(
                        dietDetailAllData,
                        productData.platformNm,
                      ),
                    )}
                    원
                  </ShippingText>
                </ShippingText>
              </Col>
            </Row>
            <Price>
              {commaToNum(
                parseInt(productData.price) + SERVICE_PRICE_PER_PRODUCT,
              )}
              원
            </Price>

            {/* 영양성분 - 식품상세 - 배송정책 */}
            <Row
              style={{
                justifyContent: 'flex-start',
              }}>
              {detailMenu.map((el, index) => {
                return (
                  <React.Fragment key={`${el}-${index}`}>
                    <DetailMenu
                      onPress={() => setClicked(el)}
                      selected={el === clicked}>
                      <DetailMenuText>{el}</DetailMenuText>
                    </DetailMenu>
                  </React.Fragment>
                );
              })}
            </Row>

            {/* 영양성분 - 식품상세 - 배송정책에 따른 내용 */}
            <PartContainer>
              <ShowPart clicked={clicked} table={table} data={productData} />
            </PartContainer>
          </InnerContainer>

          {/* 사업자정보 */}
          <BusinessInfo bgColor={colors.backgroundLight} />
        </ScrollView>
      </Container>
      <View>
        {/* 하단 CTA버튼, like 버튼 */}
        <BtnBox>
          <LikeBtn onPress={handlePressLikeBtn}>
            <Image
              // 조건에 따라서 서로 다른 좋아요 버튼 갖게 할 것
              style={{width: 52, height: 52}}
              source={isIncludedInLike ? icons.likeActivated_48 : icons.like_48}
            />
          </LikeBtn>
          <BtnCTA
            btnStyle={'activated'}
            style={{flex: 1}}
            onPress={handlePressAddCartBtn}>
            {productData.productChoiceYn === 'Y' ? (
              <BtnText>현재끼니에서 제거</BtnText>
            ) : (
              <BtnText>현재끼니에 추가</BtnText>
            )}
          </BtnCTA>
        </BtnBox>
      </View>
    </SafeAreaView>
  );
};

export default FoodDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const InnerContainer = styled.View`
  padding: 0px 16px 0px 16px;
`;

const FoodImageContainer = styled.Image`
  width: ${SCREENWIDTH}px;
  height: ${SCREENWIDTH}px;
  background-color: ${colors.inactivated};
`;
const SellerText = styled(TextSub)`
  margin-top: 10px;
  font-size: 14px;
`;
const ProductName = styled(TextMain)`
  margin-top: 4px;
  font-size: 20px;
  font-weight: bold;
`;
const ShippingText = styled(TextSub)`
  font-size: 14px;
`;
const Price = styled(TextMain)`
  font-size: 28px;
  font-weight: bold;
  margin-top: 16px;
`;
interface DetailMenuProps {
  onPress: () => void;
  selected?: boolean;
}

const DetailMenu = styled.TouchableOpacity<DetailMenuProps>`
  width: 74px;
  height: 32px;
  margin-top: 20px;
  margin-right: 4px;
  margin-bottom: 24px;
  border: 1px;
  border-radius: 5px;
  border-color: ${colors.inactivated};
  background-color: ${({selected}) =>
    selected ? colors.inactivated : 'white'};
  align-items: center;
  justify-content: center;
`;

const DetailMenuText = styled(TextMain)`
  font-size: 14px;
`;

const PartContainer = styled.View``;

const NutritionInImage = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 24px;
  background-color: ${colors.blackOpacity50};
`;

const BtnBox = styled(StickyFooter)`
  flex-direction: row;
  column-gap: 6px;
`;

const LikeBtn = styled.Pressable`
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
`;
