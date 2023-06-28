// react, RN, 3rd
import styled from 'styled-components/native';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';

// doobi util, redux, etc
import colors from '../../../styles/colors';
import {icons} from '../../../assets/icons/iconSource';
import {
  commaToNum,
  compareNutrToTarget,
  sumUpNutrients,
  sumUpPrice,
} from '../../../util/sumUp';

// doobi Component
import {
  BtnSmall,
  BtnSmallText,
  Row,
  TextMain,
} from '../../../styles/StyledConsts';
import DAlert from '../alert/DAlert';
import DeleteAlertContent from '../alert/DeleteAlertContent';
import AutoDietModal from '../../cart/AutoDietModal';
import AutoMenuBtn from '../../cart/AutoMenuBtn';
import CartFoodList from '../../cart/CartFoodList';

// react-query
import {IDietDetailData} from '../../../query/types/diet';
import {useGetBaseLine} from '../../../query/queries/baseLine';
import {useDeleteDietDetail} from '../../../query/queries/diet';

interface IMenu {
  dietNo: string;
  dietDetailData: IDietDetailData;
  setDietNoToNumControl: React.Dispatch<SetStateAction<string>>;
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
}

const Menu = ({
  dietNo,
  dietDetailData,
  setDietNoToNumControl,
  setNumberPickerShow,
}: IMenu) => {
  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const deleteDietDetailMutation = useDeleteDietDetail();

  // useState
  const [autoDietModalShow, setAutoDietModalShow] = useState(false);
  const [checkAllClicked, setCheckAllClicked] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<{[key: string]: string[]}>(
    {},
  );

  useEffect(() => {
    selectedFoods[dietNo]?.length !== dietDetailData?.length &&
      setCheckAllClicked(false);
  }, [selectedFoods, dietDetailData, dietNo]);

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

  // 전체선택 - 삭제 start
  const checkAll = () => {
    const allArr = dietDetailData ? dietDetailData.map(v => v.productNo) : [];
    dietDetailData && setSelectedFoods({[dietNo]: allArr});
  };
  const unCheckAll = () => {
    setSelectedFoods({[dietNo]: []});
  };

  const deleteSelected = async () => {
    setCheckAllClicked(false);
    setDeleteModalShow(false);
    const deleteMutations = selectedFoods[dietNo]?.map(productNo =>
      deleteDietDetailMutation.mutateAsync({
        dietNo,
        productNo,
      }),
    );

    await Promise.all(deleteMutations)
      .then(() => {
        unCheckAll();
      })
      .catch(e => console.log('삭제 실패', e));
  };

  // 끼니수량에 따른 가격
  const priceSum = sumUpPrice(dietDetailData);
  const currentQty = dietDetailData[0]?.qty
    ? parseInt(dietDetailData[0].qty, 10)
    : 1;
  const totalPrice = priceSum * currentQty;

  return (
    <Container>
      {/* 전체선택 - 삭제 */}
      {dietDetailData && dietDetailData.length > 0 && (
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
              selectedFoods[dietNo]?.length >= 1 ? setDeleteModalShow(true) : {}
            }>
            <BtnSmallText isActivated={true}>선택 삭제</BtnSmallText>
          </BtnSmall>
        </SelectedDeleteRow>
      )}
      <DAlert
        alertShow={deleteModalShow}
        confirmLabel="삭제"
        onConfirm={deleteSelected}
        onCancel={() => setDeleteModalShow(false)}
        renderContent={() => <DeleteAlertContent deleteText="선택된 식품을" />}
      />

      {/* 현재 끼니 식품들 */}
      <CartFoodList
        selectedFoods={selectedFoods}
        setSelectedFoods={setSelectedFoods}
        dietNo={dietNo}
      />

      {/* 자동구성 버튼 */}
      <AutoMenuBtn
        status={menuStatus}
        onPress={() => setAutoDietModalShow(true)}
      />
      <Row style={{marginTop: 24, justifyContent: 'flex-end'}}>
        <MenuNoText>끼니 수량</MenuNoText>
        <MenuNoSelect
          onPress={() => {
            setDietNoToNumControl(dietNo);
            setNumberPickerShow(true);
          }}>
          <MenuNo>{currentQty}개</MenuNo>
          <UpDownImage source={icons.upDown_24} />
        </MenuNoSelect>
        <MenuTotalPrice>합계 {commaToNum(totalPrice)}원</MenuTotalPrice>
      </Row>
      <AutoDietModal
        modalVisible={autoDietModalShow}
        setModalVisible={setAutoDietModalShow}
        dietNo={dietNo}
        dietDetailData={dietDetailData}
      />
    </Container>
  );
};

export default Menu;

const Container = styled.View``;

const SelectedDeleteRow = styled(Row)`
  height: 52px;
  justify-content: space-between;
  z-index: -1;
`;

const SelectAllBox = styled(Row)``;

const SelectAllCheckbox = styled.TouchableOpacity``;

const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const SelectAllText = styled(TextMain)`
  margin-left: 10px;
  font-size: 14px;
`;

const MenuNoText = styled(TextMain)`
  font-size: 14px;
`;

const MenuNoSelect = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 64px;
  height: 32px;
  margin-left: 8px;
  background-color: ${colors.backgroundLight};
  justify-content: space-between;
`;

const MenuNo = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const UpDownImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const MenuTotalPrice = styled(TextMain)`
  margin-left: 16px;
  font-size: 16px;
  font-weight: bold;
`;