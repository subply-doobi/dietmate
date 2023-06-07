import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {
  AccordionContentContainer,
  TextMain,
  Col,
  Row,
  HorizontalLine,
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';

import {BASE_URL} from '../../query/queries/urls';
import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';
import {ScrollView} from 'react-native-gesture-handler';

const SelfOrder = () => {
  const {data: listDiet} = useListDiet();
  const {data: listDietDetailAll, isLoading: isListDietDetailLoading} =
    useListDietDetailAll();
  if (isListDietDetailLoading) {
    return <ActivityIndicator />;
  }
  return (
    <ScrollView>
      <AccordionContentContainer>
        {listDiet?.map((diet, index) => {
          return (
            <Col key={`${diet.dietNo}-${index}`}>
              <FoodsInOneDiet dietNo={diet.dietNo} />
            </Col>
          );
        })}
      </AccordionContentContainer>
    </ScrollView>
  );
};
interface FoodInOneDietProps {
  dietNo: string;
}
const FoodsInOneDiet = ({dietNo}: FoodInOneDietProps) => {
  const {data: listDietDetail, isLoading} = useListDietDetail(dietNo);
  const {data: listDiet} = useListDiet();
  const dietSeq = getDietSeq(listDiet, dietNo);
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
  //판매사별로 묶어주기
  const groupBySeller = listDietDetail => {
    const group = listDietDetail.reduce((r, a) => {
      r[a.platformNm] = [...(r[a.platformNm] || []), a];
      return r;
    }, {});
    return group;
  };
  const groupedDietDetail = groupBySeller(listDietDetail);
  const sellerList = Object.values(groupedDietDetail);
  // console.log('sellerList:', sellerList);
  return (
    <>
      <Col>
        {listDietDetail?.length ? (
          <View>
            <MenuTitle>{dietSeq}</MenuTitle>
            <HorizontalLine
              style={{marginTop: 16, backgroundColor: colors.black, height: 2}}
            />
          </View>
        ) : null}
        {sellerList?.map((e, i) => {
          return (
            <View>
              <SellerText>{e[0]?.platformNm}</SellerText>
              {e.map((el, index) => {
                return (
                  <>
                    <Row>
                      <FoodThumbnail
                        source={{
                          uri: `${BASE_URL}${el.mainAttUrl}`,
                        }}
                        resizeMode="center"
                      />
                      <Col>
                        <ProductName>{el.productNm}</ProductName>
                        <PriceAndQuantity>{el.price}원</PriceAndQuantity>
                      </Col>
                    </Row>
                  </>
                );
              })}
            </View>
          );
        })}
      </Col>
    </>
  );
};

export default SelfOrder;

const MenuTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
`;

const FoodThumbnail = styled.Image`
  margin-top: 16px;
  margin-right: 8px;
  width: 72px;
  height: 72px;
`;

const SellerText = styled(TextMain)`
  margin-top: 24px;
  font-size: 14px;
`;

const ProductName = styled(TextMain)`
  font-size: 14px;
`;

const QuantityBox = styled.View`
  width: 80px;
  height: 24px;
`;

const PriceAndQuantity = styled(TextMain)`
  margin-top: 4px;
  font-size: 16px;
  font-weight: bold;
`;
