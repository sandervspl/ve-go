import styled from 'styled-components';

export const Main = styled.View`
  flex: 1;
  background-color: #eee;
`;

export const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  margin: 70px 0 0;
  padding-left: 20px;
`;

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
