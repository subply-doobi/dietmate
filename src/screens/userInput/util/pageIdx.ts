import {PAGES} from './contentBypages';

export const getPageIdx = (pageNm: string) =>
  PAGES.findIndex(p => p.name === pageNm);

export const getPageItem = (pageNm: string) =>
  PAGES.find(p => p.name === pageNm) || PAGES[0];
