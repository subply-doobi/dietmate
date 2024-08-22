// RN

// 3rd
import styled from 'styled-components/native';
import {RootState} from '../../app/store/reduxStore';
import {useSelector} from 'react-redux';

// doobi
import {Col, Icon, Row, TextMain, TextSub} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {commaToNum, getNutrStatus, sumUpPrice} from '../../shared/utils/sumUp';
import {icons} from '../../shared/iconSource';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import MenuNumSelect from '../cart/MenuNumSelect';
import DAlert from '../../shared/ui/DAlert';
import {useState} from 'react';
import CommonAlertContent from '../common/alert/CommonAlertContent';
import {
  useDeleteDiet,
  useListDietTotalObj,
} from '../../shared/api/queries/diet';
import Config from 'react-native-config';

interface IMenuAcInactiveHeader {
  controllable?: boolean;
  dietNo: string;
  bLData: IBaseLineData;
  selected?: boolean;
  leftBarInactive?: boolean;
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const MenuAcInactiveHeader = ({
  controllable = true,
  dietNo,
  bLData,
  selected = false,
  leftBarInactive,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IMenuAcInactiveHeader) => {
  // redux
  const {totalFoodList, currentDietNo} = useSelector(
    (state: RootState) => state.common,
  );

  // useState
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dDData = dTOData?.[dietNo]?.dietDetail ?? [];
  const dietSeq = dTOData?.[dietNo]?.dietSeq ?? '';
  const deleteDietMutation = useDeleteDiet();

  // fn
  const onMenuNoSelectPress = () => {
    if (!setDietNoToNumControl || !setMenuNumSelectShow || !dTOData) return;
    setDietNoToNumControl(dietNo);
    setMenuNumSelectShow(true);
  };

  const onDietDelete = () => {
    deleteDietMutation.mutate({dietNo, currentDietNo});
    setDeleteAlertShow(false);
  };

  // etc
  const priceSum = sumUpPrice(dDData);
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const iconSource =
    nutrStatus === 'satisfied'
      ? icons.checkRoundCheckedGreen_24
      : icons.warning_24;
  const priceText = dDData.length !== 0 ? `${commaToNum(priceSum)}원` : '';
  const barColor = selected
    ? colors.main
    : leftBarInactive
      ? colors.inactivated
      : currentDietNo === dietNo
        ? colors.dark
        : colors.inactivated;
  const thumbnailBorderColor =
    nutrStatus === 'satisfied'
      ? colors.green2Opacity20
      : nutrStatus === 'exceed'
        ? colors.warningOpacity20
        : colors.lineLight;
  const currentQty = dDData.length > 0 ? parseInt(dDData[0].qty, 10) : 1;

  return (
    <Box selected={selected}>
      <LeftBar style={{backgroundColor: barColor}} />
      <Col
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}>
        <Row
          style={{
            alignItems: 'flex-end',
            columnGap: 12,
            marginLeft: 2,
          }}>
          <Title>{dietSeq}</Title>
          <SubTitle>{priceText}</SubTitle>
        </Row>

        {dDData.length === 0 ? (
          <SubTitle style={{marginTop: 4, marginLeft: 2}}>
            식품을 담아보세요
          </SubTitle>
        ) : (
          <Row
            style={{
              flex: 1,
              alignItems: 'flex-end',
              columnGap: 16,
              marginTop: 8,
            }}>
            <ThumnailBox style={{borderColor: thumbnailBorderColor}}>
              {dDData.map(p => (
                <Thumbnail
                  key={p.productNo}
                  source={{uri: `${Config.BASE_URL}${p.mainAttUrl}`}}
                />
              ))}
              {/* {(nutrStatus === 'satisfied' || nutrStatus === 'exceed') && (
                <Icon
                  size={20}
                  source={iconSource}
                  style={{position: 'absolute', right: 0, top: 0}}
                />
              )} */}
            </ThumnailBox>

            {controllable && dDData.length !== 0 && (
              <MenuNumSelect
                disabled={dDData.length === 0}
                action="openModal"
                currentQty={currentQty}
                openMenuNumSelect={onMenuNoSelectPress}
              />
            )}
          </Row>
        )}
      </Col>

      {controllable && (
        <DeleteBtn onPress={() => setDeleteAlertShow(true)}>
          <Icon source={icons.cancelRound_24} />
        </DeleteBtn>
      )}

      <DAlert
        alertShow={deleteAlertShow}
        onCancel={() => setDeleteAlertShow(false)}
        onConfirm={() => onDietDelete()}
        NoOfBtn={2}
        renderContent={() => (
          <CommonAlertContent text={`${dietSeq}\n삭제할까요`} />
        )}
      />
    </Box>
  );
};

export default MenuAcInactiveHeader;

const Box = styled.View<{
  selected?: boolean;
}>`
  background-color: ${colors.white};
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({selected}) =>
    selected ? colors.highlight : colors.inactivated};
  border-width: ${({selected}) => (selected ? '1px' : '1px')};
`;

const LeftBar = styled.View`
  left: 0;
  width: 4px;
  height: 100%;
  background-color: ${colors.inactivated};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const Title = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
`;

const SubTitle = styled(TextSub)`
  font-size: 14px;
  line-height: 18px;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const ThumnailBox = styled.View`
  flex: 1;
  height: 56px;
  background-color: ${colors.backgroundLight};
  border-width: 1px;
  border-color: ${colors.lineLight};
  border-radius: 5px;

  flex-direction: row;
  align-items: center;
  overflow: hidden;

  padding: 0 8px;
  column-gap: 4px;
`;

const Thumbnail = styled.Image`
  width: 40px;
  height: 40px;
  background-color: ${colors.backgroundLight2};
  border-radius: 4px;
`;
