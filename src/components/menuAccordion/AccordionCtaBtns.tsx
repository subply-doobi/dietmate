// react, RN, 3rd
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';

// doobi Component
import {BtnCTA, Icon, Row, TextSub} from '../../shared/ui/styledComps';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {getNutrStatus, sumUpNutrients} from '../../shared/utils/sumUp';
import {IDietDetailData} from '../../shared/api/types/diet';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import CtaButton from '../../shared/ui/CtaButton';
import colors from '../../shared/colors';
import {SCREENWIDTH} from '../../shared/constants';
import {useNavigation} from '@react-navigation/native';

const AccordionCtaBtns = ({
  dDData,
  dietNo,
}: {
  dDData: IDietDetailData;
  dietNo: string;
}) => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const {totalFoodList} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: bLData} = useGetBaseLine();
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const btnText =
    nutrStatus === 'satisfied' || nutrStatus === 'exceed'
      ? '자동구성 재시도'
      : nutrStatus === 'notEnough'
        ? '남은 영양만큼 자동구성'
        : '자동구성';
  const btnStyle = nutrStatus === 'empty' ? 'borderActive' : 'border';
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <CtaButton
        shadow={false}
        btnStyle={'border'}
        // btnContent={() => <Icon source={icons.plus_24} />}
        btnText="+"
        style={{width: 48, height: 48, borderWidth: 2}}
        onPress={() => navigate('ManualAdd', {from: 'Home'})}
      />
      <CtaButton
        shadow={false}
        btnStyle={btnStyle}
        btnText={btnText}
        style={{
          width: SCREENWIDTH - 32 - 16 - 48 - 8,
          height: 48,
          borderWidth: 2,
        }}
        onPress={() =>
          navigate('AutoMenu', {
            isOneMenuAuto: true,
            selectedOneDietNo: dietNo,
            initialMenu: dDData,
          })
        }
      />
    </Row>
  );
};

export default AccordionCtaBtns;
