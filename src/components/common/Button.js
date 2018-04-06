import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import * as s from './styles';

export const ButtonContainer = styled.TouchableHighlight`
  padding: 10px 15px;
  border-width: 1px;
  border-color: ${props => props.black ? s.color.black : s.color.green};
  border-radius: 20px;
`;

export const ButtonText = styled.Text`
  color: ${props => props.black ? s.color.black : s.color.green};
`;

export const Button = props => (
  <ButtonContainer {...props}>
    <ButtonText {..._.omit(props, 'style')}>
      {props.children}
    </ButtonText>
  </ButtonContainer>
);
