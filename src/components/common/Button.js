import React from 'react';
import styled from 'styled-components';
import * as styles from './styles';

export const ButtonContainer = styled.TouchableHighlight`
  padding: 10px 15px;
  border: 1px solid ${styles.color.green};
  border-radius: 20px;
`;

export const ButtonText = styled.Text`
  color: ${styles.color.green};
`;

export const Button = props => (
  <ButtonContainer {...props}>
    <ButtonText>
      {props.children}
    </ButtonText>
  </ButtonContainer>
);
