import React, {useMemo, useState} from 'react';
import {Text, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useForm, useWatch} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../stores/store';
import {icons} from '../assets/icons/iconSource';
import {myPageBtns} from '../constants/constants';
import colors from '../styles/colors';
import {
  Col,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
} from '../styles/styledConsts';

import DAlert from '../components/common/alert/DAlert';
import NutrTarget from '../components/common/NutrientTarget';
import CalChangeAlert from '../components/myPage/CalorieChangeAlert';
import NutrChangeAlert from '../components/myPage/NutrientChangeAlert';
import WeightChangeAlert from '../components/myPage/WeightChangeAlert';

import {useGetBaseLine, useUpdateBaseLine} from '../query/queries/baseLine';

interface INavigateByBtnId {
  [key: string]: (btnId: string, navigate: Function) => void;
}

// TBD | order -> 원래는 OrderHistory로 바꿔야함! 지금은 Order페이지 테스트
const navigateByBtnId: INavigateByBtnId = {
  History: (btnId, navigate) => navigate('HistoryNav', {screen: btnId}),
  Likes: (btnId, navigate) => navigate('BottomTabNav', {screen: btnId}),
  Order: (btnId, navigate) => navigate('OrderNav', {screen: btnId}),
  PaymentHistory: (btnId, navigate) =>
    navigate('PaymentHistoryNav', {screen: btnId}),
};

const Mypage = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const {userTarget, userInfo} = useSelector(
    (state: RootState) => state.userInfo,
  );

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const updateMutation = useUpdateBaseLine();

  // console.log('mypage/data:', data);

  // FlatList Data
  type INutrTargetData = Array<{
    nutrient: string;
    value: number;
    color: string;
    alertType: 'calorie' | 'carb' | 'protein' | 'fat' | 'weight';
  }>;

  const nutrTargetData: INutrTargetData = useMemo(
    () => [
      {
        nutrient: '칼로리',
        value: parseFloat(baseLineData?.calorie || '0'),
        color: colors.main,
        alertType: 'calorie',
      },
      {
        nutrient: '탄수화물',
        value: parseFloat(baseLineData?.carb || '0'),
        color: colors.blue,
        alertType: 'carb',
      },
      {
        nutrient: '단백질',
        value: parseFloat(baseLineData?.protein || '0'),
        color: colors.green,
        alertType: 'protein',
      },
      {
        nutrient: '지방',
        value: parseFloat(baseLineData?.fat || '0'),
        color: colors.orange,
        alertType: 'fat',
      },
    ],
    [baseLineData],
  );

  // react-hook-form
  interface IFormData {
    calorie: string;
    carb: string;
    protein: string;
    fat: string;
    weight: string;
  }
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    defaultValues: baseLineData && {
      calorie: String(parseInt(baseLineData.calorie)),
      carb: String(parseInt(baseLineData.carb)),
      protein: String(parseInt(baseLineData.protein)),
      fat: String(parseInt(baseLineData.fat)),
      weight: String(parseInt(baseLineData.weight)),
    },
  });
  const calorieValue = useWatch({control, name: 'calorie'});
  const carbValue = useWatch({control, name: 'carb'});
  const proteinValue = useWatch({control, name: 'protein'});
  const fatValue = useWatch({control, name: 'fat'});
  const weightValue = useWatch({control, name: 'weight'});
  const [autoCalculate, setAutoCalculate] = useState(false);

  // userInfo change alert
  const [alertShow, setAlertShow] = useState(false);
  const [alertType, setAlertType] = useState<
    'calorie' | 'carb' | 'protein' | 'fat' | 'weight'
  >('calorie');
  interface IRenderAlert {
    [key: string]: () => React.ReactElement;
  }
  const renderAlertByType: IRenderAlert = {
    calorie: () => (
      <CalChangeAlert
        type="calorie"
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    ),
    carb: () => (
      <NutrChangeAlert
        type="carb"
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    ),
    protein: () => (
      <NutrChangeAlert
        type="protein"
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    ),
    fat: () => (
      <NutrChangeAlert
        type="fat"
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    ),
    weight: () => (
      <WeightChangeAlert
        type="weight"
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        autoCalculate={autoCalculate}
        setAutoCalculate={setAutoCalculate}
      />
    ),
  };
  const typeData = {
    calorie: calorieValue,
    carb: carbValue,
    protein: proteinValue,
    fat: fatValue,
    weight: weightValue,
  };
  const typeValue = typeData[alertType];
  const onAlertConfirm = () => {
    baseLineData &&
      updateMutation.mutate({
        ...baseLineData,
        [alertType]: typeValue,
      });
    setAlertShow(false);
  };
  const onAlertCancel = () => {
    setAlertShow(false);
  };

  return (
    <Container>
      <Card>
        <ProfileContainer>
          <ProfileTextContainer>
            <NickName>
              섭섭 <Text style={{fontWeight: '100'}}>님</Text>
            </NickName>
            <Hello>두비가 즐거운 식단실천을 응원합니다</Hello>
          </ProfileTextContainer>
          <UserInfoBtnContainer
            onPress={() => {
              navigate('InputNav', {screen: 'FirstInput'});
            }}>
            <UserInfoBtnText>정보변경</UserInfoBtnText>
            <RightArrow source={icons.arrowRight_20} />
          </UserInfoBtnContainer>
        </ProfileContainer>
        <RecommendationContainer>
          <Recommendation style={{fontWeight: '400'}}>
            계획보다 부족하면 아래 목표영양을 수정해보세요
          </Recommendation>
        </RecommendationContainer>
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
      <Card style={{flex: 1}}>
        {myPageBtns.map((item, index) => (
          <Col key={item.btnId}>
            <PageBtn
              onPress={() => {
                if (item.btnId === 'ChangeWeight') {
                  setAlertType('weight');
                  setAlertShow(true);
                } else {
                  navigateByBtnId[item.btnId](item.btnId, navigate);
                }
              }}>
              <Row style={{justifyContent: 'space-between'}}>
                <PageBtnText>{item.title}</PageBtnText>
                <RightArrow source={icons.arrowRight_20} />
              </Row>
            </PageBtn>
            {myPageBtns.length - 1 !== index && <HorizontalLine />}
          </Col>
        ))}
      </Card>
      <DAlert
        alertShow={alertShow}
        renderContent={() => renderAlertByType[alertType]()}
        onConfirm={onAlertConfirm}
        onCancel={onAlertCancel}
        confirmLabel="변경"
      />
    </Container>
  );
};

export default Mypage;

const Container = styled.View`
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
  background-color: ${colors.highlight};
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

const PageBtn = styled.TouchableOpacity`
  width: 100%;
  height: 58px;
  justify-content: center;
`;
const PageBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const RightArrow = styled.Image`
  width: 20px;
  height: 20px;
`;
