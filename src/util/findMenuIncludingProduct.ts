import {UseQueryResult} from '@tanstack/react-query/build/lib/types';
import {IDietData, IDietDetailData, IDietTotalData} from '../query/types/diet';

export const findMenuIncludingSeller = (
  dietData: IDietData,
  dietTotalData: UseQueryResult<IDietDetailData, unknown>[],
  seller: string,
) => {
  interface IMenu {
    dietSeq: string;
    idx: number;
  }
  let includingMenu: IMenu[] = [];
  dietTotalData?.forEach((menu, idx) => {
    let isIncluded = false;
    menu.data?.forEach(food => {
      if (food.platformNm === seller) {
        isIncluded = true;
      }
    });
    if (isIncluded) {
      includingMenu.push({dietSeq: dietData[idx].dietSeq, idx});
    }
  });

  return includingMenu;
};
