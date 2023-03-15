import {IProductData} from './product';

export interface IMenu {
  companyCd: string;
  dietNo: string;
  dietSeq: string;
  statusCd: string;
  statusNm: string;
  userId: string;
}
export type IDietData = Array<IMenu>;

export interface IListDietDetailParams {
  dietNo: string;
}

interface IDietDetailProductData extends IProductData {
  qty: string;
}

export type IDietDetailData = Array<IDietDetailProductData>;

export interface IDietDetailEmptyYnData {
  emptyYn: 'N' | 'Y';
}
