// RN
import {TouchableOpacity} from 'react-native';

// 3rd
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../app/store/reduxStore';
import styled from 'styled-components/native';

// doobi
import {
  HorizontalSpace,
  Icon,
  TextMain,
} from '../../../../shared/ui/styledComps';
import Accordion from 'react-native-collapsible/Accordion';

import colors from '../../../../shared/colors';
import {icons} from '../../../../shared/iconSource';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';

const TargetOptions = ({userInputState}: {userInputState: IUserInputState}) => {
  // redux
  const dispatch = useDispatch();
  const {targetOption} = userInputState;
  // accordion
  // activeSections[0] == 1 : 두비가 알아서 / 탄단지 비율 / 영양성분 직접 입력

  const CONTENT = [
    {
      title: '다이어트메이트가 계산해주세요',
      content: (
        <AccordionContentBox>
          <ContentText>
            {
              '입력해주신 정보를 바탕으로\n기초대사량과 활동대사량을 추정해\n목표 섭취량을 계산해드릴게요'
            }
          </ContentText>
        </AccordionContentBox>
      ),
    },
    {
      title: '목표 칼로리를 알고있어요',
      content: (
        <AccordionContentBox>
          <ContentText>
            {
              '목표 칼로리와 칼로리, 탄수화물, 단백질 비율을 설정해\n목표 영양을 계산해드릴게요'
            }
          </ContentText>
        </AccordionContentBox>
      ),
    },
    {
      title: '영양성분을 직접 입력할게요 (고급자)',
      content: (
        <AccordionContentBox>
          <ContentText>
            {
              '탄수화물, 단백질, 지방 양을 모두\n직접 설정이 가능하신 분들만 선택해주세요'
            }
          </ContentText>
        </AccordionContentBox>
      ),
    },
  ];

  const renderHeader = (section: any, index: number, isActive: boolean) => {
    // return section.title;
    return (
      <AccordionHeader isActive={isActive}>
        <Icon
          source={
            isActive
              ? icons.checkboxCheckedPurple_24
              : icons.checkboxCheckedGrey_24
          }
        />
        <AccordionHeaderTitle isActive={isActive}>
          {section.title}
        </AccordionHeaderTitle>
        <Icon source={isActive ? icons.arrowUpPurple_20 : icons.arrowDown_20} />
      </AccordionHeader>
    );
  };
  const renderContent = (section: any, index: number, isActive: boolean) => {
    return section.content;
  };
  const updateSections = (actives: Array<number>) => {
    dispatch(setValue({name: 'targetOption', value: actives}));
  };

  return (
    <Container>
      <Accordion
        activeSections={targetOption.value}
        sections={CONTENT}
        touchableComponent={TouchableOpacity}
        renderHeader={renderHeader}
        renderContent={renderContent}
        duration={200}
        onChange={updateSections}
        renderFooter={() => <HorizontalSpace height={20} />}
        containerStyle={{marginTop: 32}}
      />
    </Container>
  );
};

export default TargetOptions;

const Container = styled.View``;

const AccordionHeader = styled.View<{isActive: boolean}>`
  flex-direction: row;
  height: 52px;
  background-color: ${({isActive}) =>
    isActive ? colors.highlight2 : colors.white};
  border-width: ${({isActive}) => (isActive ? 0 : 1)}px;
  border-color: ${colors.inactivated};
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 8px;
`;

const AccordionHeaderTitle = styled.Text<{isActive: boolean}>`
  font-size: 16px;
  line-height: 22px;
  color: ${({isActive}) => (isActive ? colors.main : colors.textSub)};
`;

const AccordionContentBox = styled.View`
  padding: 16px 16px 24px 16px;
`;

const ContentText = styled(TextMain)`
  font-size: 12px;
`;
