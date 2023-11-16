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

import {RootState} from '../stores/store';
import {icons} from '../assets/icons/iconSource';
import {
  BtnCTA,
  BtnText,
  Col,
  Row,
  TextMain,
  TextSub,
  StickyFooter,
  Dot,
} from '../styles/styledConsts';
import colors from '../styles/colors';
import {IProductData} from '../query/types/product';

import NutrientsProgress from '../components/common/nutrient/NutrientsProgress';
import NutrientPart from '../components/foodDetail/NutrientPart';
import ShippingPart from '../components/foodDetail/ShippingPart';
import FoodPart from '../components/foodDetail/FoodPart';
import ReviewPart from '../components/foodDetail/ReviewPart';

import {BASE_URL} from '../query/queries/urls';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../query/queries/diet';
import {SCREENWIDTH} from '../constants/constants';
import {useGetBaseLine} from '../query/queries/baseLine';
import {commaToNum} from '../util/sumUp';
import {
  useCreateProductMark,
  useDeleteProductMark,
  useGetProduct,
  useListProductMark,
} from '../query/queries/product';
import {makeTableData} from '../util/foodDetail/makeNutrTable';
import {ActivityIndicator} from 'react-native';

export interface TableItem {
  name: string;
  column1: string;
  column2: string;
  rate?: string;
  color?: string;
}

interface IShowPart {
  clicked: string;
  table: TableItem[];
  data: IProductData;
}
const ShowPart = ({clicked, table, data}: IShowPart) => {
  if (clicked === '영양성분') return <NutrientPart table={table} />;
  if (clicked === '식품상세') return <FoodPart productData={data} />;
  if (clicked === '배송정책') return <ShippingPart />;
  return <NutrientPart table={table} />;
};

const FoodDetail = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

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
  const createProductMarkMutation = useCreateProductMark();
  const deleteProductMarkMutation = useDeleteProductMark();
  const createDietDetailMutation = useCreateDietDetail();
  const deleteDietDetailMutation = useDeleteDietDetail();

  //state
  const [clicked, setClicked] = useState('식품상세');
  const detailMenu = ['영양성분', '식품상세', '배송정책'];

  // etc
  const isIncludedInLike =
    productData &&
    likeData?.map(food => food.productNo).includes(productData?.productNo);
  // 식품마다 headerTitle바꾸기
  // TBD : route.params.item 타입 관련 해결 및 만약 null값일 시 에러처리
  useEffect(() => {
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

  return !productData || !baseLineData ? (
    <ActivityIndicator />
  ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <InnerContainer>
          {!!dietDetailData && (
            <NutrientsProgress dietDetailData={dietDetailData} />
          )}
        </InnerContainer>
        <ScrollView
          style={{flex: 1, zIndex: -1}}
          contentContainerStyle={{paddingBottom: 80}}
          showsVerticalScrollIndicator={false}>
          <View>
            <FoodImageContainer
              source={{
                uri: `${BASE_URL}${productData.mainAttUrl}`,
              }}
              style={{resizeMode: 'contain'}}
            />
            <NutritionInImage>
              {table.slice(0, 4).map(el => {
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
          <InnerContainer>
            <SellerText style={{marginTop: 20}}>
              [{productData.platformNm}]
            </SellerText>
            <ProductName>{productData.productNm}</ProductName>
            <Row style={{marginTop: 16, justifyContent: 'flex-start'}}>
              <Price>{commaToNum(productData.price)}원</Price>
            </Row>
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
            <PartContainer>
              <ShowPart clicked={clicked} table={table} data={productData} />
            </PartContainer>
          </InnerContainer>
        </ScrollView>
      </Container>
      <View>
        <StickyFooter>
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
        </StickyFooter>
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
  width: 100%;
  height: 240px;
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
const ShippingText = styled(TextMain)`
  margin-top: 4px;
  font-size: 14px;
`;
const Price = styled(TextMain)`
  font-size: 28px;
  font-weight: bold;
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

const LikeBtn = styled.Pressable`
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;
