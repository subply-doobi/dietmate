import {useSelector} from 'react-redux';
import MenuAcInactiveHeader from '../../../components/menuAccordion/MenuAcInactiveHeader';
import {IDietDetailData} from '../../../shared/api/types/diet';
import {Col} from '../../../shared/ui/styledComps';
import {RootState} from '../../../app/store/reduxStore';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';
import {useListDiet, useListDietTotal} from '../../../shared/api/queries/diet';
import {SetStateAction, useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import colors from '../../../shared/colors';

interface ISelect {
  dTData: IDietDetailData[];
  selectedDietNo: string[];
  setSelectedDietNo: React.Dispatch<SetStateAction<string[]>>;
}
const Select = ({dTData, selectedDietNo, setSelectedDietNo}: ISelect) => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: bLData} = useGetBaseLine();
  const {data: dData} = useListDiet();
  const dietTotalData = useListDietTotal(dData, {enabled: !!dData});

  // useEffect
  // 첫 렌더링 시 비어있는 끼니 자동으로 선택
  useEffect(() => {
    if (!dTData || !dData) return;
    let emptyDietNoList: string[] = [];
    for (let i = 0; i < dTData.length; i++) {
      dTData[i].length === 0 && emptyDietNoList.push(dData[i].dietNo);
    }
    setSelectedDietNo(v => [...emptyDietNoList]);
  }, []);

  // etc
  const onPress = (dietNo: string) => {
    if (selectedDietNo.includes(dietNo)) {
      setSelectedDietNo(v => v.filter((value, i) => value !== dietNo));
      return;
    }
    setSelectedDietNo(v => [...v, dietNo]);
  };

  return (
    <Col style={{rowGap: 20, marginTop: 64}}>
      {bLData &&
        dData &&
        dTData &&
        dTData.map((dDData, idx) => (
          <MenuSelectBtn key={idx} onPress={() => onPress(dData[idx].dietNo)}>
            <MenuAcInactiveHeader
              dBData={dData[idx]}
              dDData={dDData}
              bLData={bLData}
              currentDietNo={currentDietNo}
              selected={selectedDietNo.includes(dData[idx].dietNo)}
              leftBarInactive={true}
            />
          </MenuSelectBtn>
        ))}
    </Col>
  );
};

export default Select;

const MenuSelectBtn = styled.TouchableOpacity``;
