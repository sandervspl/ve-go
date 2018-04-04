import styled from 'styled-components';
import { bind } from 'styled-props';
import * as styles from './styles';

const s = bind(styles);

export { PopupTopBar } from './PopupTopBar';
export { Button } from './Button';

export const MainView = styled.View`
  background-color: ${styles.color.white};
  ${props => props.height && `height: ${props.height}`};
`;

export const FlexView = styled.View`
  flex: 1;
  ${props => props.padding && `${props.padding}px`};
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: props => ({
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingBottom: 75,
    height: props.fullHeight ? '100%' : 'auto',
    backgroundColor: '#FFFFFF',
  }),
})``; // not a typo!

export const ContainerWithBorder = styled.View`
  margin-left: 20px;
  padding-bottom: ${props => props.paddingBottom ? props.paddingBottom : 0};
  border-bottom-color: lightgray;
  border-bottom-width: 1px;
`;

export const Header = styled.View`
  width: 100%;
`;

export const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const HugeTitle = styled.Text`
  margin-bottom: 10px;
  font-size: 40px;
  font-weight: bold;
`;

export const BigTitle = styled(HugeTitle)`
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: bold;
`;

export const Title = styled.Text`
  margin-top: 20px;
  font-size: 20px;
`;

export const ErrorText = styled.Text`
  margin-top: 10px;
  color: red;
`;

export const List = styled.View`
  width: 100%;
`;

export const ListItem = styled.View`
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
