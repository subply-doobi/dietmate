import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  AccordionContentContainer,
  TextMain,
  Col,
  Row,
  HorizontalLine,
} from '../../styles/styledConsts';
import {BASE_URL} from '../../query/queries/urls';
import {IProductData} from '../../query/types/product';
import colors from '../../styles/colors';
import {IDietDetailData} from '../../query/types/diet';
import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
} from '../../query/queries/diet';
import {ActivityIndicator, Text, View} from 'react-native';

const FoodToOrder = () => {
  const {data: listDietDetailAll, isLoading: isListDietDetailLoading} =
    useListDietDetailAll();
  const {data: listDiet} = useListDiet();

  if (isListDietDetailLoading) {
    return <ActivityIndicator />;
  }
  return (
    <AccordionContentContainer>
      {listDiet?.map((diet, index) => {
        return (
          <Col key={`${diet.dietNo}-${index}`}>
            <FoodsInOneDiet dietNo={diet.dietNo} />
          </Col>
        );
      })}
    </AccordionContentContainer>
  );
};
interface FoodInOneDietProps {
  dietNo: string;
}
const FoodsInOneDiet = ({dietNo}: FoodInOneDietProps) => {
  const {data: listDietDetail, isLoading} = useListDietDetail(dietNo);
  const {data: listDiet} = useListDiet();
  const [menuTitle, setMenuTitle] = useState();

  useEffect(() => {
    const dietSeq = getDietSeq(listDiet, dietNo);
    setMenuTitle(dietSeq);
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  function getDietSeq(dietArr, dietNo) {
    for (let i = 0; i < dietArr.length; i++) {
      if (dietArr[i].dietNo === dietNo) {
        return dietArr[i].dietSeq;
      }
    }
    return null; // 만약 해당하는 dietNo를 찾을 수 없을 경우 null 반환
  }

  return (
    <>
      <Col>
        {listDietDetail?.length ? (
          <View>
            <MenuTitle>{menuTitle}</MenuTitle>
            <HorizontalLine
              style={{marginTop: 8, backgroundColor: colors.line}}
            />
          </View>
        ) : null}

        {listDietDetail?.map((product, index) => {
          return (
            <View key={`${product.productNo}-${index}`}>
              <Row style={{marginTop: 16}}>
                <FoodThumbnail
                  source={{
                    uri: `${BASE_URL}${product.mainAttUrl}`,
                  }}
                />
                <Col style={{flex: 1, marginLeft: 8}}>
                  <SellerText numberOfLines={1} ellipsizeMode="tail">
                    {product.platformNm}
                  </SellerText>
                  <ProductName numberOfLines={1} ellipsizeMode="tail">
                    {product.productNm}
                  </ProductName>
                  <Row
                    style={{
                      marginTop: 8,
                      justifyContent: 'space-between',
                    }}>
                    <PriceAndQuantity>{product.price}</PriceAndQuantity>
                    <QuantityBox>
                      <PriceAndQuantity>{product.qty}개</PriceAndQuantity>
                    </QuantityBox>
                  </Row>
                </Col>
              </Row>
              <HorizontalLine
                lineColor={colors.lineLight}
                style={{marginTop: 16}}
              />
            </View>
          );
        })}
      </Col>
    </>
  );
};

export default FoodToOrder;

const MenuTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  align-self: center;
`;

const FoodThumbnail = styled.Image`
  width: 72px;
  height: 72px;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const ProductName = styled(TextMain)`
  font-size: 14px;
`;

const QuantityBox = styled.View`
  width: 80px;
  height: 24px;
`;

const PriceAndQuantity = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
