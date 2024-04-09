import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import styled from 'styled-components/native';
import NutrientsProgress from '../common/nutrient/NutrientsProgress';
import colors from '../../shared/colors';
import Menu from './Menu';
import AccordionCtaBtns from './AccordionCtaBtns';
import {
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
} from '../../shared/ui/styledComps';
import MenuNumSelect from '../cart/MenuNumSelect';
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';

interface IMenuAcContent {
  screen?: string;
  dBData: IDietBaseData;
  dDData: IDietDetailData;
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const MenuAcContent = ({
  screen = 'Home',
  dDData,
  dBData,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IMenuAcContent) => {
  // fn
  const onMenuNoSelectPress = () => {
    if (!setDietNoToNumControl || !setMenuNumSelectShow) return;
    setDietNoToNumControl(dBData.dietNo);
    setMenuNumSelectShow(true);
  };

  // etc
  const dietPrice = sumUpPrice(dDData);
  const currentQty = dDData[0]?.qty ? parseInt(dDData[0].qty, 10) : 1;
  return (
    <Container>
      <HorizontalSpace height={8} />

      <NutrientsProgress dietDetailData={dDData} tooltipShow={false} />

      <Menu dietDetailData={dDData} dietNo={dBData.dietNo} />
      <HorizontalLine style={{marginTop: 40}} />
      <HorizontalSpace height={24} />

      {screen === 'Home' && (
        <AccordionCtaBtns dDData={dDData} dietNo={dBData.dietNo} />
      )}
      {screen === 'Cart' && (
        <Row style={{justifyContent: 'space-between', paddingLeft: 16}}>
          <Price>{commaToNum(dietPrice)}원</Price>
          <MenuNumSelect
            disabled={dDData.length === 0}
            action="openModal"
            currentQty={currentQty}
            openMenuNumSelect={onMenuNoSelectPress}
          />
        </Row>
      )}

      <HorizontalSpace height={24} />
    </Container>
  );
};

export default MenuAcContent;

const Container = styled.View`
  background-color: ${colors.white};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-color: ${colors.lineLight};
  border-width: 1px;
  padding: 0 8px;
`;

const Price = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;
