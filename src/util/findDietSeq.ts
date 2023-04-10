import {IDietData} from '../query/types/diet';

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
