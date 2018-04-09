import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Svg } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import * as s from '../../../common/styles';
import { ratingColor, CountUp } from '../../../../helpers';
import * as mc from './index';

export class RatingCircle extends React.Component {
  state = {
    rating: null,
  };

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

  componentWillReceiveProps(nextProps) {
    if (this.props.data == null && nextProps.data != null) {
      if (nextProps.data.rating) {
        this.countUp = new CountUp({
          startVal: 0.0,
          endVal: nextProps.data.rating,
          decimals: 2,
          duration: 1.5,
          options: {},
          onCount: this.handleCountUp,
        });

        this.countUp.start();
      }
    }
  }

  componentWillUnmount() {
    if (this.countUp) {
      this.countUp.pauseResume();
    }
  }

  handleCountUp = (num) => {
    if (!this.props.stop) {
      this.setState({ rating: num });
    }
  };

  getRatingCircumference = () => {
    const { rating } = this.state;

    if (rating == null) {
      return this.circle.circumference;
    }

    const prct = rating / 5;

    return this.circle.circumference * (1 - prct);
  };

  getOpenStateString = () => {
    const { data } = this.props;

    // return nothing if there is no opening_hours available
    if (data == null || data.opening_hours == null) {
      return null;
    }

    // eslint-disable-next-line camelcase
    const { periods, weekday_text } = data.opening_hours;
    const d = new Date();
    const curHours = d.getHours();
    let curDayNum = d.getDay();
    let period = periods.find(p => p.open.day === curDayNum);
    let openTime;

    // if current day has no information, get first opening time
    if (period == null) {
      // get next period with open state
      let dayNumIndex = -1;
      let nextDayNum = curDayNum;
      while (dayNumIndex === -1) {
        // next day or wrap around if we exceed the amount of weekdays
        nextDayNum = (nextDayNum + 1) % weekday_text.length;
        dayNumIndex = periods.map(p => p.open.day).indexOf(nextDayNum);
      }

      // get the weekday string from weekday_text array
      const [weekdayStr] = weekday_text[nextDayNum - 1].split(':');

      // get opening time for this day
      openTime = periods[dayNumIndex].open.time;

      // decide if we use {day} or tomorrow
      const nextStr = nextDayNum - curDayNum === 1 ? 'tomorrow' : `on ${weekdayStr}`;

      return `Opens ${nextStr} at ${openTime.substr(0, 2)}:${openTime.substr(2, openTime.length)}`;
    }


    // get open/cose times for current day
    const closeTime = period.close.time;
    openTime = period.open.time;

    // get first two numbers of time (i.e. "09" from "0900") and make it a number
    const openingTimeNum = Number(openTime.substr(0, 2));
    const closeTimeNum = Number(closeTime.substr(0, 2));

    // venue is open.
    if (curHours >= openingTimeNum && curHours < closeTimeNum) {
      return `Open until ${closeTime.substr(0, 2)}:${closeTime.substr(2, closeTime.length)}`;
    }

    // venue is closed. Get times for next day (or wrap around to first index)
    curDayNum += 1;
    period = periods.find(p => p.open.day === curDayNum);

    // get first available period if a next day period is not available
    if (period == null) {
      const { day, time } = periods[0].open;

      if (!weekday_text[day - 1]) {
        return null;
      }

      const weekday = weekday_text[day - 1].split(':')[0];

      return `Opens on ${weekday} at ${time.substr(0, 2)}:${time.substr(2, time.length)}`;
    }

    // return next day opening time
    openTime = period.open.time;

    return `Opens at ${openTime.substr(0, 2)}:${openTime.substr(2, openTime.length)}`;
  };

  // color the circle stroke according to the venue rating
  getRatingColor = () => {
    const { rating } = this.state;

    if (rating == null) {
      return s.color.lightgray;
    }

    return ratingColor(rating);
  };

  render() {
    const { circle } = this;
    const { rating } = this.state;
    const { preData, data, loading, saved, onWebsiteClick, onPhoneClick, onFavoriteClick } = this.props;
    const isOpen = (
      (preData.opening_hours && preData.opening_hours.open_now) ||
      (data && data.opening_hours && data.opening_hours.open_now)
    );

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
            stroke={s.color.lightestGray}
            strokeWidth={circle.strokeWidth}
          />

          {/* Outer top cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius}
            fill="none"
            stroke={this.getRatingColor()}
            strokeWidth={circle.strokeWidth}
            strokeDasharray={[circle.circumference]}
            strokeDashoffset={this.getRatingCircumference()}
          />

          {/* Inner cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius * .9}
            fill={s.color.lightestGray}
          />
        </Svg.G>

        <mc.RatingCircleText circle={circle}>
          <View>
            {loading
              ? <ActivityIndicator />
              : (
                <React.Fragment>
                  <mc.RatingCircleRatingText circle={circle}>
                    {rating != null ? `${rating.toFixed(1)}` : 'No rating'}
                  </mc.RatingCircleRatingText>
                  <mc.RatingIconContainer circle={circle}>
                    <Ionicons name="ios-star" size={150} color="rgba(255,139,52,0.1)" />
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
              <Text style={{ fontWeight: 'bold', color: isOpen ? s.color.green : s.color.red }}>
                {isOpen ? 'Now open' : isOpen != null ? 'Closed' : 'Opening times unavailable'}
              </Text>
              {this.getOpenStateString() && ` · ${this.getOpenStateString()}`}
            </mc.CircleText>
          </mc.CircleTextContainer>

          <mc.ButtonsContainer>
            {data != null && (
              <React.Fragment>
                {data.formatted_phone_number && (
                  <mc.DetailButton onPress={onPhoneClick}>
                    Call
                  </mc.DetailButton>
                )}
                <mc.DetailButton onPress={onWebsiteClick}>
                  Website
                </mc.DetailButton>
                <mc.DetailButton invert={saved} last onPress={onFavoriteClick}>
                  {saved ? 'Favorited' : 'Favorite'}
                </mc.DetailButton>
              </React.Fragment>
            )}
          </mc.ButtonsContainer>
        </mc.RatingCircleBottomContainer>
      </Svg>
    );
  }
}
