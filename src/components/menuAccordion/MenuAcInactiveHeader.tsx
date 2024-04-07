// RN

// 3rd
import styled from 'styled-components/native';
import {RootState} from '../../app/store/reduxStore';
import {useSelector} from 'react-redux';

// doobi
import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import {
  Col,
  Icon,
  TextMain,
  TextSub,
  VerticalSpace,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {
  checkNutrSatisfied,
  commaToNum,
  getExceedIdx,
  getNutrStatus,
  sumUpNutrients,
  sumUpPrice,
} from '../../shared/utils/sumUp';
import {icons} from '../../shared/iconSource';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import {SCREENWIDTH} from '../../shared/constants';
import {ViewProps} from 'react-native';
import MenuNumSelect from '../cart/MenuNumSelect';

interface IMenuAcInactiveHeader {
  screen?: string;
  bLData: IBaseLineData;
  dBData: IDietBaseData;
  dDData: IDietDetailData;
  currentDietNo: string;
  selected?: boolean;
  leftBarInactive?: boolean;
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const MenuAcInactiveHeader = ({
  screen = 'Home',
  dBData,
  dDData,
  bLData,
  currentDietNo,
  selected = false,
  leftBarInactive,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IMenuAcInactiveHeader) => {
  // redux
  const {totalFoodList} = useSelector((state: RootState) => state.common);

  // fn
  const onMenuNoSelectPress = () => {
    if (!setDietNoToNumControl || !setMenuNumSelectShow) return;
    setDietNoToNumControl(dBData.dietNo);
    setMenuNumSelectShow(true);
  };

  // etc
  const priceSum = sumUpPrice(dDData);
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const barColor = selected
    ? colors.dark
    : leftBarInactive
      ? colors.inactivated
      : currentDietNo === dBData.dietNo
        ? colors.dark
        : colors.inactivated;

  const currentQty = dDData[0]?.qty ? parseInt(dDData[0].qty, 10) : 1;

  return (
    <Box selected={selected} screen={screen}>
      <LeftBar style={{backgroundColor: barColor}} />
      <Col style={{marginLeft: 12, rowGap: 4}}>
        <Title>{dBData.dietSeq}</Title>
        {dDData.length !== 0 && screen === 'Cart' && (
          <SubTitle>{`${commaToNum(priceSum)}원 (${dDData.length}가지 식품)`}</SubTitle>
        )}
      </Col>
      {dDData.length !== 0 && screen !== 'Cart' && (
        <SubTitle>{`${commaToNum(priceSum)}원 (${dDData.length}가지 식품)`}</SubTitle>
      )}
      <Col
        style={{
          position: 'absolute',
          right: 8,
          rowGap: 12,
          alignItems: 'flex-end',
        }}>
        {nutrStatus === 'satisfied' || nutrStatus === 'exceed' ? (
          <Icon
            source={
              nutrStatus === 'satisfied'
                ? icons.checkRoundChecked_24
                : icons.warning_24
            }
          />
        ) : (
          <Dummy />
        )}
        {screen === 'Cart' && (
          <MenuNumSelect
            disabled={dDData.length === 0}
            action="openModal"
            currentQty={currentQty}
            openMenuNumSelect={onMenuNoSelectPress}
          />
        )}
      </Col>
    </Box>
  );
};

export default MenuAcInactiveHeader;

const Box = styled.View<{
  selected?: boolean;
  screen?: 'Home' | 'Cart' | string;
}>`
  background-color: ${colors.white};
  width: 100%;
  height: ${({screen}) => (screen === 'Home' ? 48 : 84)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({selected}) =>
    selected ? colors.dark : colors.inactivated};
  border-width: ${({selected}) => (selected ? '2px' : '1px')};
`;

const LeftBar = styled.View<{screen?: 'Home' | 'Cart' | string}>`
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: ${colors.inactivated};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const Title = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
`;

const SubTitle = styled(TextSub)`
  font-size: 14px;
  margin-right: 56px;
  line-height: 18px;
`;

const Dummy = styled.View`
  width: 24px;
  height: 24px;
`;
