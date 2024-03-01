import {Image} from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

// react-query
import {useListProductDetail} from '../../query/queries/product';
import {IProductData, IProductDetailData} from '../../query/types/product';
import {useEffect, useState} from 'react';
import {SCREENWIDTH} from '../../constants/constants';
import {ActivityIndicator} from 'react-native';
import colors from '../../styles/colors';
import {TextSub} from '../../styles/styledConsts';
import {icons} from '../../assets/icons/iconSource';

interface IImageData {
  imageLink: string;
  width: number;
  height: number;
  result: string;
}

const useGetImageSize = async (
  productDetailData: IProductDetailData[],
  setImageData: React.Dispatch<React.SetStateAction<IImageData[]>>,
) => {
  let imageData: IImageData[] = [];

  for (const item of productDetailData) {
    await Image.getSize(
      // 링크
      item.imageLink,
      // success
      (width, height) => {
        const modWidth = SCREENWIDTH - 32;
        const modHeight = height * (modWidth / width);
        imageData = [
          ...imageData,
          {
            imageLink: item.imageLink,
            width: modWidth,
            height: modHeight,
            result: 'success',
          },
        ];
      },
      // error
      error => {
        console.log('getSize error', error);
        imageData = [
          ...imageData,
          {
            imageLink: item.imageLink,
            width: SCREENWIDTH - 32,
            height: 24,
            result: 'error',
          },
        ];
      },
    );
  }
  setImageData(imageData);
};
interface IFoodPart {
  productData: IProductData;
}
const FoodPart = ({productData}: IFoodPart) => {
  // react-query
  const {data: productDetailData} = useListProductDetail(
    productData?.productNo,
  );
  // useState
  const [imageData, setImageData] = useState<
    {imageLink: string; width: number; height: number; result: string}[]
  >([]);
  const [imgLoading, setImgLoading] = useState(true);

  // useEffect
  useEffect(() => {
    if (!productDetailData) return;
    useGetImageSize(productDetailData, setImageData);
    setImgLoading(false);
  }, [productDetailData]);

  return (
    <>
      {imgLoading && <ActivityIndicator color={colors.black} />}
      {imageData?.map((item, index) =>
        item.result === 'success' ? (
          <FastImage
            key={index}
            style={{width: item.width, height: item.height}}
            source={{uri: item.imageLink}}
            onError={() => console.log('fastImage onError')}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <ErrorBox>
            <ImageErrorIcon source={icons.cancelRound_24} />
            <ImageErrorMsg>이미지를 불러올 수 없습니다</ImageErrorMsg>
          </ErrorBox>
        ),
      )}
    </>
  );
};

export default FoodPart;

const ErrorBox = styled.View`
  width: 100%;
  height: 32px;
  align-self: center;
  background-color: ${colors.backgroundLight};

  border-width: 1px;
  border-color: ${colors.lineLight};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ImageErrorIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;

const ImageErrorMsg = styled(TextSub)`
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
`;

const BtnTest = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: red;
`;
