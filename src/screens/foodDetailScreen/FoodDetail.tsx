import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  View,
  Pressable,
} from 'react-native';
import styled from 'styled-components/native';
import {BASE_URL} from '../../query/queries/urls';
import {
  BtnCTA,
  BtnText,
  Col,
  Container,
  Row,
  TextMain,
  TextSub,
  StickyFooter,
  HorizontalSpace,
  Dot,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import NutrientsProgress from '../../components/common/NutrientsProgress';
import {Food} from '../../util/dummyData';
import {
  useCreateProductMark,
  useDeleteProductMark,
} from '../../query/queries/product';
import NutrientPart from './foodDetailSubScreen/NutrientPart';
import ShippingPart from './foodDetailSubScreen/ShippingPart';
import FoodPart from './foodDetailSubScreen/FoodPart';
import ReviewPart from './foodDetailSubScreen/ReviewPart';

const food = Food;

export interface TableItem {
  name: string;
  column1: string;
  column2: string;
  color?: string;
}

const table: TableItem[] = [
  {
    name: 'calorie',
    column1: '칼로리',
    column2: `${Math.ceil(Number(food.calorie))}`,
    color: colors.main,
  },
  {
    name: 'carb',
    column1: '탄수화물',
    column2: `${Math.ceil(Number(food.carb))}`,
    color: colors.blue,
  },
  {
    name: 'protein',
    column1: '단백질',
    column2: `${Math.ceil(Number(food.protein))}`,
    color: colors.green,
  },
  {
    name: 'fat',
    column1: '지방',
    column2: `${Math.ceil(Number(food.fat))}`,
    color: colors.orange,
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

const FoodDetail = () => {
  //TODO : 상위컴포넌트에서 props로 받아서 식품명 header로 띄우기
  const detailMenu = ['영양성분', '식품상세', '후기', '배송정책'];
  const [clicked, setClicked] = useState(0);
  const createProductMarkMutation = useCreateProductMark();
  const deleteProductMarkMutation = useDeleteProductMark();

  const handlePressLikeBtn = () => {
    //TODO : 찜된 목록인지 알 수 있는 API나오면 좋아요기능 완성하기
    // createProductMarkMutation.mutate(food.productNo);
    // deleteProductMarkMutation.mutate(food.productNo);
  };
  if (createProductMarkMutation.isLoading) {
    return <Text>Loading</Text>;
  }

  const handlePressAddCartBtn = () => {
    //dietNo =
    createDietDetailMutation.mutate({
      dietNo: 'DT20230214000000001',
      productNo: food.productNo,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{marginBottom: 20, flex: 1}}>
          <NutrientsProgress menuIndex={0} />
          <View>
            <FoodImageContainer
              source={{
                uri: `${BASE_URL}${food.mainAttUrl}`,
              }}
            />
            <FoodImageBottom />
            <NutritionInImage>
              {table.slice(0, 4).map(el => {
                return (
                  <>
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
                  </>
                );
              })}
            </NutritionInImage>
          </View>

          <SellerText style={{marginTop: 20}}>[{food.platformNm}]</SellerText>
          <ProductName>{food.productNm}</ProductName>
          <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
            <Col>
              <ShippingText>20000원 이상 무료배송 </ShippingText>
              <ShippingText>최소수량: 2개</ShippingText>
            </Col>
            <Price>{food.price}원</Price>
          </Row>
          <Row
            style={{
              justifyContent: 'space-between',
            }}>
            {detailMenu.map((el, index) => {
              return (
                <React.Fragment key={index}>
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
              source={require('../../assets/icons/48_like_activated.png')}
            />
          </Pressable>
          <BtnCTA
            btnStyle={'activated'}
            style={{flex: 4}}
            onPress={handlePressAddCartBtn}>
            <BtnText>장바구니 추가</BtnText>
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
