import React, {useState} from 'react';
import {TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {icons} from '../../assets/icons/iconSource';
import {
  useCreateDiet,
  useDeleteDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
} from '../../query/queries/diet';
import {setCurrentDietNo} from '../../stores/slices/cartSlice';
import {RootState} from '../../stores/store';
import colors from '../../styles/colors';
import {Col, HorizontalLine, TextMain} from '../../styles/styledConsts';
import {findDietSeq} from '../../util/findDietSeq';
import {getDietAddStatus} from '../../util/getDietAddStatus';
import CreateLimitAlertContent from './alert/CreateLimitAlertContent';
import DAlert from './alert/DAlert';
import DeleteAlertContent from './alert/DeleteAlertContent';
import MenuEmptyAlertContent from './alert/MenuEmptyAlertContent';

interface IMenuSelect {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  center?: boolean;
}
const MenuSelect = ({setOpen, center}: IMenuSelect) => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const createDietMutation = useCreateDiet();
  const deleteDietMutation = useDeleteDiet();

  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [createAlertShow, setCreateAlertShow] = useState(false);
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();

  // BottomMenuSelect랑 겹치는 기능
  const addAlertStatus = getDietAddStatus(dietData, dietEmptyData);

  const onCreateDiet = () => {
    if (addAlertStatus === 'possible') {
      createDietMutation.mutate();
      setOpen(false);
      return;
    }

    setCreateAlertShow(true);
  };

  const onDeleteDiet = () => {
    if (!dietData) {
      return;
    }
    dietNoToDelete && deleteDietMutation.mutate({dietNo: dietNoToDelete});
    setOpen(false);
    setDeleteAlertShow(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <SelectContainer center={center}>
        {dietData?.map(menu => (
          <Col key={menu.dietNo}>
            <Menu
              onPress={() => {
                dispatch(setCurrentDietNo(menu.dietNo));
                setOpen(false);
              }}>
              <MenuText isActivated={menu.dietNo === currentDietNo}>
                {menu.dietSeq}
              </MenuText>
              {dietData.length === 1 || (
                <DeleteBtn
                  onPress={() => {
                    setDietNoToDelete(menu.dietNo);
                    setDeleteAlertShow(true);
                  }}>
                  <DeleteImg source={icons.cancelRound_24} />
                </DeleteBtn>
              )}
            </Menu>
            <HorizontalLine />
          </Col>
        ))}

        <Menu onPress={onCreateDiet}>
          <MenuText>끼니 추가하기</MenuText>
        </Menu>

        <DAlert
          alertShow={deleteAlertShow}
          renderContent={() => (
            <DeleteAlertContent
              deleteText={dietData ? findDietSeq(dietData, dietNoToDelete) : ''}
            />
          )}
          onConfirm={() => onDeleteDiet()}
          onCancel={() => setDeleteAlertShow(false)}
        />
        <DAlert
          alertShow={createAlertShow}
          renderContent={() =>
            addAlertStatus === 'limit' ? (
              <CreateLimitAlertContent />
            ) : addAlertStatus === 'empty' ? (
              <MenuEmptyAlertContent />
            ) : (
              <></>
            )
          }
          onConfirm={() => {
            setCreateAlertShow(false);
          }}
          onCancel={() => setCreateAlertShow(false)}
          NoOfBtn={1}
        />
      </SelectContainer>
    </TouchableWithoutFeedback>
  );
};

export default MenuSelect;

const SelectContainer = styled.View`
  position: absolute;
  top: 48px;
  left: ${({center}: {center?: boolean}) => (center ? `32%` : `16px`)};
  width: 144px;
  background-color: ${colors.white};
  border-radius: 3px;
  border-width: 1px;
  border-color: ${colors.inactivated};
`;
const Menu = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  height: 48px;
  align-items: center;
  justify-content: center;
`;
const MenuText = styled.Text`
  font-size: 16px;
  color: ${({isActivated}: {isActivated?: boolean}) =>
    isActivated ? colors.main : colors.textMain};
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
`;

const DeleteImg = styled.Image`
  width: 24px;
  height: 24px;
`;
