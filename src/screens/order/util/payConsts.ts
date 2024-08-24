import Config from 'react-native-config';
import colors from '../../../shared/colors';
import {icons} from '../../../shared/iconSource';

// Define the PAY_METHOD object with inferred types
export type IPG = 'kakaopay' | 'smartro';
export type IMethod = 'simple' | 'card' | 'trans' | 'vbank';

export const PAY_METHOD = [
  {
    value: 'simple',
    label: '간편결제',
    subBtn: true,
    pg: [
      {
        value: 'kakaopay',
        label: '카카오페이',
        iconSource: icons.kakaoPay,
        btnActiveBg: colors.kakaoColor,
        textColor: colors.dark,
      },
      // {
      //   value: 'naverpay',
      //   label: '네이버페이',
      //   iconSource: null,
      //   btnActiveBg: '#2DB400',
      //   textColor: colors.white,
      // },
    ],
  },
  {
    value: 'card',
    label: '카드결제',
    subBtn: false,
    pg: [
      {
        value: 'smartro',
        label: '스마트로',
        iconSource: null,
        btnActiveBg: colors.white,
        textColor: colors.dark,
      },
    ],
  },
  {
    value: 'trans',
    label: '계좌이체',
    subBtn: false,
    pg: [
      {
        value: 'smartro',
        label: '스마트로',
        iconSource: null,
        btnActiveBg: colors.white,
        textColor: colors.dark,
      },
    ],
  },
  {
    value: 'vbank',
    label: '가상계좌',
    subBtn: false,
    pg: [
      {
        value: 'smartro',
        label: '스마트로',
        iconSource: null,
        btnActiveBg: colors.white,
        textColor: colors.dark,
      },
    ],
  },
] as const;
