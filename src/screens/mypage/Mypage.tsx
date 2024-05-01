import React, {useEffect, useMemo, useState} from 'react';
import {Text, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import {icons} from '../../shared/iconSource';
import colors from '../../shared/colors';
import {
  Col,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
} from '../../shared/ui/styledComps';

import DAlert from '../../shared/ui/DAlert';
import NutrTarget from '../../components/common/nutrient/NutrientTarget';
import CalChangeAlert from './ui/CalorieChangeAlert';
import NutrChangeAlert from './ui/NutrientChangeAlert';
import WeightChangeAlert from './ui/WeightChangeAlert';

import {
  useGetBaseLine,
  useUpdateBaseLine,
} from '../../shared/api/queries/baseLine';
import {
  convertNutr,
  convertNutrByWeight,
} from '../../shared/utils/targetCalculation';
import {loadBaseLineData} from '../../features/reduxSlices/userInputSlice';
import {RootState} from '../../app/store/reduxStore';
import PageBtn from './ui/PageBtn';
import {link} from '../../shared/utils/linking';
import {INQUIRY_URL} from '../../shared/constants';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';
import {updateNotShowAgainList} from '../../shared/utils/asyncStorage';
import {setTutorialStart} from '../../features/reduxSlices/commonSlice';

type IAlertType =
  | 'calorieChange'
  | 'carbChange'
  | 'proteinChange'
  | 'fatChange'
  | 'weightChange';

// FlatList Data
type INutrFLdata = Array<{
  nutrient: string;
  value: number;
  color: string;
  alertType: IAlertType;
}>;
// alert render fn
interface IRenderAlert {
  [key: string]: () => React.ReactElement;
}

const Mypage = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const userInputState = useSelector((state: RootState) => state.userInput);

  // react-query
  const updateMutation = useUpdateBaseLine();
  const {data: baseLineData} = useGetBaseLine();

  // useState
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertType, setAlertType] = useState<IAlertType>('calorieChange');
  const [restartTutorial, setRestartTutorial] = useState(false);

  // useEffect
  useEffect(() => {
    baseLineData && dispatch(loadBaseLineData(baseLineData));
  }, [baseLineData]);

  // etc
  // btns
  const myPageBtns = [
    {
      title: '이용방법',
      btnId: 'Tutorial',
      onPress: () => setRestartTutorial(true),
    },
    {
      title: '찜한상품',
      btnId: 'Likes',
      onPress: () => navigate('Likes'),
    },
    {
      title: '주문내역',
      btnId: 'OrderHistory',
      onPress: () => navigate('OrderHistoryNav', {screen: 'OrderHistory'}),
    },
    {title: '공지사항', btnId: 'Notice', onPress: () => navigate('Notice')},
    {title: '계정설정', btnId: 'Account', onPress: () => navigate('Account')},
    {
      title: '문의하기',
      btnId: 'Inquiry',
      onPress: () => link(INQUIRY_URL),
    },
  ];

  // Flatlist Data
  const nutrTargetData: INutrFLdata = useMemo(
    () => [
      {
        nutrient: '칼로리',
        value: parseFloat(baseLineData?.calorie || '0'),
        color: colors.main,
        alertType: 'calorieChange',
      },
      {
        nutrient: '탄수화물',
        value: parseFloat(baseLineData?.carb || '0'),
        color: colors.blue,
        alertType: 'carbChange',
      },
      {
        nutrient: '단백질',
        value: parseFloat(baseLineData?.protein || '0'),
        color: colors.green,
        alertType: 'proteinChange',
      },
      {
        nutrient: '지방',
        value: parseFloat(baseLineData?.fat || '0'),
        color: colors.orange,
        alertType: 'fatChange',
      },
    ],
    [baseLineData],
  );

  // alert render fn
  const renderAlertByType: IRenderAlert = {
    calorieChange: () => <CalChangeAlert />,
    carbChange: () => <NutrChangeAlert type="carbChange" />,
    proteinChange: () => <NutrChangeAlert type="proteinChange" />,
    fatChange: () => <NutrChangeAlert type="fatChange" />,
    weightChange: () => (
      <WeightChangeAlert
        autoCalculate={autoCalculate}
        setAutoCalculate={setAutoCalculate}
      />
    ),
  };

  // 알럿 창 확인버튼 동작
  const onAlertConfirm = () => {
    if (!baseLineData) {
      setAlertShow(false);
      return;
    }

    // 선택된 영양으로 다른 영양 자동 계산해서 업데이트
    const {calorie, carb, protein, fat} = convertNutr[alertType](
      baseLineData.calorie,
      userInputState[alertType].value,
    );
    updateMutation.mutate({
      ...baseLineData,
      calorie,
      carb,
      protein,
      fat,
    });
    setAlertShow(false);
    return;
  };

  const onAlertCancel = () => {
    setAlertShow(false);
  };

  const goTutorial = async () => {
    setRestartTutorial(false);
    await updateNotShowAgainList({key: 'tutorial', value: false});
    dispatch(setTutorialStart());
    navigate('BottomTabNav', {screen: 'Diet'});
  };

  return (
    <Container>
      {/* 상단 카드 */}
      <Card>
        <ProfileContainer>
          <ProfileTextContainer>
            <NickName>
              {baseLineData?.nickNm} <Text style={{fontWeight: '100'}}>님</Text>
            </NickName>
            <Hello>두비가 즐거운 식단실천을 응원합니다</Hello>
          </ProfileTextContainer>
          <UserInfoBtnContainer
            onPress={() => {
              navigate('UserInput', {from: 'Mypage'});
            }}>
            <UserInfoBtnText>정보변경</UserInfoBtnText>
            <RightArrow source={icons.arrowRight_20} />
          </UserInfoBtnContainer>
        </ProfileContainer>
        <RecommendationContainer>
          <Recommendation
            numberOfLines={1}
            ellipsizeMode="clip"
            style={{fontWeight: '400'}}>
            계획과 다르게 진행된다면 목표를 수정해보세요
          </Recommendation>
        </RecommendationContainer>

        {/* 칼탄단지 변경 버튼 */}
        <TargetNutrContainer>
          <FlatList
            data={nutrTargetData}
            keyExtractor={item => item.nutrient}
            renderItem={({item}) => (
              <NutrTarget
                nutrient={item.nutrient}
                value={String(item.value)}
                color={item.color}
                onPress={() => {
                  baseLineData && dispatch(loadBaseLineData(baseLineData));
                  setAlertType(item.alertType);
                  setAlertShow(true);
                }}
              />
            )}
            horizontal={true}
            ItemSeparatorComponent={() => <VerticalLine />}
          />
        </TargetNutrContainer>
      </Card>
      <HorizontalSpace height={24} />

      {/* 하단 메뉴 */}
      <Card style={{flex: 1}}>
        <PageBtn btns={myPageBtns} />
      </Card>

      {/* 변경 알럿창 */}
      <DAlert
        alertShow={alertShow}
        renderContent={() => renderAlertByType[alertType]()}
        onConfirm={onAlertConfirm}
        onCancel={onAlertCancel}
        confirmLabel="변경"
      />

      {/* 튜토리얼 진행 알럿 */}
      <DAlert
        alertShow={restartTutorial}
        renderContent={() => (
          <CommonAlertContent
            text="튜토리얼을 다시 진행할까요?"
            subText="구성한 끼니가 있다면 삭제됩니다"
          />
        )}
        onConfirm={goTutorial}
        onCancel={() => setRestartTutorial(false)}
        confirmLabel="진행"
        NoOfBtn={2}
      />
    </Container>
  );
};

export default Mypage;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;

const Card = styled.View`
  width: 100%;
  height: auto;
  background-color: ${colors.white};
  padding: 0px 16px 16px 16px;
  elevation: 0;
`;

const ProfileContainer = styled.View`
  margin-top: 24px;
  flex-direction: row;
  justify-content: space-between;
`;

const ProfileTextContainer = styled.View``;

const NickName = styled(TextMain)`
  font-size: 20px;
  font-weight: 700;
`;
const Hello = styled(TextMain)`
  margin-top: 4px;
  font-size: 14px;
`;

const RecommendationContainer = styled.View`
  width: 100%;
  height: 34px;
  margin-top: 24px;
  background-color: ${colors.highlight2};
  justify-content: center;
  align-items: center;
`;

const Recommendation = styled(TextMain)`
  font-size: 16px;
  font-weight: 300;
`;

const UserInfoBtnContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UserInfoBtnText = styled(TextSub)``;

const TargetNutrContainer = styled.View`
  width: 100%;
  margin-top: 16px;
  /* flex-direction: row; */
  /* justify-content: center; */
`;

const RightArrow = styled.Image`
  width: 20px;
  height: 20px;
`;
