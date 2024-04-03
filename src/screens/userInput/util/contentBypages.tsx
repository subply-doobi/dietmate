// doobi
import Start from '../ui/subScreens/Start';
import Age from '../ui/subScreens/Age';
import Amr from '../ui/subScreens/Amr';
import Height from '../ui/subScreens/Height';
import Purpose from '../ui/subScreens/Purpose';
import Gender from '../ui/subScreens/Gender';
import TargetManual from '../ui/subScreens/TargetManual';
import TargetOptions from '../ui/subScreens/TargetOptions';
import TargetRatio from '../ui/subScreens/TargetRatio';
import WODuration from '../ui/subScreens/WODuration';
import WOFrequency from '../ui/subScreens/WOFrequency';
import WOIntensity from '../ui/subScreens/WOIntensity';
import Weight from '../ui/subScreens/Weight';
import React, {SetStateAction} from 'react';
import Result from '../ui/subScreens/Result';
import {IUserInputState} from '../../../features/reduxSlices/userInputSlice';
import {SPORTS_SEQ_CD} from '../../../shared/constants';

export const PAGES = [
  {
    id: 0,
    name: 'Start',
    title: '목적에 따라 목표로 할\n영양성분 양을 정해드릴게요',
    subTitle: '입력된 정보로 목표 칼로리를 계산해드려요',
    getNextPage: (u: IUserInputState) => 'Gender',
    checkIsActive: (u: IUserInputState) => true,
    render: (u: IUserInputState) => <Start userInputState={u} />,
  },
  {
    id: 1,
    name: 'Gender',
    title: '성별을 알려주세요',
    subTitle: '성별에 따라\n열량소모가 달라져요',
    getNextPage: (u: IUserInputState) => 'Age',
    checkIsActive: (u: IUserInputState) => u.gender.isValid,
    render: (u: IUserInputState) => <Gender userInputState={u} />,
  },
  {
    id: 2,
    name: 'Age',
    title: '만 나이를 알려주세요',
    subTitle: '한 두 살 차이가\n크게 영향을 미치지는 않아요',
    getNextPage: (u: IUserInputState) => 'Height',
    checkIsActive: (u: IUserInputState) => u.age.isValid,
    render: (u: IUserInputState) => <Age userInputState={u} />,
  },
  {
    id: 3,
    name: 'Height',
    title: '신장을 알려주세요',
    subTitle: '키가 크면 열량 소모가 커집니다\n몸을 크게 만드는데는 불리하겠죠',
    getNextPage: (u: IUserInputState) => 'Weight',
    checkIsActive: (u: IUserInputState) => u.height.isValid,
    render: (u: IUserInputState) => <Height userInputState={u} />,
  },
  {
    id: 4,
    name: 'Weight',
    title: '체중을 알려주세요',
    subTitle:
      '체중이 높을수록 열량 소모가 커져요\n체중 감량을 위해 덜 먹어야겠죠?',
    getNextPage: (u: IUserInputState) => 'Purpose',
    checkIsActive: (u: IUserInputState) => u.weight.isValid,
    render: (u: IUserInputState) => <Weight userInputState={u} />,
  },
  {
    id: 5,
    name: 'Purpose',
    title: '어떤 목적을 위해\n식단을 하나요',
    subTitle: '어렵지 않아요\n체중감소는 덜먹고, 체중증가는 더 먹고!',
    getNextPage: (u: IUserInputState) => 'WOFrequency',
    checkIsActive: (u: IUserInputState) => u.dietPurposeCd.isValid,
    render: (u: IUserInputState) => <Purpose userInputState={u} />,
  },
  {
    id: 6,
    name: 'WOFrequency',
    title: '일주일에 운동을\n몇 번이나 하는지 알려주세요',
    subTitle: '운동을 많이, 오래 할수록\n먹을 수 있는 양이 많아지겠죠?',
    getNextPage: (u: IUserInputState) =>
      u.sportsSeqCd.value === SPORTS_SEQ_CD[0].cd ? 'TargetOptions' : 'Amr',
    checkIsActive: (u: IUserInputState) => u.sportsSeqCd.isValid,
    render: (u: IUserInputState) => <WOFrequency userInputState={u} />,
  },
  {
    id: 7,
    name: 'Amr',
    title: '기초대사량과 운동으로 소모하는\n열량을 알고 계신가요',
    subTitle: '모르신다면\n입력 없이 다음으로 넘어가주세요',
    getNextPage: (u: IUserInputState) =>
      u.amrKnown.value !== "" && u.amrKnown.isValid ? 'TargetOptions' : 'WODuration',
    checkIsActive: (u: IUserInputState) =>
      u.bmrKnown.isValid && u.amrKnown.isValid,
    render: (u: IUserInputState) => <Amr userInputState={u} />,
  },
  {
    id: 8,
    name: 'WODuration',
    title: '운동은 평균적으로\n몇 분 동안 하나요',
    subTitle: '운동을 많이, 오래 할수록\n먹을 수 있는 양이 많아지겠죠?',
    getNextPage: (u: IUserInputState) => 'WOIntensity',
    checkIsActive: (u: IUserInputState) => u.sportsTimeCd.isValid,
    render: (u: IUserInputState) => <WODuration userInputState={u} />,
  },
  {
    id: 9,
    name: 'WOIntensity',
    title: '어떤 강도로\n운동을 하는지 알려주세요',
    subTitle: '운동을 많이, 오래 할수록\n먹을 수 있는 양이 많아지겠죠?',
    getNextPage: (u: IUserInputState) => 'TargetOptions',
    checkIsActive: (u: IUserInputState) => u.sportsStrengthCd.isValid,
    render: (u: IUserInputState) => <WOIntensity userInputState={u} />,
  },
  {
    id: 10,
    name: 'TargetOptions',
    title: '목표로 하는\n칼로리가 있나요',
    subTitle:
      '원하는 목표섭취량이 있다면\n해당 목표에 맞게 식단을 추천해드려요',
    getNextPage: (u: IUserInputState) =>
      u.targetOption.value[0] === 0
        ? 'Result'
        : u.targetOption.value[0] === 1
          ? 'TargetRatio'
          : 'TargetManual',
    checkIsActive: (u: IUserInputState) => u.targetOption.value.length !== 0,
    render: (u: IUserInputState) => <TargetOptions userInputState={u} />,
  },
  {
    id: 11,
    name: 'TargetRatio',
    title: '칼로리와 영양성분 비율을\n입력해주세요',
    subTitle: '다이어트메이트가 권장하는\n칼로리도 확인해주세요',
    getNextPage: (u: IUserInputState) => 'Result',
    checkIsActive: (u: IUserInputState) => u.ratio.isValid && u.calorie.isValid,
    render: (u: IUserInputState) => <TargetRatio userInputState={u} />,
  },
  {
    id: 12,
    name: 'TargetManual',
    title: '영양성분 양을 모두\n직접 입력해주세요',
    subTitle: '다이어트메이트가 권장하는\n영양성분 양도 확인해주세요',
    getNextPage: (u: IUserInputState) => 'Result',
    checkIsActive: (u: IUserInputState) =>
      u.carb.isValid && u.protein.isValid && u.fat.isValid,
    render: (u: IUserInputState) => <TargetManual userInputState={u} />,
  },
  {
    id: 13,
    name: 'Result',
    title: '목표섭취량 계산이\n완료되었어요',
    subTitle: '목표섭취량은 마이페이지에서\n언제든지 변경이 가능합니다',
    getNextPage: (u: IUserInputState) => 'None',
    checkIsActive: (u: IUserInputState) => true,
    render: (u: IUserInputState) => <Result userInputState={u} />,
  },
];
