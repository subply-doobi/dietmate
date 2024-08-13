declare module 'react-native-config' {
  export interface NativeConfig {
    // 서버
    BASE_URL: string;
    // 요청
    AXIOS_TIMEOUT: string;
    // 아임포트
    IAMPORT_USER_CODE: string;
    IAMPORT_API_KEY: string;
    IAMPORT_API_SECRET: string;
    KAKAOPAY_CID: string;
    SMARTRO_MID: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
