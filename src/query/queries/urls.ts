export const BASE_URL = 'http://3.36.62.63:8080';

export const GET_TOKEN = `${BASE_URL}/api/every/token/get-token`; //토큰 조회
export const GET_AUTH = `${BASE_URL}/api/member/auth/get-auth`; //인증 여부 조회
export const RE_ISSUE_TOKEN = `${BASE_URL}/api/every/token/re-issue-token`;
export const GET_USER = `${BASE_URL}/api/member/user/get-user`; //사용자 정보 조회
export const DELETE_USER = `${BASE_URL}/api/member/user/delete-user`; //사용자 정보 삭제

// base-line-controller
export const CREATE_BASE_LINE = `${BASE_URL}/api/member/baseline/create-base-line`;
export const GET_BASE_LINE = `${BASE_URL}/api/member/baseline/get-base-line`;
export const UPDATE_BASE_LINE = `${BASE_URL}/api/member/baseline/update-base-line`;

// diet-controller
export const CREATE_DIET = `${BASE_URL}/api/member/diet/create-diet`;
export const CREATE_DIET_DETAIL = `${BASE_URL}/api/member/diet/create-diet-detail`;
export const UPDATE_DIET_DETAIL = `${BASE_URL}/api/member/diet/update-diet-detail`;
export const UPDATE_DIET = `${BASE_URL}/api/member/diet/update-diet`; //orderTable 생성
export const LIST_DIET = `${BASE_URL}/api/member/diet/list-diet`;
export const LIST_DIET_DETAIL = `${BASE_URL}/api/member/diet/list-diet-detail`;
export const LIST_DIET_DETAIL_ALL = `${BASE_URL}/api/member/diet/list-diet-detail-all`;
export const DELETE_DIET = `${BASE_URL}/api/member/diet/delete-diet`;
export const DELETE_DIET_DETAIL = `${BASE_URL}/api/member/diet/delete-diet-detail`;
export const GET_DIET_DETAIL_EMPTY_YN = `${BASE_URL}/api/member/diet/get-diet-detail-empty-yn`;

// product-controller
export const GET_PRODUCT = `${BASE_URL}/api/member/product/get-product`;
export const LIST_PRODUCT = `${BASE_URL}/api/member/product/list-product`;
export const LIST_PRODUCT_DETAIL = `${BASE_URL}/api/member/product/list-product-detail`;
export const CREATE_PRODUCT_AUTO = `${BASE_URL}/api/member/product/create-product-auto`;
export const CREATE_PRODUCT_MARK = `${BASE_URL}/api/member/product/create-product-mark`;
export const DELETE_PRODUCT_MARK = `${BASE_URL}/api/member/product/delete-product-mark`;
export const LIST_PRODUCT_MARK = `${BASE_URL}/api/member/product/list-product-mark`;
export const FILTER = `${BASE_URL}/api/member/product/get-product-filter-range`;

// api-member-code-controller
export const COMMON_CODE = `${BASE_URL}/api/member/code/list-code`;

// category-controller
export const LIST_CATEGORY = `${BASE_URL}/api/member/category/list-category/CG`;
export const LIST_CATEGORY_PRODUCT_CNT = `${BASE_URL}/api/member/category/list-category-product-cnt/CG`;

// api-member-order-controller
export const CREATE_ORDER = `${BASE_URL}/api/member/order/create-order`; //주문 정보 생성
export const UPDATE_ORDER = `${BASE_URL}/api/member/order/update-order`; //주문 정보 수정
export const LIST_ORDER = `${BASE_URL}/api/member/order/list-order`; //주문 정보 목록 조회
export const LIST_ORDER_DETAIL = `${BASE_URL}/api/member/order/list-order-detail`; //주문 정보 목록 detail 조회
export const DELETE_ORDER = `${BASE_URL}/api/member/order/delete-order`; //주문 정보 삭제

// api-member-address-controller
export const CREATE_ADDRESS = `${BASE_URL}/api/member/address/create-address`;
export const UPDATE_ADDRESS = `${BASE_URL}/api/member/address/update-address`;
export const LIST_ADDRESS = `${BASE_URL}/api/member/address/list-address`;
export const GET_ADDRESS = `${BASE_URL}/api/member/address/get-address`;
export const DELETE_ADDRESS = `${BASE_URL}/api/member/address/delete-address`;

// api-member-gusest-login
export const GET_GUEST = `${BASE_URL}/api/every/token/get-token-guest`;
