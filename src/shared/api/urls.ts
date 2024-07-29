// export const BASE_URL = 'http://subply.kr:8080';

import Config from 'react-native-config';

// app-version-controller
export const GET_VERSION = `${Config.BASE_URL}/api/every/app-version/get-app-version`;

// guest-controller
export const GET_GUEST_YN = `${Config.BASE_URL}/api/every/guest/get-guest-yn`;

// user-token-contoller
export const GET_TOKEN = `${Config.BASE_URL}/api/every/token/get-token`; //토큰 조회
export const GET_GUEST = `${Config.BASE_URL}/api/every/token/get-token-guest`;
export const GET_AUTH = `${Config.BASE_URL}/api/member/auth/get-auth`; //인증 여부 조회
export const RE_ISSUE_TOKEN = `${Config.BASE_URL}/api/every/token/re-issue-token`;
export const GET_USER = `${Config.BASE_URL}/api/member/user/get-user`; //사용자 정보 조회
export const DELETE_USER = `${Config.BASE_URL}/api/member/user/delete-user`; //사용자 정보 삭제

// base-line-controller
export const CREATE_BASE_LINE = `${Config.BASE_URL}/api/member/baseline/create-base-line`;
export const GET_BASE_LINE = `${Config.BASE_URL}/api/member/baseline/get-base-line`;
export const UPDATE_BASE_LINE = `${Config.BASE_URL}/api/member/baseline/update-base-line`;

// diet-controller
export const CREATE_DIET = `${Config.BASE_URL}/api/member/diet/create-diet`;
export const CREATE_DIET_CNT = `${Config.BASE_URL}/api/member/diet/create-diet-cnt`;
export const CREATE_DIET_DETAIL = `${Config.BASE_URL}/api/member/diet/create-diet-detail`;
export const UPDATE_DIET_DETAIL = `${Config.BASE_URL}/api/member/diet/update-diet-detail`;
export const UPDATE_DIET = `${Config.BASE_URL}/api/member/diet/update-diet`; //orderTable 생성
export const LIST_DIET = `${Config.BASE_URL}/api/member/diet/list-diet`;
export const LIST_DIET_DETAIL_ALL = `${Config.BASE_URL}/api/member/diet/list-diet-detail-all`;
export const DELETE_DIET = `${Config.BASE_URL}/api/member/diet/delete-diet`;
export const DELETE_DIET_ALL = `${Config.BASE_URL}/api/member/diet/delete-diet-all`;
export const DELETE_DIET_DETAIL = `${Config.BASE_URL}/api/member/diet/delete-diet-detail`;
export const GET_DIET_DETAIL_EMPTY_YN = `${Config.BASE_URL}/api/member/diet/get-diet-detail-empty-yn`;

// product-controller
export const GET_PRODUCT = `${Config.BASE_URL}/api/member/product/get-product`;
export const LIST_PRODUCT = `${Config.BASE_URL}/api/member/product/list-product`;
export const LIST_PRODUCT_DETAIL = `${Config.BASE_URL}/api/member/product/list-product-detail`;
export const CREATE_PRODUCT_AUTO = `${Config.BASE_URL}/api/member/product/create-product-auto`;
export const CREATE_PRODUCT_MARK = `${Config.BASE_URL}/api/member/product/create-product-mark`;
export const DELETE_PRODUCT_MARK = `${Config.BASE_URL}/api/member/product/delete-product-mark`;
export const LIST_PRODUCT_MARK = `${Config.BASE_URL}/api/member/product/list-product-mark`;
// export const FILTER = `${Config.BASE_URL}/api/member/product/get-product-filter-range`;

// code-controller
export const LIST_CODE = `${Config.BASE_URL}/api/member/code/list-code`;

// category-controller
export const LIST_CATEGORY = `${Config.BASE_URL}/api/member/category/list-category/CG`;
export const LIST_CATEGORY_PRODUCT_CNT = `${Config.BASE_URL}/api/member/category/list-category-product-cnt/CG`;

// order-controller
export const CREATE_ORDER = `${Config.BASE_URL}/api/member/order/create-order`; //주문 정보 생성
export const UPDATE_ORDER = `${Config.BASE_URL}/api/member/order/update-order`; //주문 정보 수정
export const LIST_ORDER = `${Config.BASE_URL}/api/member/order/list-order`; //주문 정보 목록 조회
export const LIST_ORDER_DETAIL = `${Config.BASE_URL}/api/member/order/list-order-detail`; //주문 정보 목록 detail 조회
export const DELETE_ORDER = `${Config.BASE_URL}/api/member/order/delete-order`; //주문 정보 삭제

// address-controller
export const CREATE_ADDRESS = `${Config.BASE_URL}/api/member/address/create-address`;
export const UPDATE_ADDRESS = `${Config.BASE_URL}/api/member/address/update-address`;
export const LIST_ADDRESS = `${Config.BASE_URL}/api/member/address/list-address`;
export const GET_ADDRESS = `${Config.BASE_URL}/api/member/address/get-address`;
export const DELETE_ADDRESS = `${Config.BASE_URL}/api/member/address/delete-address`;

// suggest-controller
export const GET_SUGGEST_USER_EXIST_YN = `${Config.BASE_URL}/api/member/suggest/get-suggest-user-exist-yn`;
export const GET_SUGGEST_USER = `${Config.BASE_URL}/api/member/suggest/get-suggest-user-data`;
export const CREATE_SUGGEST_USER = `${Config.BASE_URL}/api/member/suggest/create-suggest-user`;
export const UPDATE_SUGGEST_USER = `${Config.BASE_URL}/api/member/suggest/update-suggest-user`;
