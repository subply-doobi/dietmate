import {IDietData, IDietDetailData} from '../query/types/diet';

export const findDietSeq = (
  dietData: IDietData | undefined,
  dietNo: string | undefined,
) => {
  let dietSeq = '';
  let idx = 0;
  if (!dietData || !dietNo) {
    return {dietSeq, idx};
  }
  for (let i = 0; i < dietData.length; i++) {
    if (dietData[i].dietNo === dietNo) {
      dietSeq = dietData[i].dietSeq;
      idx = i;
      break;
    }
  }
  return {dietSeq, idx};
};

export const findEmptyDietSeq = (dietTotal: IDietDetailData[] | undefined) => {
  if (!dietTotal) return '';
  let emptyDietList = [];
  for (let i = 0; i < dietTotal.length; i++) {
    if (dietTotal[i].length === 0) emptyDietList.push(`끼니 ${i + 1}`);
  }

  if (emptyDietList.length === 0) return '';

  const emptyDietSeq = emptyDietList.join(', ');
  return emptyDietSeq;
};
