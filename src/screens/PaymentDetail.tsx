import React, {useEffect} from 'react';
import {FlatList, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../stores/store';
import colors from '../styles/colors';
import {commaToNum} from '../util/sumUp';

import {NavigationProps} from '../constants/constants';
import {
  TextMain,
  VerticalLine,
  Col,
  HorizontalLine,
  Row,
  TextSub,
} from '../styles/StyledConsts';
import {BASE_URL} from '../query/queries/urls';
import MenuSection from '../components/common/menuSection/MenuSection';

const PaymentDetail = props => {
  const {productData, totalPrice} = props?.route?.params;
  // console.log(productData[0].length);
  const nutrientType = ['칼로리', '탄수화물', '단백질', '지방'];

  // productData[0], productData[1] => 끼니 1, 끼니 2
  // productData[0][0], productData[0][1] => 끼니 1의 첫번째, 두번째 메뉴
  // productData[0][0].calorie => 끼니 1의 첫번째 메뉴의 칼로리
  // calorie, carb, protein, fat 각각 끼니1, 끼니2 따로 구해야함
  const renderThumbnail = i => {
    for (let j = 0; j < productData[i].length; j++) {
      return (
        <ThumbnailImage
          source={{uri: `${BASE_URL}${productData[i][j]?.mainAttUrl}`}}
        />
      );
    }
  };

  return (
    <Container>
      <MenuSection />
      <ScrollView>
        <ContentContainer>
          {productData.map((product, productIndex) => (
            <Card key={productIndex}>
              <CardTitle>끼니 {productIndex + 1}</CardTitle>
              <MenuNutrContainer>
                {nutrientType.map((nutrient, index) => (
                  <Col key={index}>
                    <Row>
                      <MakeVertical>
                        <MenuNutr>{nutrient}</MenuNutr>
                        <MenuNutrValue>
                          ㅇㅇㅇ
                          {nutrient === '칼로리' ? 'kcal' : 'g'}
                        </MenuNutrValue>
                      </MakeVertical>
                      <VerticalLine style={{margin: 20}} />
                    </Row>
                  </Col>
                ))}
              </MenuNutrContainer>
              {product.map((item, thumbnailIndex) => (
                <Col key={thumbnailIndex}>
                  <Row>
                    <ThumbnailImage
                      source={{uri: `${BASE_URL}${item?.mainAttUrl}`}}
                    />
                    <Col style={{marginLeft: 8, flex: 1}}>
                      <MakeVertical>
                        <SellerText>{item.platformNm}</SellerText>
                        <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                          {item.productNm}
                        </ProductNmText>
                        <NutrientText>
                          칼로리{' '}
                          <NutrientValue>
                            {parseInt(item.calorie)}kcal{' '}
                          </NutrientValue>
                          탄수화물{' '}
                          <NutrientValue>{parseInt(item.carb)}g </NutrientValue>
                          단백질{' '}
                          <NutrientValue>
                            {parseInt(item.protein)}g{' '}
                          </NutrientValue>
                          지방{' '}
                          <NutrientValue>{parseInt(item.fat)}g </NutrientValue>
                        </NutrientText>
                      </MakeVertical>
                    </Col>
                  </Row>
                  <ProductPrice>{commaToNum(item.price)}원</ProductPrice>
                </Col>
              ))}
            </Card>
          ))}
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default PaymentDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;

const ProgressBox = styled.View`
  background-color: ${colors.white};
  padding: 0px 16px 0px 16px;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 0px 8px 24px 8px;
`;

const Card = styled.View`
  width: 100%;
  padding: 0px 8px 16px 8px;
  margin-top: 16px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const CardTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
  align-self: center;
`;

const MenuNutrContainer = styled(Row)`
  margin: 30px
  width: 100%;
  align-items: center;
`;

const MenuNutr = styled(TextMain)`
  font-size: 12px;
  margin-right: 8px;
  align-self: center;
`;

const MenuNutrValue = styled(TextMain)`
  font-size: 14px;
  align-self: center;
`;

const MakeVertical = styled.View`
  flex-direction: column;
`;
const SelectedBtn = styled.TouchableOpacity`
  position: absolute;
  width: 24px;
  height: 24px;
`;

const SelectedCheckImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ThumbnailImage = styled.Image`
  width: 72px;
  height: 72px;
  background-color: ${colors.highlight};
  border-radius: 3px;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  align-items: flex-end;
  width: 36px;
  height: 36px;
  /* background-color: ${colors.highlight}; */
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ProductNmText = styled(TextMain)`
  font-size: 14px;
`;

const NutrientText = styled(TextSub)`
  margin-top: 4px;
  font-size: 12px;
`;
const NutrientValue = styled(TextMain)`
  font-size: 12px;
  font-weight: bold;
`;

const TotalPrice = styled(TextMain)`
  font-size: 16px;
`;
const ProductPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 80px;
`;
