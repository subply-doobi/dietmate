import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import {NavigationProps} from '../../constants/constants';
import colors from '../../styles/colors';
import {SCREENWIDTH} from '../../constants/constants';

// 결제 완료, 구매완료 페이지
const PaymentComplete = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainText}>구매 완료!</Text>

      <Text style={styles.subText}>[두비]는 현재 테스트 버전입니다.</Text>
      <Text style={styles.explain}>
        아직 부족한점이 많지만 두비가 열심히 보완할게요
      </Text>
      <View style={styles.buttons}>
        <StyledButton
          onPress={() => {
            navigation.navigate('PaymentHistoryNav', {
              screen: 'PaymentHistory',
            });
          }}>
          <ButtonText>결제내역 바로가기</ButtonText>
        </StyledButton>
        <StyledButton
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
            });
          }}>
          <ButtonText>두비랑 식단구성 더 해보기</ButtonText>
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default PaymentComplete;

const StyledButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
  height: 50px;
  padding: 15px;
  border-width: 1px;
  border-radius: 4px;
  margin: 5px;
  border-color: ${colors.inactivated};
`;
const ButtonText = styled.Text`
  color: ${colors.textSub};
  font-size: 16px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 0,
  },
  mainText: {
    marginTop: 100,
    fontSize: 40,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 20,
    color: colors.textSub,
    marginTop: 40,
  },
  explain: {
    marginTop: 10,
    width: 200,
    fontSize: 24,
  },
  buttons: {
    position: 'absolute',
    bottom: 60,
    width: SCREENWIDTH * 0.9,
  },
});
