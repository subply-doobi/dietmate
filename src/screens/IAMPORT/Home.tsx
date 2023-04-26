import React from 'react';
import {Button, Stack, Text, View} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from './NavigationService';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

function Home({navigation}: Props) {
  return (
    <View flex={1}>
      <View
        flex={1}
        pos={'relative'}
        alignItems={'center'}
        bgColor={'#344e81'}
        justifyContent={'center'}>
        <Text
          color={'#fff'}
          fontSize={20}
          mb={10}
          fontWeight={'bold'}
          textAlign={'center'}>
          아임포트 테스트
        </Text>
        <Text color={'#fff'} fontSize={15} textAlign={'center'}>
          아임포트 리액트 네이티브 모듈 테스트 화면입니다.
        </Text>
        <Text color={'#fff'} fontSize={15} textAlign={'center'}>
          아래 버튼을 눌러 결제 또는 본인인증 테스트를 진행해주세요.
        </Text>
      </View>
      <View
        flex={1}
        pos={'relative'}
        bottom={'0%'}
        w={'90%'}
        flexDir={'row'}
        alignSelf={'center'}>
        <Button.Group bottom={'50%'} width={'100%'} alignSelf={'center'}>
          <Button
            m={'4%'}
            bgColor={'#fff'}
            borderRadius={3}
            flex={1}
            shadow={1}
            onPress={() => navigation.push('PaymentTest')}>
            <Stack direction={'column'} alignItems={'center'}>
              {/* <FontAwesome name={'credit-card'} size={30} /> */}
              <Text fontSize={15}>결제 테스트</Text>
            </Stack>
          </Button>
        </Button.Group>
      </View>
    </View>
  );
}

export default Home;
