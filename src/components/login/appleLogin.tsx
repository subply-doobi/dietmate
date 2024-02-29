// App.js

import React from 'react';
import {View} from 'react-native';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import styled from 'styled-components/native';
import {BtnCTA, BtnText} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {kakaoLogin, validateToken, guestLogin} from '../../query/queries/token';

// doobi util, redux, etc
import {navigateByUserInfo} from '../../util/login/navigateByUserInfo';
//react-query
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useNavigation} from '@react-navigation/native';

function AppleLogin() {
  const {refetch} = useGetBaseLine({enabled: false});
  const navigation = useNavigation();

  //check apple login & navigate screen
  const signInWithApple = async (): Promise<void> => {
    const GLdata = await guestLogin();
    if (GLdata === undefined) return;
    const baseLineData = await refetch().then(res => res.data);
    baseLineData && navigateByUserInfo(baseLineData, navigation);
  };

  //loginScreen에서 apple login 버튼 누르면 실행되는 함수
  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
      console.log('credentialState', credentialState);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      signInWithApple();
    }
  }
  return (
    <View>
      <AppleButton
        style={{
          width: '100%', // You must specify a width
          height: 50, // You must specify a height
          marginTop: 20,
        }}
        onPress={() => {
          onAppleButtonPress();
        }}
      />
    </View>
  );
}

export default AppleLogin;
