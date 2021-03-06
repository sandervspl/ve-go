import styled from 'styled-components';
import { LinearGradient } from 'expo';
import * as c from '../../../common';

export { RatingCircleContainer } from './RatingCircleContainer';
export { Reviews } from './Reviews';
export { Review } from './Review';
export { VenueDetails } from './VenueDetails';
export { OpenTimeText } from './OpenTimeText';
export { ContactButtons } from './ContactButtons';
export { RatingText } from './RatingText';
export { RatingCircle } from './RatingCircle';

export const BigImageHeaderContainer = styled.View`
  width: 100%;
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
  top: ${props => props.circle.y - props.circle.radius};
  width: ${props => props.circle.radius}px;
  height: ${props => props.circle.radius}px;
`;

export const RatingCircleRatingText = styled.Text`
  width: ${props => props.circle.radius * 2}px;
  text-align: center;
  font-size: 55px;
`;

export const RatingIconContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: -${props => props.circle.radius - 35}px;
  width: ${props => props.circle.radius * 2}px;
  height: ${props => props.circle.radius * 2}px;
`;

export const RatingCircleBottomContainer = styled.View`
  position: absolute;
  bottom: 0;
  padding-left: 20px;
  width: 100%;
`;

export const CircleTextContainer = styled.View`
  bottom: 35px;
  padding-right: 50px;
`;

export const CircleText = styled.Text`
  height: ${props => props.small ? 20 : 'auto'}; 
  color: ${({ theme, small }) => small ? theme.color.darkGray : theme.color.black};
  font-size: ${props => props.small ? 17 : 30}px;
  ${props => props.bold && 'font-weight: bold'};
`;

export const ButtonsContainer = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  bottom: 20px;
  min-height: 38px;
`;

export const DetailButton = styled(c.Button)`
  margin-right: ${props => !props.last ? 5 : 0}px;
`;

export const IconText = styled.Text`
  margin-left: 5px;
`;

export const ContentContainer = styled.View`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
`;

export const VenueInfoContainer = styled.View`
  width: 100%;
  background-color: ${props => props.theme.color.almondMilk};
`;

export const InfoText = styled.Text`
  color: ${props => props.light ? props.theme.color.darkGray : props.theme.color.black};
  font-size: 16px;
`;

export const ReviewContainer = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  background-color: ${props => props.theme.color.lightestGray};
`;

export const ReviewRatingContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border-width: 1px;
`;

export const ReviewRatingText = styled.Text`
  font-size: 20px;
`;

export const ReviewTextContainer = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 10px;
  width: 90%;
`;

export const ReviewDate = styled.Text`
  margin: 2px 0 5px;
  color: ${props => props.theme.color.gray};
`;

export const ReviewTextInner = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const ReviewText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
`;
