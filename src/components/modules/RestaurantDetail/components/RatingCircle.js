import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Svg } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import theme from '../../../../style/theme';
import { ratingColor, CountUp } from '../../../../helpers';
import * as mc from './index';

export class RatingCircle extends React.Component {
  state = {
    rating: null,
    openStateText: '',
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
      // start circle animation
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

  componentDidUpdate(prevProps) {
    if (prevProps.data == null && this.props.data != null) {
      // set open/close string
      this.setState({
        openStateText: this.getOpenStateString(),
      });
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

  getRatingDashOffset = () => {
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
    const now = moment();
    const dayPeriods = periods.filter(p => p.open.day === now.day());
    let closeTime = null;
    let openTime = null;
    let curTimeIsAfterCloseTime = false;

    // check all periods of a day -- venues can have multiple opening/closing times
    if (dayPeriods.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const period of dayPeriods) {
        openTime = moment(period.open.time, 'HHmm');
        closeTime = moment(period.close.time, 'HHmm');

        // check if venue closes on a day other than the same day
        if (period.open.day !== period.close.day) {
          closeTime.add(1, 'day');
        }

        curTimeIsAfterCloseTime = now.isSameOrAfter(closeTime);

        if (!curTimeIsAfterCloseTime) {
          break;
        }
      }
    }

    // if current day has no information, or the venue is closed, get first opening time
    if (dayPeriods.length === 0 || curTimeIsAfterCloseTime) {
      // get next period with open state
      let dayNumIndex = -1;
      let nextDayNum = now.day();

      while (dayNumIndex === -1) {
        // next day or wrap around if we exceed the amount of weekdays
        nextDayNum = (nextDayNum + 1) % weekday_text.length;
        dayNumIndex = periods.map(p => p.open.day).indexOf(nextDayNum);
      }

      // get the weekday string from weekday_text array
      const [weekdayStr] = weekday_text[nextDayNum - 1].split(':');

      // get opening time for this day
      openTime = moment(periods[dayNumIndex].open.time, 'HHmm');

      // decide if we use {day} or tomorrow
      const nextStr = nextDayNum - now.day() === 1 ? 'tomorrow' : `on ${weekdayStr}`;

      return `Opens ${nextStr} at ${openTime.format('HH:mm')}`;
    }


    // venue is open -- return time until close
    if (now.isBetween(openTime, closeTime, '[)')) {
      return `Open until ${closeTime.format('HH:mm')}`;
    }


    // venue is closed -- opens some time today
    return `Opens at ${openTime.format('HH:mm')}`;
  };

  // color the circle stroke according to the venue rating
  getRatingColor = () => {
    const { rating } = this.state;

    if (rating == null) {
      return theme.color.lightgray;
    }

    return ratingColor(rating);
  };

  render() {
    const { circle } = this;
    const { rating, openStateText } = this.state;
    const { preData, data, loading, saved, onWebsiteClick, onPhoneClick, onFavoriteClick } = this.props;
    const isOpen = (
      (data && data.opening_hours && data.opening_hours.open_now) ||
      (preData.opening_hours && preData.opening_hours.open_now)
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
            stroke={theme.color.lightestGray}
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
            strokeDashoffset={this.getRatingDashOffset()}
          />

          {/* Inner cirle */}
          <Svg.Circle
            cx={circle.y}
            cy={circle.x}
            r={circle.radius * .9}
            fill={theme.color.lightestGray}
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
              <Text style={{ fontWeight: 'bold', color: isOpen ? theme.color.green : theme.color.red }}>
                {isOpen ? 'Now open' : isOpen != null ? 'Closed' : 'Opening times unavailable'}
              </Text>
              {openStateText && ` · ${openStateText}`}
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
