import React, {useState, useEffect} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {
  BtnCTA,
  BtnText,
  Col,
  Container,
  Row,
  TextMain,
  TextSub,
  StickyFooter,
  Dot,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {IProductData} from '../../query/types/product';

import NutrientsProgress from '../../components/common/NutrientsProgress';
import NutrientPart from './foodDetailSubScreen/NutrientPart';
import ShippingPart from './foodDetailSubScreen/ShippingPart';
import FoodPart from './foodDetailSubScreen/FoodPart';
import ReviewPart from './foodDetailSubScreen/ReviewPart';

import {BASE_URL} from '../../query/queries/urls';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../query/queries/diet';
import {SCREENWIDTH} from '../../constants/constants';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {commaToNum} from '../../util/sumUp';
import {
  useCreateProductMark,
  useDeleteProductMark,
} from '../../query/queries/product';

export interface TableItem {
  name: string;
  column1: string;
  column2: string;
  rate?: string;
  color?: string;
}

const FoodDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item: IProductData = route.params.item;
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const detailMenu = ['영양성분', '식품상세', '후기', '배송정책'];
  const [clicked, setClicked] = useState(0);
  const createProductMarkMutation = useCreateProductMark();
  const deleteProductMarkMutation = useDeleteProductMark();
  const createDietDetailMutation = useCreateDietDetail();
  const deleteDietDetailMutation = useDeleteDietDetail();
  const {data: userData} = useGetBaseLine();
  const {data: dietDetailData, isFetching: dietDetailIsFetching} =
    useListDietDetail(currentDietNo, {enabled: currentDietNo ? true : false});

  const checkProductIncluded = (productNo: string, menu: IProductData[]) => {
    let isIncluded = false;
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].productNo === productNo) {
        isIncluded = true;
        break;
      }
    }
    return isIncluded;
  };

  //TODO : route.params.item 타입 관련 해결 및 만약 null값일 시 에러처리
  useEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        headerBackVisible: false,
      },
      headerTitle: () => {
        return (
          <>
            <View style={{marginRight: 8}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  color: colors.textMain,
                  fontWeight: 'bold',
                  width: 0.7 * SCREENWIDTH,
                  textAlign: 'center',
                }}>
                {item.productNm}
              </Text>
            </View>
          </>
        );
      },
    });
  }, [navigation, item.productNm]);

  const handlePressLikeBtn = () => {
    //TODO : 찜된 목록인지 알 수 있는 API나오면 좋아요기능 완성하기
    // createProductMarkMutation.mutate(item.productNo);
    // deleteProductMarkMutation.mutate(item.productNo);
  };
  if (createProductMarkMutation.isLoading) {
    return <Text>Loading</Text>;
  }

  const isIncluded =
    dietDetailData && checkProductIncluded(item.productNo, dietDetailData);

  const handlePressAddCartBtn = () => {
    if (isIncluded) {
      deleteDietDetailMutation.mutate({
        dietNo: currentDietNo,
        productNo: item.productNo,
      });
    } else {
      createDietDetailMutation.mutate({
        dietNo: currentDietNo,
        productNo: item.productNo,
        item,
      });
    }
  };
  const table: TableItem[] = [
    {
      name: 'calorie',
      column1: '칼로리',
      column2: `${Math.ceil(Number(item.calorie))} g`,
      rate: `${Math.ceil(
        (Number(item.calorie) / Number(userData.calorie)) * 100,
      )}%`,
      color: colors.main,
    },
    {
      name: 'carb',
      column1: '탄수화물',
      column2: `${Math.ceil(Number(item.carb))} g`,
      rate: `${Math.ceil((Number(item.carb) / Number(userData.carb)) * 100)}%`,
      color: colors.blue,
    },
    {
      name: 'protein',
      column1: '단백질',
      column2: `${Math.ceil(Number(item.protein))} g`,
      rate: `${Math.ceil(
        (Number(item.protein) / Number(userData.protein)) * 100,
      )}%`,
      color: colors.green,
    },
    {
      name: 'fat',
      column1: '지방',
      column2: `${Math.ceil(Number(item.fat))} g`,
      rate: `${Math.ceil((Number(item.fat) / Number(userData.fat)) * 100)}%`,
      color: colors.orange,
    },
    {
      name: 'sodium',
      column1: '나트륨',
      column2: `${Math.ceil(Number(item.sodium))} mg`,
      rate: `${Math.ceil((Number(item.sodium) / 2300) * 100)}%`,
    },
    {
      name: 'sugar',
      column1: '당류',
      column2: `${Math.ceil(Number(item.sugar))} g`,
      rate: `${Math.ceil(
        (Number(item.sugar) / 0.2 / Number(userData.calorie)) * 100,
      )}%`,
    },

    {
      name: 'transFat',
      column1: '트랜스지방',
      column2: `${Math.ceil(Number(item.transFat))} g`,
      rate: `${Math.ceil(
        (Number(item.transFat) / 0.1 / Number(userData.calorie)) * 100,
      )}%`,
    },
    {
      name: 'saturatedFat',
      column1: '포화지방',
      column2: `${Math.ceil(Number(item.saturatedFat))} g`,
      rate: `${Math.ceil(
        (Number(item.saturatedFat) / 0.7 / Number(userData.calorie)) * 100,
      )}%`,
    },
    {
      name: 'cholesterol',
      column1: '콜레스테롤',
      column2: `${Math.ceil(Number(item.cholesterol))} mg`,
      rate: `${Math.ceil((Number(item.cholesterol) / 300) * 100)}%`,
    },

    {
      name: 'manufacturerBizNo',
      column1: '품목보고번호',
      column2: `${item.manufacturerBizNo}`,
    },
    {
      name: 'manufacturerNm',
      column1: '제조사',
      column2: `${item.manufacturerNm}`,
    },
  ];

  const ShowPart = i => {
    return i.index === 0 ? (
      <NutrientPart table={table} />
    ) : i.index === 1 ? (
      <FoodPart />
    ) : i.index === 2 ? (
      <ReviewPart />
    ) : i.index === 3 ? (
      <ShippingPart />
    ) : (
      <NutrientPart table={table} />
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        {currentDietNo && <NutrientsProgress currentDietNo={currentDietNo} />}
        <ScrollView style={{marginBottom: 20, flex: 1}}>
          <View>
            <FoodImageContainer
              source={{
                uri: `${BASE_URL}${item.mainAttUrl}`,
              }}
              // style={{resizeMode: 'stretch'}}
            />
            <FoodImageBottom />
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

          <SellerText style={{marginTop: 20}}>[{item.platformNm}]</SellerText>
          <ProductName>{item.productNm}</ProductName>
          <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
            <Col>
              <ShippingText>20000원 이상 무료배송 </ShippingText>
              <Row>
                <ShippingText>최소주문수량: </ShippingText>
                <ShippingText style={{color: '#ff6060'}}>2개</ShippingText>
              </Row>
            </Col>
            <Price>{commaToNum(item.price)}원</Price>
          </Row>
          <Row
            style={{
              justifyContent: 'flex-start',
            }}>
            {detailMenu.map((el, index) => {
              return (
                <React.Fragment key={`${el}-${index}`}>
                  <DetailMenu
                    onPress={() => setClicked(index)}
                    selected={index === clicked}>
                    <DetailMenuText>{el}</DetailMenuText>
                  </DetailMenu>
                </React.Fragment>
              );
            })}
          </Row>
          <PartContainer>
            <ShowPart index={clicked} />
          </PartContainer>
        </ScrollView>
      </Container>
      <View>
        <StickyFooter style={{flexDirection: 'row'}}>
          <Pressable
            style={{marginRight: 8, width: 52, height: 52}}
            onPress={handlePressLikeBtn}>
            <Image
              // 조건에 따라서 서로 다른 좋아요 버튼 갖게 할 것
              // source={require('../../assets/icons/36_likePage_selected.png')}
              style={{width: 52, height: 52}}
              source={icons.likeActivated_48}
            />
          </Pressable>
          <BtnCTA
            btnStyle={'activated'}
            style={{flex: 4}}
            onPress={handlePressAddCartBtn}>
            {isIncluded ? (
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

const FoodImageContainer = styled.Image`
  margin-left: 50px;
  width: 240px;
  height: 180px;
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
  margin-left: 90px;
`;
interface DetailMenuProps {
  onPress: () => void;
  selected?: boolean;
}

const DetailMenu = styled.TouchableOpacity<DetailMenuProps>`
  width: 74px;
  height: 32px;
  margin-top: 20px;
  margin-right: 5px;
  margin-bottom: 10px;
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
  opacity: 1;
  width: 360px;
  height: 24px;
`;
const FoodImageBottom = styled.View`
  position: absolute;
  bottom: 0;
  background-color: black;
  opacity: 0.4;
  width: 360px;
  height: 24px;
`;
