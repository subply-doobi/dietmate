import styled from 'styled-components/native';
import CommonAlertContent from '../../../components/common/alert/CommonAlertContent';
import DTooltip from '../../../components/common/tooltip/DTooltip';
import CreateDietAlert from '../ui/CreateDietAlert';
import ErrorAlertContent from '../ui/ErrorAlertContent';
import LoadingAlertContent from '../ui/LoadingAlertContent';
import colors from '../../../shared/colors';
import {Col, Icon, TextMain} from '../../../shared/ui/styledComps';
import {IDietDetailData} from '../../../shared/api/types/diet';
import NutrientsProgress from '../../../components/common/nutrient/NutrientsProgress';
import AccordionCtaBtns from '../../../components/menuAccordion/AccordionCtaBtns';
import AddMenuBtn from '../ui/AddMenuBtn';
import {icons} from '../../../shared/iconSource';
import CtaButton from '../../../shared/ui/CtaButton';
import {SCREENWIDTH} from '../../../shared/constants';
import {ReactElement} from 'react';
import {GestureResponderEvent} from 'react-native';

interface ICreateDietAlert {
  numOfCreateDiet: number;
  setNumOfCreateDiet: React.Dispatch<React.SetStateAction<number>>;
  isCreating: boolean;
}
interface ICreateDietNA {
  addDietNAText: string;
}

interface IRenderAlertContent {
  createDiet: ({
    numOfCreateDiet,
    setNumOfCreateDiet,
    isCreating,
  }: ICreateDietAlert) => ReactElement;
  createDietNA: ({addDietNAText}: ICreateDietNA) => ReactElement;
  autoMenuLoading: () => ReactElement;
  autoMenuError: () => ReactElement;
  tutorialComplete: () => ReactElement;
  [key: string]: (args: any) => ReactElement;
}

export const renderAlertContent: IRenderAlertContent = {
  createDiet: ({numOfCreateDiet, setNumOfCreateDiet, isCreating}) => (
    <CreateDietAlert
      numOfCreateDiet={numOfCreateDiet}
      setNumOfCreateDiet={setNumOfCreateDiet}
      isCreating={isCreating}
    />
  ),
  createDietNA: ({addDietNAText}) => (
    <CommonAlertContent text={addDietNAText} />
  ),
  autoMenuLoading: () => <LoadingAlertContent />,
  autoMenuError: () => (
    <CommonAlertContent
      text={'자동구성 오류가 발생했어요'}
      subText={'재시도 후에도 오류가 지속되면\n문의 부탁드립니다'}
    />
  ),
  tutorialComplete: () => (
    <CommonAlertContent
      text={'튜토리얼이 완료되었어요\n이제 자유롭게 이용해보세요!'}
      subText={'튜토리얼은 마이페이지에서\n다시 진행할 수 있어요'}
    />
  ),
};

interface IDTP {
  fn: ((event: GestureResponderEvent) => void) | undefined;
  headerHeight: number;
  bottomTabBarHeight: number;
}
interface IAddMenuDTP extends IDTP {
  dTData: IDietDetailData[];
}
interface IAddFoodDTP extends IDTP {
  fn: ((event: GestureResponderEvent) => void) | undefined;
  dTData: IDietDetailData[];
  currentDietNo: string;
}
interface IAutoRemainDTP extends IDTP {
  dTData: IDietDetailData[];
  currentDietNo: string;
}
interface IAutoMenuDTP extends IDTP {
  dTData: IDietDetailData[];
}
interface IRenderDTPContent {
  AddMenu: (p: IAddMenuDTP) => ReactElement;
  AddFood: (p: IAddFoodDTP) => ReactElement;
  AutoRemain: (p: IAutoRemainDTP) => ReactElement;
  ChangeFood: (p: IDTP) => ReactElement;
  AutoMenu: (p: IAutoMenuDTP) => ReactElement;
  [key: string]: (args: any) => ReactElement;
}

export const renderDTPContent: IRenderDTPContent = {
  AddMenu: ({fn, headerHeight, dTData}) => (
    <>
      <DTooltip
        tooltipShow={true}
        text="끼니를 먼저 추가해볼까요?"
        boxTop={headerHeight}
      />
      <AddMenuBtn
        dTData={dTData}
        onPress={fn}
        style={{marginTop: headerHeight + 40}}
      />
    </>
  ),
  AddFood: ({headerHeight, dTData, currentDietNo}) => (
    <>
      <DTooltip
        tooltipShow={true}
        text="식품을 추가할 차례에요!"
        boxTop={headerHeight + 40 + 48 + 8 + 70}
        boxLeft={8}
      />
      <AccordionCtaBtns
        style={{
          paddingHorizontal: 8,
          marginTop: headerHeight + 40 + 48 + 8 + 70 + 40,
        }}
        dDData={dTData ? dTData[0] : []}
        dietNo={currentDietNo}
        onlyAdd={true}
      />
    </>
  ),
  AutoRemain: ({dTData, currentDietNo, headerHeight}) => (
    <>
      <Col
        style={{
          position: 'absolute',
          width: '100%',
          backgroundColor: colors.white,
          paddingHorizontal: 8,
          marginTop: headerHeight + 40 + 48 + 8,
        }}>
        <NutrientsProgress dietDetailData={dTData ? dTData[0] : []} />
      </Col>
      <DTooltip
        tooltipShow={true}
        text="남은 영양을 자동으로 채워볼게요!"
        boxTop={headerHeight + 40 + 48 + 8 + 70 + 24 + 32 + 24 + 104 + 1}
        boxLeft={8 + 48 + 8}
      />
      <AccordionCtaBtns
        style={{
          paddingHorizontal: 8,
          marginTop: headerHeight + 40 + 48 + 8 + 70 + 24 + 32 + 24 + 104 + 41,
        }}
        dDData={dTData ? dTData[0] : []}
        dietNo={currentDietNo}
        onlyAuto={true}
      />
    </>
  ),
  ChangeFood: ({fn, headerHeight}) => (
    <>
      <DTooltip
        tooltipShow={true}
        triangleRight={16}
        text="영양이 비슷한 식품으로 교체할 수 있어요"
        boxTop={
          headerHeight +
          40 +
          48 +
          8 +
          70 +
          24 +
          32 +
          24 +
          104 +
          24 +
          104 -
          52 -
          40
        }
        boxRight={8}
      />
      <ChangeBtn
        onPress={fn}
        style={{
          position: 'absolute',
          top:
            headerHeight +
            40 +
            48 +
            8 +
            70 +
            24 +
            32 +
            24 +
            104 +
            24 +
            104 -
            52,
          right: 8,
        }}>
        <Icon source={icons.changeRound_24} />
      </ChangeBtn>
    </>
  ),
  AutoMenu: ({fn, bottomTabBarHeight, dTData}) => (
    <>
      <DTooltip
        tooltipShow={true}
        text="전체 자동구성도 해볼게요"
        boxBottom={bottomTabBarHeight + 8 + 52 + 24 + 48 + 4}
        boxLeft={0}
      />
      <CtaButton
        shadow={false}
        btnStyle="active"
        style={{
          position: 'absolute',
          width: SCREENWIDTH - 32,
          height: 48,
          bottom: bottomTabBarHeight + 8 + 52 + 24,
          alignSelf: 'center',
        }}
        btnText={`${dTData?.length} 끼니 자동구성`}
        onPress={fn}
      />
    </>
  ),
};

const ChangeBtn = styled.TouchableOpacity`
  width: 32px;
  height: 52px;
  background-color: ${colors.white};
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-width: 1px;
  border-color: ${colors.lineLight};
`;
