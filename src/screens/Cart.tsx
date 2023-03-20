import React, {useEffect, useMemo, useState} from 'react';
import {TouchableWithoutFeedback, ScrollView, View} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../stores/store';
import colors from '../styles/colors';
import {
  BtnSmall,
  BtnSmallText,
  TextMain,
  Row,
  HorizontalSpace,
  TextSub,
  BtnBottomCTA,
  BtnText,
} from '../styles/styledConsts';

import NutrientsProgress from '../components/common/NutrientsProgress';
import MenuHeader from '../components/common/MenuHeader';
import MenuSelect from '../components/common/MenuSelect';
import {
  useDeleteDietDetail,
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
} from '../query/queries/diet';
import AutoMenuBtn from '../components/cart/AutoMenuBtn';
import BottomMenuSelect from '../components/cart/BottomMenuSelect';
import AutoDietModal from '../components/cart/AutoDietModal';
import CartFoodList from '../components/cart/CartFoodList';
import {
  commaToNum,
  compareNutrToTarget,
  reGroupBySeller,
  sumUpNutrients,
  sumUpPrice,
} from '../util/sumUp';
import {useGetBaseLine} from '../query/queries/baseLine';
import CartSummary from '../components/cart/CartSummary';
import {useNavigation, useRoute} from '@react-navigation/native';
import DAlert from '../components/common/alert/DAlert';
import DeleteAlertContent from '../components/common/alert/DeleteAlertContent';
import {icons} from '../assets/icons/iconSource';

const Cart = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo);
  const {data: dietDetailAllData} = useListDietDetailAll();
  const deleteDietDetailMutation = useDeleteDietDetail();

  // useState
  const [menuSelectOpen, setMenuSelectOpen] = useState(false);
  const [autoDietModalShow, setAutoDietModalShow] = useState(false);
  const [checkAllClicked, setCheckAllClicked] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<{[key: string]: string[]}>(
    {},
  );
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  // etc
  // navigation
  const navigation = useNavigation();

  useEffect(() => {
    selectedFoods[currentDietNo]?.length !== dietDetailData?.length &&
      setCheckAllClicked(false);
  }, [selectedFoods]);

  // 현재 끼니의 식품들이 목표섭취량에 부합하는지 확인
  // empty/notEnough/exceed 에 따라 autoMenuBtn 디자인이 다름
  const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);
  const menuStatus = baseLineData
    ? compareNutrToTarget(
        {cal, carb, protein, fat},
        {
          cal: parseInt(baseLineData.calorie),
          carb: parseInt(baseLineData.carb),
          protein: parseInt(baseLineData.protein),
          fat: parseInt(baseLineData.fat),
        },
      )
    : 'empty';

  // 추가된 식품 하나도 없으면 주문버튼 비활성
  const isEmpty = dietDetailAllData ? dietDetailAllData.length === 0 : false;
  const totalPrice = useMemo(() => {
    const reGroupedProducts =
      dietDetailAllData && reGroupBySeller(dietDetailAllData);
    if (!reGroupBySeller) return undefined;

    let totalProductPrice = 0;
    let totalShippingPrice = 0;

    reGroupedProducts?.forEach(seller => {
      const sellerProductPrice = sumUpPrice(seller);
      const sellershippingPrice =
        sellerProductPrice < parseInt(seller[0].freeShippingPrice)
          ? parseInt(seller[0].shippingPrice)
          : 0;
      totalProductPrice += sellerProductPrice;
      totalShippingPrice += sellershippingPrice;
    });

    const totalPrice = totalProductPrice + totalShippingPrice;
    return totalPrice;
  }, [dietDetailAllData]);

  const checkAll = () => {
    const allArr = dietDetailData ? dietDetailData.map(v => v.productNo) : [];
    dietDetailData && setSelectedFoods({[currentDietNo]: allArr});
  };
  const unCheckAll = () => {
    setSelectedFoods({[currentDietNo]: []});
  };

  const deleteSelected = () => {
    setCheckAllClicked(false);
    setDeleteModalShow(false);
    Promise.all(
      selectedFoods[currentDietNo]?.map(productNo =>
        deleteDietDetailMutation.mutateAsync({
          dietNo: currentDietNo,
          productNo,
        }),
      ),
    )
      .then(() => console.log('삭제 완료'))
      .catch(e => console.log('삭제 실패', e));
  };

  return (
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     setMenuSelectOpen(false);
    //   }}>
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        <SelectedDeleteRow>
          <SelectAllBox>
            <SelectAllCheckbox
              onPress={() => {
                checkAllClicked ? unCheckAll() : checkAll();
                setCheckAllClicked(clicked => !clicked);
              }}>
              {checkAllClicked ? (
                <CheckboxImage source={icons.checkboxCheckedGreen_24} />
              ) : (
                <CheckboxImage source={icons.checkbox_24} />
              )}
            </SelectAllCheckbox>

            <SelectAllText>전체 선택</SelectAllText>
          </SelectAllBox>
          <BtnSmall
            onPress={() =>
              selectedFoods[currentDietNo]?.length >= 1
                ? setDeleteModalShow(true)
                : {}
            }>
            <BtnSmallText isActivated={true}>선택 삭제</BtnSmallText>
          </BtnSmall>
        </SelectedDeleteRow>
        <DAlert
          alertShow={deleteModalShow}
          confirmLabel="삭제"
          onConfirm={deleteSelected}
          onCancel={() => setDeleteModalShow(false)}
          renderContent={() => (
            <DeleteAlertContent deleteText="선택된 식품을" />
          )}
        />

        {/* 끼니 카드 */}
        <Card>
          <CardMenuHeader>
            <MenuHeader
              menuSelectOpen={menuSelectOpen}
              setMenuSelectOpen={setMenuSelectOpen}></MenuHeader>
          </CardMenuHeader>
          <HorizontalSpace height={24} />
          <NutrientsProgress currentDietNo={currentDietNo} />

          {/* 현재 끼니 식품들 */}
          <CartFoodList
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
          />

          {/* 자동구성 버튼 */}
          <AutoMenuBtn
            status={menuStatus}
            onPress={() => setAutoDietModalShow(true)}
          />
          <AutoDietModal
            modalVisible={autoDietModalShow}
            setModalVisible={setAutoDietModalShow}
          />
          <MenuTotalPrice>
            합계 {dietDetailData && commaToNum(sumUpPrice(dietDetailData))}원
          </MenuTotalPrice>
          {menuSelectOpen && (
            <MenuSelect setOpen={setMenuSelectOpen} center={true} />
          )}
        </Card>

        {/* 카드 하단 끼니 선택 및 추가 */}
        <BottomMenuSelect />

        {/* 끼니 정보 요약 */}
        <CartSummary />
      </ScrollView>
      <BtnBottomCTA
        btnStyle={isEmpty ? 'inactivated' : 'activated'}
        onPress={() => {
          navigation.navigate('OrderNav', {screen: 'Order'});
        }}>
        <BtnText>총 {totalPrice && commaToNum(totalPrice)}원 주문하기</BtnText>
      </BtnBottomCTA>
    </Container>
    // </TouchableWithoutFeedback>
  );
};

export default Cart;

// style //
const Container = styled.SafeAreaView`
  flex: 1;
  padding: 0px 8px 0px 8px;
  background-color: ${colors.backgroundLight};
`;

const SelectedDeleteRow = styled(Row)`
  padding: 0px 8px 0px 8px;
  height: 52px;
  justify-content: space-between;
`;

const SelectAllBox = styled(Row)``;

const SelectAllCheckbox = styled.TouchableOpacity``;

const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
  background-color: ${colors.highlight};
`;

const SelectAllText = styled(TextMain)`
  margin-left: 10px;
  font-size: 14px;
`;

const Card = styled.View`
  background-color: ${colors.white};
  width: 100%;
  padding: 0px 8px 16px 8px;
`;

const CardMenuHeader = styled.View`
  margin-top: 16px;
  align-self: center;
`;

const MenuTotalPrice = styled(TextMain)`
  margin-top: 24px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
`;
