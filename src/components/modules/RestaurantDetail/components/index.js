import styled from 'styled-components';
import { LinearGradient } from 'expo';
import * as s from '../../../common/styles';

export { RatingCircle } from './RatingCircle';

export const BigImageHeaderContainer = styled.View`
  width: 100%;
  height: ${0.45 * 667}px;
  overflow: visible;
`;

export const InnerImageContainer = styled.View`
  height: ${0.35 * 667}px;
`;

export const BigImage = styled.Image`
  width: 100%;
  height: auto;
`;

export const BigImageGradient = styled(LinearGradient)`
  width: 100%;
  height: 150px;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
`;

export const RatingCircleText = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 110px;
  top: ${props => props.circle.y - props.circle.radius + 10};
  width: ${props => props.circle.radius}px;
  height: ${props => props.circle.radius}px;
`;

export const RatingCircleBottomContainer = styled.View`
  position: absolute;
  bottom: 0;
  padding-left: 20px;
  width: 100%;
`;

export const RatingCircleNameContainer = styled.View`
  bottom: 40px;
  padding-right: 50px;
`;

export const RatingCircleName = styled.Text`
  font-size: 30px;
  font-weight: bold;
`;

export const ButtonsContainer = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  bottom: 20px;
`;
