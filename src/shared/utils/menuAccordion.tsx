import {IDietData, IDietDetailData} from '../api/types/diet';
import MenuAcInactiveHeader from '../../components/menuAccordion/MenuAcInactiveHeader';
import {IBaseLineData} from '../api/types/baseLine';
import MenuAcActiveHeader from '../../components/menuAccordion/MenuAcActiveHeader';
import MenuAcContent from '../../components/menuAccordion/MenuAcContent';

interface IGetMenuAcContent {
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
  screen?: string;
  currentDietNo: string;
  bLData: IBaseLineData | undefined;
  dData: IDietData | undefined;
  dTData: IDietDetailData[] | undefined;
}
export const getMenuAcContent = ({
  setDietNoToNumControl,
  setMenuNumSelectShow,
  screen = 'Home',
  currentDietNo,
  bLData,
  dData,
  dTData,
}: IGetMenuAcContent) => {
  if (!bLData || !dTData || !dData)
    return [{activeHeader: <></>, inactiveHeader: <></>, content: <></>}];
  return dTData.map((dDData, idx) => {
    return {
      activeHeader: (
        <MenuAcActiveHeader
          bLData={bLData}
          dBData={dData[idx]}
          dDData={dDData}
        />
      ),
      inactiveHeader: (
        <MenuAcInactiveHeader
          screen={screen}
          currentDietNo={currentDietNo}
          bLData={bLData}
          dBData={dData[idx]}
          dDData={dDData}
          setDietNoToNumControl={setDietNoToNumControl}
          setMenuNumSelectShow={setMenuNumSelectShow}
        />
      ),
      content: (
        <MenuAcContent
          screen={screen}
          dDData={dDData}
          dBData={dData[idx]}
          setDietNoToNumControl={setDietNoToNumControl}
          setMenuNumSelectShow={setMenuNumSelectShow}
        />
      ),
    };
  });
};
