import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {
  BtnBottomCTA,
  BtnText,
  TextMain,
  Col,
  Row,
  HorizontalLine,
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import IProductData from '../../query/types/product';
import {commaToNum} from '../../util/sumUp';
import {icons} from '../../assets/icons/iconSource';
import {SCREENWIDTH} from '../../constants/constants';

import {BASE_URL} from '../../query/queries/urls';
import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';
import {ScrollView} from 'react-native-gesture-handler';

interface FoodInOneDietProps {
  dietNo: string;
}

type ISellerList = Array<IProductData>;
const SelfOrder = () => {
  const {data: listDiet} = useListDiet();
  const {data: listDietDetailAll, isLoading: isListDietDetailLoading} =
    useListDietDetailAll();
  if (isListDietDetailLoading) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <ScrollView>
        <SelfOrderContainer>
          {listDiet?.map((diet, index) => {
            return (
              <Col key={`${diet.dietNo}-${index}`}>
                <FoodsInOneDiet dietNo={diet.dietNo} />
              </Col>
            );
          })}
        </SelfOrderContainer>
      </ScrollView>
      <BtnBottomCTA
        style={{width: SCREENWIDTH - 32, marginTop: -20}}
        btnStyle={'activated'}
        onPress={() => console.log('주문내역에 저장')}>
        <BtnText>주문내역에 저장하기</BtnText>
      </BtnBottomCTA>
    </>
  );
};
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
  const groupBySeller = (arg: any) => {
    const group = arg.reduce((r, a) => {
      r[a.platformNm] = [...(r[a.platformNm] || []), a];
      return r;
    }, {});
    return group;
  };
  const groupedDietDetail = groupBySeller(listDietDetail);
  const sellerList: ISellerList = Object.values(groupedDietDetail);
  return (
    <CardSection>
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
          <Col key={i}>
            <HomeLinkButton>
              <SellerText>{e[0]?.platformNm}</SellerText>
              <LinkImage source={icons.mainPurpleLine_20} />
            </HomeLinkButton>

            {e.map((el: IProductData, index: number) => {
              return (
                <View key={el.mainAttUrl}>
                  <Row>
                    <FoodThumbnail
                      source={{
                        uri: `${BASE_URL}${el.mainAttUrl}`,
                      }}
                      resizeMode="center"
                    />
                    <Col>
                      <ProductName>{el.productNm}</ProductName>
                      <PriceAndQuantity>
                        {commaToNum(el.price)}원
                      </PriceAndQuantity>
                      <LinkButton>
                        <LinkText>구매링크</LinkText>
                      </LinkButton>
                    </Col>
                  </Row>
                </View>
              );
            })}
          </Col>
        );
      })}
    </CardSection>
  );
};

export default SelfOrder;

const MenuTitle = styled(TextMain)`
  margin-top: 24px;
  font-size: 16px;
  font-weight: bold;
`;

const FoodThumbnail = styled.Image`
  margin-top: 16px;
  margin-right: 8px;
  width: 64px;
  height: 64px;
  border-radius: 5px;
`;

const LinkImage = styled.Image`
  width: 20px;
  height: 20px;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
`;

const ProductName = styled(TextMain)`
  font-size: 12px;
`;

const PriceAndQuantity = styled(TextMain)`
  margin-top: 4px;
  font-size: 16px;
  font-weight: bold;
`;
const LinkText = styled(TextMain)`
  font-size: 12px;
  color: ${colors.main};
`;

const LinkButton = styled.TouchableOpacity`
  align-items: flex-end;
`;

const HomeLinkButton = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: 24px;
  background-color: red;
`;

const CardSection = styled.View`
  margin-top: 24px;
  padding: 0px 8px 16px 8px;
  border-radius: 5px;
  background-color: ${colors.white};
`;

const SelfOrderContainer = styled.View`
  padding: 0px 16px 32px 16px;
`;
