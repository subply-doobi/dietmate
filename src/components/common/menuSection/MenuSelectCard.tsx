import {SetStateAction, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../../app/store/reduxStore';
import {
  setCurrentDiet,
  setMenuAcActive,
} from '../../../features/reduxSlices/commonSlice';
import {Col, Row} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {getAddDietStatusFrDTData} from '../../../shared/utils/getDietAddStatus';
import DAlert from '../../../shared/ui/DAlert';
import CommonAlertContent from '../alert/CommonAlertContent';

import {
  useCreateDiet,
  useListDietTotalObj,
} from '../../../shared/api/queries/diet';
import {getNutrStatus} from '../../../shared/utils/sumUp';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';

interface IMenuSelectCard {
  isCreating: boolean;
  setIsCreating: React.Dispatch<SetStateAction<boolean>>;
}
const MenuSelectCard = ({isCreating, setIsCreating}: IMenuSelectCard) => {
  // redux
  const {totalFoodList, currentDietNo} = useSelector(
    (state: RootState) => state.common,
  );
  const dispatch = useDispatch();

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dTOData, isFetching: isDTOFetching} = useListDietTotalObj();
  const createDietMutation = useCreateDiet();

  // state
  const [createErrShow, setCreateErrShow] = useState(false);

  // etc
  const {status: dietAddStatus, text: dietErrText} =
    getAddDietStatusFrDTData(dTOData);

  // fn
  const onCreateDiet = async () => {
    if (dietAddStatus === 'possible') {
      setIsCreating(true);
      const res = await createDietMutation.mutateAsync({setDietNo: true});
      setIsCreating(false);
      return;
    }
    setCreateErrShow(true);
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
        {dTOData &&
          Object.keys(dTOData).map((dietNo, idx) => {
            const nutrStatus = getNutrStatus({
              totalFoodList,
              bLData: baseLineData,
              dDData: dTOData[dietNo].dietDetail,
            });
            const isActivated = dietNo === currentDietNo ? true : false;
            return (
              <Row key={dietNo}>
                <CardBtn
                  isActivated={isActivated}
                  onPress={() => {
                    if (isActivated) return;
                    dispatch(setMenuAcActive([]));
                    dispatch(setCurrentDiet(dietNo));
                  }}>
                  {(nutrStatus === 'exceed' || nutrStatus === 'satisfied') && (
                    <GuideCircle nutrStatus={nutrStatus} />
                  )}
                  <CardText
                    isActivated={isActivated}>{`끼니 ${idx + 1}`}</CardText>
                </CardBtn>
              </Row>
            );
          })}
        <Row>
          <CardBtn
            disabled={isCreating || isDTOFetching}
            onPress={async () => onCreateDiet()}>
            <CardText style={{color: colors.textSub}}>+</CardText>
          </CardBtn>
        </Row>
      </Row>
      <DAlert
        alertShow={createErrShow}
        onCancel={() => setCreateErrShow(false)}
        onConfirm={() => {
          setCreateErrShow(false);
        }}
        NoOfBtn={1}
        renderContent={() => <CommonAlertContent text={dietErrText} />}
      />
    </Col>
  );
};

export default MenuSelectCard;

const CardText = styled.Text<{isActivated?: boolean}>`
  font-size: 14px;
  color: ${({isActivated}) => (isActivated ? colors.textMain : colors.textSub)};
`;
const CardBtn = styled.TouchableOpacity<{isActivated?: boolean}>`
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
