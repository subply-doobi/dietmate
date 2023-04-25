import React from 'react';
import IMP from 'iamport-react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from './NavigationService';
import {getUserCode} from './utils';
import Loading from './Loading';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = StackScreenProps<RootStackParamList, 'Payment'>;

function Payment({route, navigation}: Props) {
  const params = route.params?.params;
  const tierCode = route.params?.tierCode;
  const userCode = getUserCode(params!.pg, tierCode);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <IMP.Payment
        userCode={'imp88778331'}
        //tierCode는 Agency사용자에 한함
        tierCode={tierCode}
        loading={<Loading />}
        data={params!}
        callback={response => navigation.replace('PaymentResult', response)}
      />
    </SafeAreaView>
  );
}

export default Payment;
