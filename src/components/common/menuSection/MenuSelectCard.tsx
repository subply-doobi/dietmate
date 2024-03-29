import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../../app/store/reduxStore';
import {
  setCurrentDiet,
  setMenuActiveSection,
} from '../../../features/reduxSlices/commonSlice';
import {Col, Row, StyledProps} from '../../../shared/ui/styledConsts';
import colors from '../../../shared/colors';
import {getDietAddStatus} from '../../../shared/utils/getDietAddStatus';
import DAlert from '../alert/DAlert';
import CreateLimitAlertContent from '../alert/CreateLimitAlertContent';
import CommonAlertContent from '../alert/CommonAlertContent';

import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
} from '../../../shared/api/queries/diet';

const MenuSelectCard = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const createDietMutation = useCreateDiet();

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
          marginLeft: 4,
          alignItems: 'flex-end',
          columnGap: 4,
        }}>
        {dietData?.map(menu => {
          const isActivated = menu.dietNo === currentDietNo ? true : false;
          return (
            <Row key={menu.dietNo}>
              <CardBtn
                isActivated={isActivated}
                onPress={() => {
                  if (isActivated) return;
                  dispatch(setMenuActiveSection([]));
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
`;
