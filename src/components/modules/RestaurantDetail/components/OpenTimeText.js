// dependencies
import React from 'react';
import { Text } from 'react-native';
import moment from 'moment';
import theme from '../../../../style/theme';
import * as mc from './index';

export class OpenTimeText extends React.Component {
  state = {
    isOpen: false,
    openText: '',
    timeText: '',
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.data == null && nextProps.data != null) {
      const { data, preData } = nextProps;

      let isOpen = null;

      if (data && data.opening_hours && data.opening_hours.open_now != null) {
        isOpen = data.opening_hours.open_now;
      } else if (preData.opening_hours && preData.opening_hours.open_now != null) {
        isOpen = preData.opening_hours.open_now;
      }

      this.setState({
        isOpen,
        openText: isOpen ? 'Now open' : isOpen != null ? 'Closed' : 'Opening times unavailable',
        timeText: this.getOpenStateString(data),
      });
    }
  }

  getOpenStateString = (data) => {
    // return nothing if there is no opening_hours available
    if (data == null || data.opening_hours == null) {
      return '';
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

  render() {
    const { isOpen, openText, timeText } = this.state;

    return (
      <mc.CircleText small>
        <Text style={{ fontWeight: 'bold', color: isOpen ? theme.color.green : theme.color.red }}>
          {openText}
        </Text>
        {timeText && ` · ${timeText}`}
      </mc.CircleText>
    );
  }
}
