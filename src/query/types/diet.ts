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

export interface IDietDetailProductData extends IProductData {
  qty: string;
  dietNo: string;
  dietSeq: string;
}

export type IDietDetailData = Array<IDietDetailProductData>;
export type IDietDetailAllData = IDietDetailData;

export interface IDietDetailEmptyYnData {
  emptyYn: 'N' | 'Y';
}

export type IDietTotalData = Array<IDietDetailData>;
