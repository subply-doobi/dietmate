// react, RN, 3rd
import styled from 'styled-components/native';

// doobi util, redux, etc
import colors from '../../styles/colors';

// doobi Component
import NutrientsProgress from '../common/nutrient/NutrientsProgress';

// react-query
import {IDietDetailData} from '../../query/types/diet';
import Menu from './Menu';
import {SetStateAction} from 'react';

interface IAccordionContent {
  dietNo: string;
  dietDetailData: IDietDetailData;
  setDietNoToNumControl: React.Dispatch<SetStateAction<string>>;
  setNumberPickerShow: React.Dispatch<SetStateAction<boolean>>;
}

const AccordionContent = ({
  dietNo,
  dietDetailData,
  setDietNoToNumControl,
  setNumberPickerShow,
}: IAccordionContent) => {
  return (
    <ContentBody>
      <NutrientsProgress dietDetailData={dietDetailData} />
      <Menu
        dietNo={dietNo}
        dietDetailData={dietDetailData}
        setDietNoToNumControl={setDietNoToNumControl}
        setNumberPickerShow={setNumberPickerShow}
      />
    </ContentBody>
  );
};

export default AccordionContent;

const ContentBody = styled.View`
  padding: 0px 8px 16px 8px;
  background-color: ${colors.white};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
