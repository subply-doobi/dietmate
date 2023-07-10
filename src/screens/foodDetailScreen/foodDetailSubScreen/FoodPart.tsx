import {ScrollView, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import Pinchable from 'react-native-pinchable';

// react-query
import {useGetProduct} from '../../../query/queries/product';
import {IProductData} from '../../../query/types/product';
import {BASE_URL} from '../../../query/queries/urls';
import {useEffect, useState} from 'react';
import {SCREENWIDTH} from '../../../constants/constants';
import {ActivityIndicator} from 'react-native';

interface IFoodPart {
  productData: IProductData;
}
const FoodPart = ({productData}: IFoodPart) => {
  // useState
  const [imgDimension, setImgDimension] = useState({width: 0, height: 0});
  const [imgLoading, setImgLoading] = useState(true);
  const imgUrl = `${BASE_URL}${productData.subAttUrl}`;

  useEffect(() => {
    console.log('useEffect!!');
    Image.getSize(imgUrl, (width, height) => {
      console.log('width, height: ', width, height);
      const swWithPadding = SCREENWIDTH - 32;
      const newWidth = swWithPadding;
      const newHeight = height * (newWidth / width);
      console.log('newDim: ', newWidth, newHeight);
      setImgDimension({
        width: newWidth,
        height: newHeight,
      });
    });
  }, [productData]);

  console.log(imgDimension, imgLoading);
  return (
    <Pinchable minimumZoomScale={1} maximumZoomScale={2}>
      {imgLoading && <ActivityIndicator />}
      <FastImage
        style={{...imgDimension}}
        source={{uri: imgUrl}}
        onError={() => console.log('error')}
        onLoad={() => setImgLoading(false)}
        resizeMode={FastImage.resizeMode.contain}
      />
    </Pinchable>
  );
};

export default FoodPart;

const DetailImg = styled.Image``;
