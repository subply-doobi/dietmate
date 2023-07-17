import React from 'react';
import {Text, SafeAreaView, StyleSheet} from 'react-native';

import {HorizontalSpace} from '../../../styles/StyledConsts';
import colors from '../../../styles/colors';

const ShippingPart = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.explain}>[두비] 서비스는 현재</Text>
      <Text style={styles.explain}>테스트 버전입니다.</Text>
      <HorizontalSpace height={10} />
      <Text style={styles.explain}>식단 주문을 원하시는 경우</Text>
      <Text style={styles.explain}>식품들을 추가하고</Text>
      <HorizontalSpace height={10} />
      <Text style={styles.explain}>장바구니에서</Text>
      <Text style={styles.explain}>주문하기 버튼을 눌러</Text>
      <HorizontalSpace height={10} />
      <Text style={styles.explain}>체험단 신청을 해주세요</Text>
      <HorizontalSpace height={20} />
    </SafeAreaView>
  );
};
export default ShippingPart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  explain: {
    fontSize: 20,
    textAlign: 'center',
  },
});
