import React from 'react';
import styled from 'styled-components';
import styledProps from 'styled-props';
import _ from 'lodash';
import * as s from './styles';

const styles = {
  borderColor: {
    default: s.color.green,
    black: s.color.black,
  },
  background: {
    default: 'transparent',
    invert: s.color.green,
  },
  color: {
    default: s.color.green,
    black: s.color.black,
    invert: s.color.white,
  },
};

export const ButtonContainer = styled.TouchableHighlight`
  padding: 10px 15px;
  border-width: 1px;
  border-color: ${styledProps(styles.borderColor, 'border-color')};
  background-color: ${styledProps(styles.background, 'background')};
  border-radius: 20px;
`;
ButtonContainer.defaultProps = {
  'border-color': 'default',
  background: 'default',
};

export const ButtonText = styled.Text`
  color: ${styledProps(styles.color, 'color')};
`;
ButtonText.defaultProps = {
  color: 'default',
};

export const Button = props => (
  <ButtonContainer {...props}>
    <ButtonText {..._.omit(props, 'style')}>
      {props.children}
    </ButtonText>
  </ButtonContainer>
);
