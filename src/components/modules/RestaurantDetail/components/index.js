import styled from 'styled-components';
import { LinearGradient } from 'expo';
import * as c from '../../../common';
import * as s from '../../../common/styles';

export { RatingCircle } from './RatingCircle';
export { Reviews } from './Reviews';
export { Review } from './Review';
export { VenueDetails } from './VenueDetails';

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
  color: ${props => props.small ? s.color.lightgray : s.color.black};
  font-size: ${props => props.small ? 17 : 30}px;
  ${props => props.bold && 'font-weight: bold'};
`;

export const ButtonsContainer = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  bottom: 20px;
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
  background-color: ${s.color.darkGreen};
`;

export const InfoText = styled.Text`
  color: ${props => props.light ? s.color.lightgray : s.color.white};
  font-size: 16px;
`;

export const ReviewContainer = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  background-color: ${s.color.lightestGray};
`;

export const ReviewRatingContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border: 1px solid ${s.color.green};
`;

export const ReviewRatingText = styled.Text`
  color: ${s.color.green};
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
  color: ${s.color.gray};
`;

export const ReviewTextInner = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const ReviewText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
`;
