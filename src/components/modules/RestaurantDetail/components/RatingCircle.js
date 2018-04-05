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

  getOpenStateString = () => {
    const { data } = this.props;

    // return nothing if there is no opening_hours available
    if (data == null || data.opening_hours == null) {
      return null;
    }

    const d = new Date();
    const curHours = d.getHours();
    let curDay = d.getDay();
    let period = data.opening_hours.periods.find(p => p.open.day === curDay);
    let openTime;
    let closeTime;

    // if current day has no information, get first opening time
    if (period == null) {
      [period] = data.opening_hours.periods;

      // get weekday name from weekday_text array string
      const weekday = data.weekday_text[period.open.day].split(':')[0];
      openTime = period.open.time;

      return `Opens on ${weekday} at ${openTime.substr(0, 2)}:${openTime.substr(2, openTime.length)}`;
    }

    openTime = period.open.time;
    closeTime = period.close.time;

    // get first two numbers of time (i.e. "09" from "0900") and make it a number
    const openingTimeNum = Number(openTime.substr(0, 2));
    const closeTimeNum = Number(closeTime.substr(0, 2));

    if (curHours >= openingTimeNum && curHours < closeTimeNum) {
      return `Open until ${closeTime.substr(0, 2)}:${closeTime.substr(2, closeTime.length)}`;
    }

    // venue is closed. Get times for next day
    curDay = curDay < 6 ? curDay + 1 : 0;
    openTime = data.opening_hours.periods[curDay].open.time;
    closeTime = data.opening_hours.periods[curDay].close.time;

    return `Opens at ${openTime.substr(0, 2)}:${openTime.substr(2, openTime.length)}`;
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
            <mc.CircleText bold>
              {preData.name}
            </mc.CircleText>
            <mc.CircleText small>
              <Text style={{ fontWeight: 'bold' }}>{isOpen ? 'Now open' : isOpen == null ? 'Opening times unavailable' : 'Closed'}</Text>
              {this.getOpenStateString() && ` · ${this.getOpenStateString()}`}
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
