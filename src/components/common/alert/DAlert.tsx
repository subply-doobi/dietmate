import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';

import colors from '../../../shared/colors';
import {DALERT_WIDTH, SCREENWIDTH} from '../../../shared/constants';
import {Row, StyledProps, TextMain} from '../../../shared/ui/styledConsts';

interface IDAlert {
  alertShow: boolean;
  renderContent: () => React.ReactElement;
  onConfirm: Function;
  onCancel: Function;
  confirmLabel?: string;
  NoOfBtn?: 1 | 2;
}
const DAlert = ({
  alertShow,
  renderContent,
  onConfirm,
  onCancel,
  confirmLabel,
  NoOfBtn,
}: IDAlert) => {
  return alertShow != null ? (
    <Modal
      animationType="fade"
      transparent={true}
      visible={alertShow ? true : false}
      onRequestClose={() => {
        onCancel ? onCancel() : null;
      }}>
      <ModalBackGround>
        <PopUpContainer>
          <ContentContainer>{renderContent()}</ContentContainer>
          <Row>
            {NoOfBtn !== 1 && (
              <BtnLeft
                onPress={() => {
                  onCancel ? onCancel() : null;
                }}>
                <CancelBtnText>취소</CancelBtnText>
              </BtnLeft>
            )}

            <BtnRight
              onPress={() => {
                onConfirm ? onConfirm() : null;
              }}>
              <ConfirmBtnText>
                {confirmLabel ? confirmLabel : '확인'}
              </ConfirmBtnText>
            </BtnRight>
          </Row>
        </PopUpContainer>
      </ModalBackGround>
    </Modal>
  ) : null;
};

export default DAlert;

const ModalBackGround = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.backgroundModal};
`;

const PopUpContainer = styled.View`
  width: ${({width}: StyledProps) =>
    width ? `${width}px` : `${DALERT_WIDTH}px`};
  height: ${({height}: StyledProps) => (height ? `${height}px` : 'auto')};
  background-color: ${({backgroundColor}: StyledProps) =>
    backgroundColor ? backgroundColor : colors.white};
  border-radius: 10px;
`;

const ContentContainer = styled.View``;

const BtnLeft = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-top-width: 1px;
  border-right-width: 0.5px;
  border-color: ${colors.inactivated};
`;
const BtnRight = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 10px;
  border-top-width: 1px;
  border-left-width: 0.5px;
  border-color: ${colors.inactivated};
`;
const ConfirmBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.main};
`;
const CancelBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textSub};
`;
