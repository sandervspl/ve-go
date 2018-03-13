import React from 'react';
import PT from 'prop-types';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  padding: 15px;
  width: 100%;
  background-color: ${props => props.type === 'error' ? 'red' : 'lightblue'};
  align-items: center;
`;

const TextField = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const PopupTopBar = ({ children, type }) => (
  <Container type={type}>
    <TextField>
      {children}
    </TextField>
  </Container>
);

PopupTopBar.propTypes = {
  children: PT.string,
  type: PT.oneOf(['error', 'default']),
};

PopupTopBar.defaultProps = {
  type: 'default',
};

export default PopupTopBar;
