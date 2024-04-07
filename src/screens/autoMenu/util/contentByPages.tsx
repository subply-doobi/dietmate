import {SetStateAction} from 'react';
import {IDietDetailData} from '../../../shared/api/types/diet';
import colors from '../../../shared/colors';
import Category from '../subScreens/Category';
import Company from '../subScreens/Company';
import Complete from '../subScreens/Complete';
import Price from '../subScreens/Price';
import Processing from '../subScreens/Processing';
import Select from '../subScreens/Select';
import {IProductData} from '../../../shared/api/types/product';
import Error from '../subScreens/Error';
interface IPageRender {
  dTData: IDietDetailData[];
  setProgress: React.Dispatch<React.SetStateAction<number[]>>;
  selectedDietNo: string[];
  setSelectedDietNo: React.Dispatch<SetStateAction<string[]>>;
  selectedCategory: boolean[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<boolean[]>>;
  wantedCompany: string;
  setWantedCompany: React.Dispatch<SetStateAction<string>>;
  priceSliderValue: number[];
  setPriceSliderValue: React.Dispatch<SetStateAction<number[]>>;
}

interface IPageCheckIsActive {
  selectedDietNo?: string[];
  selectedCategory?: boolean[];
}
export const PAGES = [
  {
    id: 0,
    name: 'Select',
    title: '현재 구성중인\n끼니가 있어요',
    subTitle:
      '자동구성 할 끼니를 선택해주세요\n선택된 끼니의 식품들은 초기화됩니다',
    btnColor: colors.main,
    getNextPage: () => 'Category',
    checkIsActive: ({selectedDietNo}: IPageCheckIsActive) =>
      selectedDietNo?.length === 0 ? false : true,
    render: ({dTData, selectedDietNo, setSelectedDietNo}: IPageRender) => (
      <Select
        dTData={dTData}
        selectedDietNo={selectedDietNo}
        setSelectedDietNo={setSelectedDietNo}
      />
    ),
  },
  {
    id: 1,
    name: 'Category',
    title: '원하는 식품유형을\n3가지 이상 선택해주세요',
    subTitle: '선택한 유형을 포함해 구성됩니다\n모든 유형이 포함되지는 않아요',
    btnColor: colors.main,
    getNextPage: () => 'Company',
    checkIsActive: ({selectedCategory}: IPageCheckIsActive) =>
      selectedCategory && selectedCategory.filter(v => v).length < 3
        ? false
        : true,
    render: ({selectedCategory, setSelectedCategory}: IPageRender) => (
      <Category
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    ),
  },
  {
    id: 2,
    name: 'Company',
    title: '포함하고 싶은\n식품사가 있나요?',
    subTitle: '무료 배송비를 맞추는 데에\n도움이 될 수 있어요',
    btnColor: colors.main,
    getNextPage: () => 'Price',
    checkIsActive: () => true,
    render: ({wantedCompany, setWantedCompany}: IPageRender) => (
      <Company
        wantedCompany={wantedCompany}
        setWantedCompany={setWantedCompany}
      />
    ),
  },
  {
    id: 3,
    name: 'Price',
    title: '한 끼니 가격을\n설정해주세요',
    subTitle: '목표섭취량이 높다면\n가격이 낮을 때 구성이 안될 수 있어요',
    btnColor: colors.main,
    getNextPage: () => 'Processing',
    checkIsActive: () => true,
    render: ({priceSliderValue, setPriceSliderValue}: IPageRender) => (
      <Price
        priceSliderValue={priceSliderValue}
        setPriceSliderValue={setPriceSliderValue}
      />
    ),
  },
  {
    id: 4,
    name: 'Processing',
    title: '목표영양에 딱 맞는\n식품 조합 찾는 중',
    subTitle: '조금만 기다려주세요',
    btnColor: colors.main,
    getNextPage: () => 'Error',
    checkIsActive: () => true,
    render: ({
      dTData,
      selectedDietNo,
      selectedCategory,
      wantedCompany,
      priceSliderValue,
      setProgress,
    }: IPageRender) => (
      <Processing
        dTData={dTData}
        selectedDietNo={selectedDietNo}
        selectedCategory={selectedCategory}
        wantedCompany={wantedCompany}
        priceSliderValue={priceSliderValue}
        setProgress={setProgress}
      />
    ),
  },
  {
    id: 5,
    name: 'Error',
    title: '오류가 발생했어요\n재시도 버튼을 눌러주세요',
    subTitle:
      '계속 문제가 발생한다면 처음으로 이동해\n옵션을 변경해보거나 고객센터로 문의바랍니다',
    btnColor: colors.main,
    getNextPage: () => 'None',
    checkIsActive: () => true,
    render: ({setProgress}: IPageRender) => <Error setProgress={setProgress} />,
  },
];
