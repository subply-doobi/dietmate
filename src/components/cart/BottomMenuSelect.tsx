import React, {useState} from 'react';
import {
  BtnSmall,
  BtnSmallText,
  Col,
  Row,
  VerticalSpace,
} from '../../styles/styledConsts';
import {IDietData} from '../../query/types/diet';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {setCurrentDietNo} from '../../stores/slices/cartSlice';
import {
  useCreateDiet,
  useCreateDietDetail,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietDetail,
} from '../../query/queries/diet';
import DAlert from '../common/alert/DAlert';
import CreateLimitAlertContent from '../common/alert/CreateLimitAlertContent';
import colors from '../../styles/colors';
import {checkEmptyMenuIndex} from '../../util/checkEmptyMenu';
import MenuEmptyAlertContent from '../common/alert/MenuEmptyAlertContent';

const BottomMenuSelect = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const createDietMutation = useCreateDiet({
    onSuccess: data => {
      dispatch(setCurrentDietNo(data.dietNo));
    },
  });
  // const createDietDetailMutation = useCreateDietDetail();

  // state
  const [createAlertShow, setCreateAlertShow] = useState(false);

  // TBD | MenuSelect랑 겹치는 기능  //
  const NoOfDiet = dietData?.length;
  const addAlertStatus =
    NoOfDiet === undefined
      ? 'noData'
      : NoOfDiet >= 3
      ? 'limit'
      : dietEmptyData?.emptyYn === 'Y'
      ? 'empty'
      : 'possible';

  const onCreateDiet = () => {
    if (addAlertStatus === 'possible') {
      createDietMutation.mutate();
      // TBD | 여기서 빈 끼니 있는지도 확인
      return;
    }
    setCreateAlertShow(true);
  };

  return (
    <Col>
      {/* 끼니선택 및 추가 버튼 */}
      <Row
        style={{
          width: '100%',
          flexWrap: 'wrap',
          marginTop: 16,
        }}>
        {dietData?.map((menu, index) => {
          const isActivated = menu.dietNo === currentDietNo ? true : false;
          return (
            <Row key={menu.dietNo}>
              <BtnSmall
                isActivated={isActivated}
                style={{marginBottom: 8}}
                onPress={() => {
                  dispatch(setCurrentDietNo(menu.dietNo));
                }}>
                <BtnSmallText isActivated={isActivated}>
                  {menu?.dietSeq}
                </BtnSmallText>
              </BtnSmall>
              <VerticalSpace width={8} />
            </Row>
          );
        })}
        <Row>
          <BtnSmall style={{marginBottom: 8}} onPress={() => onCreateDiet()}>
            <BtnSmallText style={{color: colors.inactivated}}>+</BtnSmallText>
          </BtnSmall>
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
            <MenuEmptyAlertContent />
          ) : (
            <></>
          )
        }
      />
    </Col>
  );
};

export default BottomMenuSelect;
