// react, RN, 3rd
import styled from 'styled-components/native';

// doobi util, redux, etc
import colors from '../../shared/colors';

// doobi Component
import NutrientsProgress from '../common/nutrient/NutrientsProgress';

// react-query
import {IDietDetailData} from '../../shared/api/types/diet';
import Menu from './Menu';
import {SetStateAction} from 'react';
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';
import {HorizontalSpace, Row, TextMain} from '../../shared/ui/styledConsts';
import MenuNumSelect from './MenuNumSelect';

interface IAccordionContent {
  dietNo: string;
  dietDetailData: IDietDetailData;
  setDietNoToNumControl: React.Dispatch<SetStateAction<string>>;
  setMenuNumSelectShow: React.Dispatch<SetStateAction<boolean>>;
}

const AccordionContent = ({
  dietNo,
  dietDetailData,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IAccordionContent) => {
  const dietPrice = sumUpPrice(dietDetailData);
  const currentQty = dietDetailData[0]?.qty
    ? parseInt(dietDetailData[0].qty, 10)
    : 1;

  const onMenuNoSelectPress = () => {
    setDietNoToNumControl(dietNo);
    setMenuNumSelectShow(true);
  };
  return (
    <ContentBody>
      <Row
        style={{
          marginTop: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <PriceSum>{commaToNum(dietPrice)}원</PriceSum>
        <MenuNumSelect
          disabled={dietDetailData.length === 0}
          action="openModal"
          currentQty={currentQty}
          openMenuNumSelect={onMenuNoSelectPress}
        />
      </Row>
      <HorizontalSpace height={8} />
      <NutrientsProgress dietDetailData={dietDetailData} />
      <Menu dietNo={dietNo} dietDetailData={dietDetailData} />
    </ContentBody>
  );
};

export default AccordionContent;

const ContentBody = styled.View`
  padding: 0px 8px 24px 8px;
  background-color: ${colors.white};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const PriceSum = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;
