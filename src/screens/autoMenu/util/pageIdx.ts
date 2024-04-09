import {PAGES} from './contentByPages';

export const getPageIdx = (pageNm: string) =>
  PAGES.findIndex(p => p.name === pageNm);
