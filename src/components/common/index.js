import styled from 'styled-components';

export const Main = styled.View`
  flex: 1;
  background-color: #eee;
`;

export const CenterContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(CenterContainer)`
  position: relative;
  margin: 20px 0;
`;

export const Title = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
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
