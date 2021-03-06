import styled from 'styled-components';
import { bind } from 'styled-props';
import * as styles from './styles';

const s = bind(styles);

export { PopupTopBar } from './PopupTopBar';
export { Button } from './Button';
export { RestaurantListItem } from './RestaurantListItem';

export const MainView = styled.SafeAreaView`
  min-height: 100%;
  background-color: ${props => props.theme.color.white};
  ${props => props.height && `height: ${props.height}`};
`;

export const FlexView = styled.View`
  flex: 1;
  ${props => props.padding && `${props.padding}px`};
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.color.white};
`;

export const PaddedView = styled.View`
  padding: 0 20px;
  width: 100%;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: ({ theme, fullHeight }) => ({
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingBottom: 75,
    height: fullHeight ? '100%' : 'auto',
    backgroundColor: theme.color.white,
  }),
})``; // not a typo!

export const ContainerWithBorder = styled.View`
  ${props => props.paddingBottom};
  border-bottom-color: ${props => props.theme.color.lightgray};
  border-bottom-width: 1px;
`;

export const Header = styled.View`
  margin-left: 20px;
  width: 100%;
`;

export const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.noFullHeight ? 'auto' : '100%'};
  ${props => props.spaced && 'margin: 20px 0'};
`;

export const HugeTitle = styled.Text`
  margin-bottom: 10px;
  font-size: 40px;
  font-weight: bold;
`;

export const BigTitle = styled(HugeTitle)`
  font-size: 30px;
`;

export const Title = styled.Text`
  ${props => !props.noMargin && 'margin-top: 20px'};
  font-size: 20px;
`;

export const SmallTitle = styled(HugeTitle)`
  font-size: 16px;
`;

export const Error = styled.View`
  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
  width: 100%;
`;

export const List = styled.View`
  width: 100%;
`;

export const ListItem = styled.View`
  padding-left: 20px;
  background-color: ${s.listItemBgColor};
`;
ListItem.defaultProps = {
  listItemBgColor: 'default',
  listItemBorderColor: 'default',
};

export const ListItemText = styled.Text`
  padding-right: 20px;
  color: ${s.listItemTextColor};
`;
ListItemText.defaultProps = {
  listItemTextColor: 'default',
};

export const ListItemTitle = styled(ListItemText)`
  margin: 10px 0 5px;
  font-size: 20px;
  color: ${s.listItemTitleColor};
`;
ListItemTitle.defaultProps = {
  listItemTitleColor: 'default',
};

export const TextInput = styled.TextInput`
  padding: 0 10px;
  width: 100%;
  height: 40px;
  background-color: ${props => props.theme.color.lightestGray};
  border-radius: 10px;
`;

export const Emoji = styled.Text`
  font-size: 60px;
`;
