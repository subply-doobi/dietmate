// react, RN, 3rd
import {SetStateAction, useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
import {icons} from '../../assets/icons/iconSource';
import {RootState} from '../../stores/store';
import colors from '../../styles/colors';
import {commaToNum, sumUpNutrients, sumUpPrice} from '../../util/sumUp';

// doobi Component
import {StyledProps} from '../../styles/styledConsts';
import {
  Col,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
} from '../../styles/styledConsts';
import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';

// react-query
import {useGetBaseLine} from '../../query/queries/baseLine';
import {
  useCreateDiet,
  useDeleteDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
} from '../../query/queries/diet';
import {IDietDetailData} from '../../query/types/diet';
import DTooltip from '../common/DTooltip';
import AutoDietModal from './AutoDietModal';

interface IAccordionInactiveHeader {
  idx: number;
  dietNo: string;
  dietSeq: string;
  dietDetailData: IDietDetailData;
  setActiveSections: React.Dispatch<SetStateAction<number[]>>;
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
}

const AccordionInactiveHeader = ({
  idx,
  dietNo,
  dietSeq,
  dietDetailData,
  setActiveSections,
  setNumberPickerShow,
}: IAccordionInactiveHeader) => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const createDietMutation = useCreateDiet();
  const deleteDietMutation = useDeleteDiet();

  // state
  // TBD | 끼니 수량 api 필요
  const [menuNoTemp, setMenuNoTemp] = useState(1);
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [autoDietModalShow, setAutoDietModalShow] = useState(false);

  // etc
  const {cal} = sumUpNutrients(dietDetailData);
  const calTarget = baseLineData?.calorie;
  const numOfFoods = dietDetailData ? dietDetailData.length : 0;
  const priceSum = sumUpPrice(dietDetailData);
  const totalPrice = priceSum * menuNoTemp;

  const barColor = !dietDetailData
    ? colors.dark
    : dietDetailData.length === 0
    ? colors.dark
    : idx % 5 === 0
    ? colors.main
    : idx % 5 === 1
    ? colors.blue
    : idx % 5 === 2
    ? colors.green
    : idx % 5 === 3
    ? colors.orange
    : colors.warning;

  const onDeleteDiet = () => {
    deleteDietMutation.mutate({dietNo});
    setDeleteAlertShow(false);
  };
  useEffect(() => {}, []);
  return (
    <Container>
      <LeftBar backgroundColor={barColor} />
      <DTooltip
        tooltipShow={currentDietNo === dietNo}
        text="현재 구성중인 끼니"
        boxTop={-14}
        boxLeft={22}
        triangleLeft={18}
      />
      <Col style={{width: 80, alignItems: 'center'}}>
        <MenuSeq>{dietSeq}</MenuSeq>
        {calTarget && (
          <Progress.Bar
            style={{marginTop: 6}}
            progress={cal / parseInt(calTarget)}
            width={56}
            height={4}
            color={colors.dark}
            unfilledColor={colors.bgBox}
            borderWidth={0}
            borderRadius={5}
          />
        )}
      </Col>
      <VerticalLine height={48} width={2} />
      <MenuDeleteBtn
        onPress={() => setDeleteAlertShow(true)}
        disabled={dietData && dietData?.length > 1 ? false : true}>
        {dietData && dietData?.length > 1 && (
          <DeleteIcon source={icons.cancelRound_24} />
        )}
      </MenuDeleteBtn>
      {numOfFoods !== 0 ? (
        <Col
          style={{
            flex: 1,
            height: '100%',
          }}>
          <FoodNoAndPrice>
            {numOfFoods}가지 식품: {commaToNum(priceSum)}원
          </FoodNoAndPrice>
          <Row3>
            <Row>
              <MenuNoBox>
                <MenuNoText>끼니 수량</MenuNoText>
              </MenuNoBox>
              <MenuNoSelect onPress={() => setNumberPickerShow(true)}>
                <MenuNo>{menuNoTemp}개</MenuNo>
                <UpDownImage source={icons.upDown_24} />
              </MenuNoSelect>
            </Row>
            <PriceSum>{commaToNum(totalPrice)}원</PriceSum>
          </Row3>
        </Col>
      ) : (
        // 끼니 자동구성 btn - modal
        <Col style={{flex: 1, paddingRight: 16, paddingLeft: 16}}>
          <AutoMenuBtn onPress={() => setAutoDietModalShow(true)}>
            <Row>
              <PlusBtnImage source={icons.plusSquareActivated_24} />
              <AutoMenuText>귀찮을 땐 자동구성</AutoMenuText>
            </Row>
          </AutoMenuBtn>
        </Col>
      )}
      <AutoDietModal
        modalVisible={autoDietModalShow}
        setModalVisible={setAutoDietModalShow}
        dietNo={dietNo}
        dietDetailData={dietDetailData}
        openCurrentSection={() => setActiveSections([idx])}
      />
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
  width: 6px;
  height: 84px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${({backgroundColor}: StyledProps) => backgroundColor};
`;

const MenuSeq = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const AutoMenuBtn = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  margin-left: -16px;
  justify-content: center;
  align-items: center;
`;

const PlusBtnImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const AutoMenuText = styled(TextSub)`
  margin-left: 8px;
  font-size: 14px;
`;

const FoodNoAndPrice = styled(TextMain)`
  margin-left: 16px;
  margin-top: 16px;
  font-size: 14px;
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

const Row3 = styled(Row)`
  margin-top: 8px;
  padding: 0px 16px 0px 16px;
  width: 100%;
  justify-content: space-between;
`;

const MenuNoBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MenuNoText = styled(TextMain)`
  font-size: 14px;
`;

const MenuNoSelect = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 64px;
  height: 24px;
  margin-left: 8px;
  background-color: ${colors.backgroundLight};
  justify-content: space-between;
`;

const MenuNo = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
  margin-left: 4px;
`;

const UpDownImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const PriceSum = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
