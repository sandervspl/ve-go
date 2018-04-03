import styled from 'styled-components';
import * as s from '../../../common/styles';

export const BigImageHeaderContainer = styled.View`
  width: 100%;
  height: ${0.47 * 667}px;
  overflow: visible;
`;

export const InnerImageContainer = styled.View`
  height: ${0.35 * 667}px;
`;

export const BigImage = styled.Image`
  width: 100%;
  height: auto;
`;

const collageSize = 150;
export const CollageContainer = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  position: absolute;
  top: ${(0.35 * 667) - (collageSize / 2)}px;
  left: ${(375 / 2) - (collageSize / 2)}px;
  z-index: 2;
  width: ${collageSize}px;
  height: ${collageSize}px;
  background-color: ${s.color.green};
`;

export const CollageBlock = styled.View`
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 50%;
  height: 50%;
  ${props => props.right && 'border-right-width: 1px'};
  ${props => props.right && 'border-right-color: rgba(255, 255, 255, .3)'};
  ${props => props.bottom && 'border-bottom-width: 1px'};
  ${props => props.bottom && 'border-bottom-color: rgba(255, 255, 255, .3)'};
`;

export const CollageText = styled.Text`
  color: ${s.color.white};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
