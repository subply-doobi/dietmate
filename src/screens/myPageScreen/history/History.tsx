import React, {useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../../stores/store';
import colors from '../../../styles/colors';
import {SCREENWIDTH} from '../../../constants/constants';
import {changeNutrByWeight} from '../../../util/alertActions';
import {BtnBottomCTA, BtnText} from '../../../styles/styledConsts';

import DAlert from '../../../components/common/alert/DAlert';
import WeightChangeAlert from '../../../components/myPage/WeightChangeAlert';
import {useNavigation} from '@react-navigation/native';

const History = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();

  // useState
  const [alertShow, setAlertShow] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(false);

  const testArr = [
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
  ];

  const renderAlertContent = () => {
    return (
      <WeightChangeAlert
        autoCalculate={autoCalculate}
        setAutoCalculate={setAutoCalculate}
      />
    );
  };

  const onAlertConfirm = () => {
    if (autoCalculate) {
      // TBD | store, 서버에 weight, 바뀐 target정보 Put
      // dispatch(updateUserInfo(res));
    } else if (!autoCalculate) {
      // TBD | store, 서버에 weight, tmr정보만 Put
      // dispatch(updateUserInfo({tmr: res.tmr, weight: weightValue}));
    }
    setAlertShow(false);
    navigate('HistoryNav', {
      screen: 'HistoryDetail',
      params: {date: '2022.07.11'},
    });
  };

  return (
    <Container>
      <FlatList
        data={testArr}
        renderItem={({item}) => (
          <HistoryBox
            onPress={() => {
              console.log('해당 기록으로 이동');
            }}>
            {/* <HistoryImage /> */}
          </HistoryBox>
        )}
        horizontal={false}
        numColumns={3}
      />
      <BtnBottomCTA
        btnStyle="activated"
        width={SCREENWIDTH - 32}
        onPress={() => setAlertShow(true)}>
        <BtnText>기록추가</BtnText>
      </BtnBottomCTA>

      <DAlert
        alertShow={alertShow}
        onCancel={() => setAlertShow(false)}
        onConfirm={onAlertConfirm}
        renderContent={renderAlertContent}
        confirmLabel="기록추가"
      />
    </Container>
  );
};

export default History;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const HistoryBox = styled.TouchableOpacity`
  width: ${SCREENWIDTH / 3}px;
  height: ${SCREENWIDTH / 3}px;
  border-width: 1px;
  border-color: ${colors.inactivated};
`;
const HistoryImage = styled.Image`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;
