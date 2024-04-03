// RN
import {ViewProps} from 'react-native';

// 3rd
import DropShadow from 'react-native-drop-shadow';
import {Col} from './styledComps';
import styled from 'styled-components/native';

interface IShadowView extends ViewProps {
  opacity?: number;
}
const ShadowView = (props: IShadowView) => {
  const {opacity, ...boxProps} = props;
  return (
    <Box {...boxProps}>
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: 3,
          },
          shadowOpacity: props.opacity ? props.opacity : 0.14,
          shadowRadius: 4,
        }}>
        {props.children}
      </DropShadow>
    </Box>
  );
};

export default ShadowView;

const Box = styled.View``;
