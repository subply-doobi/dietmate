// react, RN, 3rd
import {SetStateAction, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Progress from 'react-native-progress';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../assets/icons/iconSource';
import {RootState} from '../../stores/store';
import colors from '../../styles/colors';
import {commaToNum, sumUpNutrients, sumUpPrice} from '../../util/sumUp';
import {setMenuActiveSection} from '../../stores/slices/commonSlice';

// doobi Component
import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';
import DTooltip from '../common/tooltip/DTooltip';
import AutoDietModal from './AutoDietModal';
import {
  Col,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
  StyledProps,
} from '../../styles/styledConsts';

// react-query
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useDeleteDiet, useListDiet} from '../../query/queries/diet';
import {IDietDetailData} from '../../query/types/diet';
import {current} from '@reduxjs/toolkit';
import MenuNumSelect from './MenuNumSelect';

interface IAccordionInactiveHeader {
  idx: number;
  dietNo: string;
  dietSeq: string;
  dietDetailData: IDietDetailData;
  setDietNoToNumControl: React.Dispatch<SetStateAction<string>>;
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
}

const AccordionInactiveHeader = ({
  idx,
  dietNo,
  dietSeq,
  dietDetailData,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IAccordionInactiveHeader) => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: dietData} = useListDiet();
  const deleteDietMutation = useDeleteDiet();

  // state
  // TBD | 끼니 수량 api 필요
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [autoDietModalShow, setAutoDietModalShow] = useState(false);

  // etc
  const numOfFoods = dietDetailData ? dietDetailData.length : 0;
  const priceSum = sumUpPrice(dietDetailData);
  const currentQty = dietDetailData[0]?.qty
    ? parseInt(dietDetailData[0].qty, 10)
    : 1;
  const barColor = currentDietNo === dietNo ? colors.dark : colors.inactivated;

  const onDeleteDiet = () => {
    deleteDietMutation.mutate({dietNo});
    setDeleteAlertShow(false);
  };

  const onMenuNoSelectPress = () => {
    setDietNoToNumControl(dietNo);
    setMenuNumSelectShow(true);
  };

  return (
    <Container>
      <LeftBar backgroundColor={barColor} />

      {/* 현재 구성중인 끼니 툴팁 */}
      {/* <DTooltip
        tooltipShow={currentDietNo === dietNo}
        text="현재 구성중인 끼니"
        boxTop={-14}
        boxLeft={22}
        triangleLeft={18}
      /> */}

      {/* accordionInactiveHeader Content */}
      <Col style={{flex: 1, marginLeft: 16}}>
        {/* 끼니, 가격, 식품 수 */}
        <MenuSeq>{dietSeq}</MenuSeq>
        {numOfFoods === 0 ? (
          <FoodNoAndPrice>
            <AutoMenuText>자동구성을 이용해보세요</AutoMenuText>
          </FoodNoAndPrice>
        ) : (
          <FoodNoAndPrice>
            {commaToNum(priceSum)}원 ({numOfFoods}가지 식품)
          </FoodNoAndPrice>
        )}
      </Col>

      {/* 끼니수량 - 수량선택버튼 */}
      <Col style={{position: 'absolute', right: 8, bottom: 8}}>
        <MenuNumSelect
          disabled={dietDetailData.length === 0}
          action="openModal"
          currentQty={currentQty}
          openMenuNumSelect={onMenuNoSelectPress}
        />
      </Col>

      {/* 메뉴삭제 버튼 */}
      <MenuDeleteBtn
        onPress={() => setDeleteAlertShow(true)}
        disabled={dietData && dietData?.length > 1 ? false : true}>
        {dietData && dietData?.length > 1 && (
          <DeleteIcon source={icons.cancelRound_24} />
        )}
      </MenuDeleteBtn>

      {/* 자동구성 모달 */}
      <AutoDietModal
        modalVisible={autoDietModalShow}
        setModalVisible={setAutoDietModalShow}
        dietNo={dietNo}
        dietDetailData={dietDetailData}
        openCurrentSection={() => dispatch(setMenuActiveSection([idx]))}
      />

      {/* 메뉴삭제 알럿 */}
      <DAlert
        alertShow={deleteAlertShow}
        renderContent={() => <DeleteAlertContent deleteText={dietSeq} />}
        onConfirm={() => onDeleteDiet()}
        onCancel={() => setDeleteAlertShow(false)}
      />
    </Container>
  );
};

export default AccordionInactiveHeader;

const Container = styled.View`
  height: 84px;
  width: 100%;
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  background-color: ${colors.white};
`;

const LeftBar = styled.View`
  width: 4px;
  height: 84px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${({backgroundColor}: StyledProps) => backgroundColor};
`;

const MenuSeq = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const FoodNoAndPrice = styled(TextSub)`
  font-size: 14px;
  margin-top: 4px;
`;

const AutoMenuText = styled(TextMain)`
  font-size: 14px;
  color: ${colors.main};
`;

const MenuDeleteBtn = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const DeleteIcon = styled.Image`
  width: 24px;
  height: 24px;
`;
