import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Svg } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import * as styles from '../../../common/styles';
import * as c from '../../../common';
import * as mc from './index';

export class RatingCircle extends React.Component {
  // eslint-disable-next-line
  circle = new function() {
    this.container = {
      width: 375,
      height: 0.6 * 667,
    };
    this.radius = (this.container.width * .8) / 2;
    this.strokeWidth = 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.x = this.container.height / 2 - this.strokeWidth / 2;
    this.y = this.container.height - this.radius - 20;
  };

  getRatingCircumference = () => {
    const { data } = this.props;

    if (!data || !data.rating) {
      return this.circle.circumference;
    }

    const prct = data.rating / 5;

    return this.circle.circumference * (1 - prct);
  };

  render() {
    const { circle } = this;
    const { preData, data, loading, onWebsiteClick, onPhoneClick } = this.props;
    const isOpen = preData.opening_hours && preData.opening_hours.open_now;

    return (
      <Svg
        width={circle.container.width}
        height={circle.container.height}
      >
        <Svg.G
          rotation="-90"
          origin={`${circle.container.width / 2}, ${circle.container.height / 2}`}
        >
          {/* Outer bottom cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius}
            fill="none"
            stroke={styles.color.lightestGray}
            strokeWidth={circle.strokeWidth}
          />

          {/* Outer top cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius}
            fill="none"
            stroke={styles.color.green}
            strokeWidth={circle.strokeWidth}
            strokeDasharray={[circle.circumference]}
            strokeDashoffset={this.getRatingCircumference()}
          />

          {/* Inner cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius * .9}
            fill={styles.color.lightestGray}
          />
        </Svg.G>

        <mc.RatingCircleText circle={circle}>
          <View>
            {/*<Text style={{ textAlign: 'center', fontSize: 20 }}>*/}
              {/*RATING*/}
            {/*</Text>*/}
            {loading
              ? <ActivityIndicator />
              : (
                <React.Fragment>
                  <mc.RatingCircleRatingText circle={circle}>
                    {data && data.rating ? `${data.rating}` : 'No rating'}
                  </mc.RatingCircleRatingText>
                  <mc.RatingIconContainer circle={circle}>
                    {data && data.rating && <Ionicons name="ios-star" size={150} color="rgba(255,139,52,0.1)" />}
                  </mc.RatingIconContainer>
                </React.Fragment>
              )}
          </View>
        </mc.RatingCircleText>

        <mc.RatingCircleBottomContainer>
          <mc.CircleTextContainer>
            <mc.CircleText>
              {preData.name}
            </mc.CircleText>
            <mc.CircleText small>
              {isOpen ? 'Now open' : isOpen == null ? 'Opening times unavailable' : 'Closed'}
            </mc.CircleText>
          </mc.CircleTextContainer>

          {data != null && (
            <mc.ButtonsContainer>
              {data.formatted_phone_number && (
                <mc.DetailButton onPress={onPhoneClick}>
                  Call
                </mc.DetailButton>
              )}
              <mc.DetailButton last onPress={onWebsiteClick}>
                Website
              </mc.DetailButton>
            </mc.ButtonsContainer>
          )}
        </mc.RatingCircleBottomContainer>
      </Svg>
    );
  }
}
