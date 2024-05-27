import styled from 'styled-components/native';
import NutrientsProgress from '../common/nutrient/NutrientsProgress';
import colors from '../../shared/colors';
import Menu from './Menu';
import AccordionCtaBtns from './AccordionCtaBtns';
import {
  Col,
  HorizontalLine,
  HorizontalSpace,
  TextMain,
} from '../../shared/ui/styledComps';
import MenuNumSelect from '../cart/MenuNumSelect';
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';
import {useListDietTotalObj} from '../../shared/api/queries/diet';

interface IMenuAcContent {
  dietNo: string;
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const MenuAcContent = ({
  dietNo,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IMenuAcContent) => {
  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dDData = dTOData?.[dietNo]?.dietDetail ?? [];

  // etc
  const dietPrice = sumUpPrice(dDData);
  const currentQty = dDData[0]?.qty ? parseInt(dDData[0].qty, 10) : 1;
  const isEmpty = dDData.length === 0;

  // fn
  const onMenuNoSelectPress = () => {
    if (isEmpty || !setDietNoToNumControl || !setMenuNumSelectShow) return;
    setDietNoToNumControl(dietNo);
    setMenuNumSelectShow(true);
  };

  return (
    <Container>
      <HorizontalSpace height={8} />
      <NutrientsProgress dietDetailData={dDData} tooltipShow={false} />
      <Menu dietDetailData={dDData} dietNo={dietNo} />

      {/* 식품추가 - 자동구성 버튼 */}
      <HorizontalSpace height={40} />
      <AccordionCtaBtns dDData={dDData} dietNo={dietNo} />

      {/* 수량조절 - 가격 */}
      {dDData.length !== 0 && (
        <Col
          style={{
            marginTop: 24,
            alignItems: 'flex-end',
          }}>
          <HorizontalLine />
          <HorizontalSpace height={24} />
          <MenuNumSelect
            disabled={isEmpty}
            action="openModal"
            currentQty={currentQty}
            openMenuNumSelect={onMenuNoSelectPress}
          />
          <Price>{commaToNum(dietPrice)}원</Price>
        </Col>
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
  margin-top: 16px;
`;
