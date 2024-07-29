declare module 'react-native-config' {
  export interface NativeConfig {
    KAKAOPAY_CID: string;
    IAMPORT_USER_CODE: string;
    BASE_URL: string;
    AXIOS_TIMEOUT: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
