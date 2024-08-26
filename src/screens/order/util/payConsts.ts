import Config from 'react-native-config';
import colors from '../../../shared/colors';
import {icons} from '../../../shared/iconSource';

// Define the PAY_METHOD object with inferred types
export type IPG = 'kakaopay' | 'smartro' | 'smartro_v2';
export type IPayMethod = 'simple' | 'card' | 'trans' | 'vbank';

export const PGString: {[pg in IPG]: string} = {
  kakaopay: `kakaopay.${Config.KAKAOPAY_CID}`,
  smartro: `smartro.${Config.SMARTRO_MID}`,
  smartro_v2: `smartro_v2.${Config.SMARTRO_MID}`,
};

const commonPG = 'smartro';
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
        iconSize: 40,
        btnActiveBg: colors.kakaoColor,
        textColor: colors.dark,
      },
      // {
      //   value: 'naverpay',
      //   label: '네이버페이',
      //   iconSource: icons.naverPay,
      //   iconSize: 24,
      //   btnActiveBg: colors.naverColor,
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
        value: commonPG,
        label: '스마트로',
        iconSource: null,
        iconSize: 24,
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
        value: commonPG,
        label: '스마트로',
        iconSource: null,
        iconSize: 24,
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
        value: commonPG,
        label: '스마트로',
        iconSource: null,
        iconSize: 24,
        btnActiveBg: colors.white,
        textColor: colors.dark,
      },
    ],
  },
] as const;
