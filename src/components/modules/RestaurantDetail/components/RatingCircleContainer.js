import React from 'react';
import { Svg } from 'expo';
import * as mc from './index';
import { CountUp } from '../../../../helpers';

export class RatingCircleContainer extends React.Component {
  state = {
    rating: 0,
  };

  // eslint-disable-next-line
  circle = new function() {
    this.container = {
      width: 375,
      height: 0.6 * 667,
    };
    this.radius = this.container.width * 0.8 / 2;
    this.strokeWidth = 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.x = this.container.height / 2 - this.strokeWidth / 2;
    this.y = this.container.height - this.radius - 20;
  }();

  componentWillReceiveProps(nextProps) {
    if (this.props.data == null && nextProps.data != null) {
      if (nextProps.data.rating == null) {
        this.setState({ rating: null });
        // start circle animation
      } else if (nextProps.data.rating) {
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

  render() {
    const { circle } = this;
    const { rating } = this.state;
    const { preData, data, loading, isSaved, setSaveState } = this.props;

    return (
      <Svg width={circle.container.width} height={circle.container.height}>
        <mc.RatingCircle circle={circle} rating={rating} data={data} />

        <mc.RatingCircleText circle={circle}>
          <mc.RatingText loading={loading} circle={circle} rating={rating} />
        </mc.RatingCircleText>

        <mc.RatingCircleBottomContainer>
          <mc.CircleTextContainer>
            <mc.CircleText bold>{preData.name}</mc.CircleText>
            <mc.OpenTimeText data={data} preData={preData} />
          </mc.CircleTextContainer>

          <mc.ContactButtons data={data} setSaveState={setSaveState} isSaved={isSaved} />
        </mc.RatingCircleBottomContainer>
      </Svg>
    );
  }
}
