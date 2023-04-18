import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../../stores/store';
import {setCurrentDiet} from '../../../stores/slices/cartSlice';
import {Col, Row, StyledProps} from '../../../styles/StyledConsts';
import colors from '../../../styles/colors';
import {getDietAddStatus} from '../../../util/getDietAddStatus';
import DAlert from '../alert/DAlert';
import CreateLimitAlertContent from '../alert/CreateLimitAlertContent';
import CommonAlertContent from '../alert/CommonAlertContent';

import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
} from '../../../query/queries/diet';

const MenuSelectCard = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const createDietMutation = useCreateDiet({
    onSuccess: data => {
      dispatch(setCurrentDiet(data.dietNo));
    },
  });

  // state
  const [createAlertShow, setCreateAlertShow] = useState(false);

  // MenuSelect랑 겹치는 기능  //
  const addAlertStatus = getDietAddStatus(dietData, dietEmptyData);

  const onCreateDiet = () => {
    if (addAlertStatus === 'possible') {
      createDietMutation.mutate();
      return;
    }
    setCreateAlertShow(true);
  };

  return (
    <Col>
      {/* 끼니선택 및 추가 버튼 */}
      <Row
        style={{
          marginTop: 8,
        }}>
        {dietData?.map(menu => {
          const isActivated = menu.dietNo === currentDietNo ? true : false;
          return (
            <Row key={menu.dietNo}>
              <CardBtn
                isActivated={isActivated}
                onPress={() => {
                  dispatch(setCurrentDiet(menu.dietNo));
                }}>
                <CardText isActivated={isActivated}>{menu?.dietSeq}</CardText>
              </CardBtn>
            </Row>
          );
        })}
        <Row>
          <CardBtn onPress={() => onCreateDiet()}>
            <CardText style={{color: colors.textSub}}>+</CardText>
          </CardBtn>
        </Row>
      </Row>
      <DAlert
        alertShow={createAlertShow}
        onCancel={() => setCreateAlertShow(false)}
        onConfirm={() => {
          setCreateAlertShow(false);
        }}
        NoOfBtn={1}
        renderContent={() =>
          addAlertStatus === 'limit' ? (
            <CreateLimitAlertContent />
          ) : addAlertStatus === 'empty' ? (
            <CommonAlertContent
              text={`비어있는 끼니를\n먼저 구성하고 이용해보세요`}
            />
          ) : (
            <></>
          )
        }
      />
    </Col>
  );
};

export default MenuSelectCard;

const CardText = styled.Text`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
`;
const CardBtn = styled.TouchableOpacity`
  height: ${({isActivated}: StyledProps) => (isActivated ? '32px' : '28px')};
  width: 74px;
  justify-content: center;
  align-items: center;

  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  background-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.white : colors.inactivated};
  border-color: ${colors.white};
  margin-right: -4px;
  margin-left: 8px;
`;
