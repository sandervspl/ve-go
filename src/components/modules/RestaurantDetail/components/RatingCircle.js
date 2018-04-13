// dependencies
import React from 'react';
import { Svg } from 'expo';
import { ratingColor } from '../../../../helpers';
import theme from '../../../../style/theme';

export class RatingCircle extends React.Component {
  getRatingDashOffset = () => {
    const { rating, circle } = this.props;

    if (rating == null) {
      return circle.circumference;
    }

    const prct = rating / 5;

    return circle.circumference * (1 - prct);
  };

  // color the circle stroke according to the venue rating
  getRatingColor = () => {
    const { rating } = this.props;

    if (rating == null) {
      return theme.color.lightgray;
    }

    return ratingColor(rating);
  };

  render() {
    const { circle } = this.props;

    return (
      <Svg.G rotation="-90" origin={`${circle.container.width / 2}, ${circle.container.height / 2}`}>
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
        <Svg.Circle cx={circle.y} cy={circle.x} r={circle.radius * 0.9} fill={theme.color.lightestGray} />
      </Svg.G>
    );
  }
}
