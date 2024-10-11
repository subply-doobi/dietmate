declare module 'react-native-config' {
  export interface NativeConfig {
    // 서버
    BASE_URL: string;
    // 요청
    AXIOS_TIMEOUT: string;
    // 아임포트결제
    API_KEY_IAMPORT: string;
    API_SECRET_IAMPORT: string;
    STORE_ID_IAMPORT: string;
    CHANNEL_KEY_KAKAOPAY: string;
    CHANNEL_KEY_KAKAOPAY_TEST: string;
    CHANNEL_KEY_SMARTRO_V2: string;
    CHANNEL_KEY_SMARTRO_V2_TEST: string;
    REDIRECT_URL_IAMPORT: string;
    APP_SCHEME_IAMPORT: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
