import {PAGES} from './contentBypages';

export const getPageIdx = (pageNm: string) =>
  PAGES.findIndex(p => p.name === pageNm);
