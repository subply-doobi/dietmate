import styled from 'styled-components/native';
import {Col, HorizontalLine, Row, TextMain} from './styledComps';
import {icons} from '../iconSource';

interface IPageBtn {
  btns: {title: string; btnId: string; onPress: Function}[];
}

const ListBtns = ({btns}: IPageBtn) => {
  return (
    <>
      {btns.map((item, index) => (
        <Col key={item.btnId}>
          <Btn onPress={() => item.onPress()}>
            <Row style={{justifyContent: 'space-between'}}>
              <PageBtnText>{item.title}</PageBtnText>
              <RightArrow source={icons.arrowRight_20} />
            </Row>
          </Btn>
          {btns.length - 1 !== index && <HorizontalLine />}
        </Col>
      ))}
    </>
  );
};

export default ListBtns;

const Btn = styled.TouchableOpacity`
  width: 100%;
  height: 58px;
  justify-content: center;
`;
const PageBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const RightArrow = styled.Image`
  width: 20px;
  height: 20px;
`;
