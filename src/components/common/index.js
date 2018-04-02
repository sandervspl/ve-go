import styled from 'styled-components';
import { bind } from 'styled-props';
import * as styles from './styles';

const s = bind(styles);

export { default as PopupTopBar } from './PopupTopBar';

export const Main = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: props => ({
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingLeft: 20,
    paddingBottom: 75,
    height: props.fullHeight ? '100%' : 'auto',
  }),
})``; // not a typo!

export const Header = styled.View`
  width: 100%;
  border-bottom-color: lightgray;
  border-bottom-width: 1px;
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
  padding-bottom: 5px;
  border-bottom-color: ${styles.color.lightgray};
  border-bottom-width: 1px;
  background-color: ${s.listItemBgColor};
`;
ListItem.defaultProps = {
  listItemBgColor: 'default',
};

export const ListItemText = styled.Text`
  padding-right: 20px;
  color: ${s.listItemTextColor};
`;
ListItemText.defaultProps = {
  listItemTextColor: 'default',
};

export const ListItemTitle = styled(ListItemText)`
  margin-top: 20px;
  font-size: 20px;
  color: ${s.listItemTitleColor};
`;
ListItemTitle.defaultProps = {
  listItemTitleColor: 'default',
};
