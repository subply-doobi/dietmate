import {ScrollView, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import Pinchable from 'react-native-pinchable';

// react-query
import {useListProductDetail} from '../../query/queries/product';
import {IProductData} from '../../query/types/product';
import {useEffect, useMemo, useState} from 'react';
import {SCREENWIDTH} from '../../constants/constants';
import {ActivityIndicator} from 'react-native';

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
    {imageLink: string; width: number; height: number}[]
  >([]);
  const [imgLoading, setImgLoading] = useState(true);

  // useEffect
  useEffect(() => {
    const getImageData = async () => {
      const imgData = productDetailData?.map(async item => {
        const imageLink = item.imageLink;
        let orgWidth = 0;
        let orgHeight = 0;
        await Image.getSize(imageLink, (width, height) => {
          const modWidth = SCREENWIDTH - 32;
          const modHeight = height * (modWidth / width);
          orgWidth = modWidth;
          orgHeight = modHeight;
        });
        return {
          imageLink,
          width: orgWidth,
          height: orgHeight,
        };
      });
      if (!imgData) return;
      const result = await Promise.all<
        Promise<{imageLink: string; width: number; height: number}>[]
      >(imgData);
      setImageData(result);
    };
    getImageData();
  }, [productDetailData]);

  return (
    <Pinchable minimumZoomScale={1} maximumZoomScale={2}>
      {imgLoading && <ActivityIndicator />}
      {imageData?.map((item, index) => (
        <FastImage
          key={index}
          style={{width: item.width, height: item.height}}
          source={{uri: item.imageLink}}
          onError={() => console.log('error')}
          onLoad={() => {
            if (index === imageData.length - 1) {
              setImgLoading(false);
            }
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      ))}
    </Pinchable>
  );
};

export default FoodPart;

const DetailImg = styled.Image``;
