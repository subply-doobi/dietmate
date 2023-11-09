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
import {icons} from '../../assets/icons/iconSource';
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
  const [test, setTest] = useState('');
  // useEffect
  useEffect(() => {
    const getImageData = async () => {
      const imgData = productDetailData?.map(item => {
        const imageLink = item.imageLink;
        let modWidth = 0;
        let modHeight = 0;
        // const modWidth = SCREENWIDTH - 32;
        // const modHeight = height * (modWidth / width);
        return new Promise((resolve, reject) => {
          Image.getSize(imageLink, (width, height) => {
            resolve({
              imageLink,
              width: SCREENWIDTH - 32,
              height: height * ((SCREENWIDTH - 32) / width),
            });
          });
        });
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
    <>
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
          onLoadEnd={() => console.log('FoodPart: onLoadEnd')}
        />
      ))}
    </>
  );
};

export default FoodPart;

const BtnImage = styled.Image`
  width: 300px;
  height: 300px;
`;
