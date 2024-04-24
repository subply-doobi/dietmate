// react, RN, 3rd
import styled from 'styled-components/native';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';
import {commaToNum, sumUpNutrients, sumUpPrice} from '../../shared/utils/sumUp';

// doobi Component
import {
  BtnSmall,
  BtnSmallText,
  HorizontalLine,
  Row,
  TextMain,
} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';
import AccordionCtaBtns from './AccordionCtaBtns';
import FoodList from './FoodList';

// react-query
import {IDietDetailData} from '../../shared/api/types/diet';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {useDeleteDietDetail} from '../../shared/api/queries/diet';
import MenuNumSelect from '../cart/MenuNumSelect';

interface IMenu {
  dietNo: string;
  dietDetailData: IDietDetailData;
}

const Menu = ({dietNo, dietDetailData}: IMenu) => {
  // react-query
  const deleteDietDetailMutation = useDeleteDietDetail();

  // useState
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
  // empty/notEnough/exceed 에 따라 AccordionCtaBtns 디자인이 다름
  const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);

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

      {/* 현재 끼니 식품들 */}
      {dietDetailData.length > 0 && (
        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          dietNo={dietNo}
        />
      )}

      {/* 삭제 알럿 */}
      <DAlert
        alertShow={deleteModalShow}
        confirmLabel="삭제"
        onConfirm={deleteSelected}
        onCancel={() => setDeleteModalShow(false)}
        renderContent={() => <DeleteAlertContent deleteText="선택된 식품을" />}
      />
    </Container>
  );
};

export default Menu;

const Container = styled.View`
  z-index: -1;
`;

const SelectedDeleteRow = styled(Row)`
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 24px;
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
