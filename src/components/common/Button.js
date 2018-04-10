import React from 'react';
import styled from 'styled-components';
import styledProps from 'styled-props';
import _ from 'lodash';
import theme from '../../style/theme';

const styles = {
  borderColor: {
    default: theme.color.green,
    black: theme.color.black,
  },
  background: {
    default: 'transparent',
    invert: theme.color.green,
  },
  color: {
    default: theme.color.green,
    black: theme.color.black,
    invert: theme.color.white,
  },
};

export const ButtonContainer = styled.TouchableHighlight`
  align-items: center;
  padding: 10px 15px;
  min-width: 80px;
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
