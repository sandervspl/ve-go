import styled from 'styled-components';

export const Main = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: () => ({
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingLeft: 20,
    paddingBottom: 75,
  }),
})``; // not a typo!

export const Header = styled.View`
  width: 100%;
  border-bottom-color: lightgray;
  border-bottom-width: 1px;
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

export const TextButton = styled.TouchableHighlight`
  padding: 5px 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

export const List = styled.View`
  width: 100%;
`;

export const ListItem = styled.View`
  padding-bottom: 5px;
  border-bottom-color: lightgray;
  border-bottom-width: 1px;
`;

export const ListItemText = styled.Text`
  padding-right: 20px;
  color: ${props => props.light ? 'gray' : 'black'};
`;

export const ListItemTitle = styled(ListItemText)`
  margin-top: 20px;
  font-size: 20px;
  color: #47b646;
`;
