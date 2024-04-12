import {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../../app/store/reduxStore';
import {
  setCartAcActive,
  setCurrentDiet,
  setHomeAcActive,
} from '../../../features/reduxSlices/commonSlice';
import {Col, Row} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {getDietAddStatus} from '../../../shared/utils/getDietAddStatus';
import DAlert from '../alert/DAlert';
import CreateLimitAlertContent from '../alert/CreateLimitAlertContent';
import CommonAlertContent from '../alert/CommonAlertContent';

import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietTotal,
} from '../../../shared/api/queries/diet';
import {getNutrStatus} from '../../../shared/utils/sumUp';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';

const MenuSelectCard = () => {
  // redux
  const {totalFoodList, currentDietNo} = useSelector(
    (state: RootState) => state.common,
  );
  const dispatch = useDispatch();

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietData} = useListDiet();
  const dietTotalData = useListDietTotal(dietData, {enabled: !!dietData});
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();

  // memo
  const {dTData, dTDataStatus} = useMemo(() => {
    const dTDataStatus =
      dietTotalData && dietTotalData.map(menu => menu.isLoading).includes(true)
        ? 'isLoading'
        : 'isSuccess';
    const dTData =
      dietTotalData && dTDataStatus === 'isSuccess'
        ? dietTotalData?.map((d, idx) => (d.data ? d.data : []))
        : undefined;

    return {
      dTDataStatus: 'isSuccess',
      dTData,
    };
  }, [dietData, dietTotalData]);

  // const createDietMutation = useCreateDiet();

  // state
  // const [createAlertShow, setCreateAlertShow] = useState(false);

  // MenuSelect랑 겹치는 기능  //
  // const addAlertStatus = getDietAddStatus(dietData, dietEmptyData);

  // const onCreateDiet = () => {
  //   if (addAlertStatus === 'possible') {
  //     createDietMutation.mutate();
  //     return;
  //   }
  //   setCreateAlertShow(true);
  // };

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
        {dietData?.map((menu, idx) => {
          const nutrStatus = getNutrStatus({
            totalFoodList,
            bLData: baseLineData,
            dDData: dTData && dTData[idx],
          });
          const isActivated = menu.dietNo === currentDietNo ? true : false;
          return (
            <Row key={menu.dietNo}>
              <CardBtn
                isActivated={isActivated}
                onPress={() => {
                  if (isActivated) return;
                  dispatch(setHomeAcActive([]));
                  dispatch(setCartAcActive([]));
                  dispatch(setCurrentDiet(menu.dietNo));
                }}>
                {(nutrStatus === 'exceed' || nutrStatus === 'satisfied') && (
                  <GuideCircle nutrStatus={nutrStatus} />
                )}
                <CardText isActivated={isActivated}>{menu?.dietSeq}</CardText>
              </CardBtn>
            </Row>
          );
        })}
        {/* <Row>
          <CardBtn onPress={() => onCreateDiet()}>
            <CardText style={{color: colors.textSub}}>+</CardText>
          </CardBtn>
        </Row> */}
      </Row>
      {/* <DAlert
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
      /> */}
    </Col>
  );
};

export default MenuSelectCard;

const CardText = styled.Text<{isActivated: boolean}>`
  font-size: 14px;
  color: ${({isActivated}) => (isActivated ? colors.textMain : colors.textSub)};
`;
const CardBtn = styled.TouchableOpacity<{isActivated: boolean}>`
  height: ${({isActivated}) => (isActivated ? '32px' : '28px')};
  width: 74px;
  justify-content: center;
  align-items: center;

  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  background-color: ${({isActivated}) =>
    isActivated ? colors.white : colors.inactivated};
  border-color: ${colors.white};
`;

const GuideCircle = styled.View<{
  nutrStatus: 'error' | 'empty' | 'satisfied' | 'notEnough' | 'exceed';
}>`
  position: absolute;
  right: 6px;
  top: 6px;
  background-color: ${({nutrStatus}) =>
    nutrStatus === 'exceed'
      ? colors.warning
      : nutrStatus === 'satisfied'
        ? colors.green
        : colors.white};
  width: 4px;
  height: 4px;
  border-radius: 3px;
`;
