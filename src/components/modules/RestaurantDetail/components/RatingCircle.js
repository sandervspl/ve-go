import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Svg } from 'expo';
import * as styles from '../../../common/styles';
import * as c from '../../../common';
import * as mc from './index';

export class RatingCircle extends React.Component {
  // eslint-disable-next-line
  circle = new function() {
    this.container = {
      width: 375,
      height: 0.55 * 667,
    };
    this.radius = (this.container.height * .8) / 2;
    this.strokeWidth = 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.x = this.container.height / 2 - this.strokeWidth / 2;
    this.y = this.container.height - this.radius;
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
    const { preData, data, loading } = this.props;

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
            stroke="#fafafa"
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
            fill="#fafafa"
          />
        </Svg.G>

        <mc.RatingCircleText circle={circle}>
          <View>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>
              RATING
            </Text>
            {loading
              ? <ActivityIndicator />
              : (
                <c.HugeTitle style={{ textAlign: 'center', width: circle.radius * 2 }}>
                  {data && data.rating ? `${data.rating} / 5` : 'No rating'}
                </c.HugeTitle>
              )}
          </View>
        </mc.RatingCircleText>

        <mc.RatingCircleBottomContainer>
          <mc.RatingCircleNameContainer>
            <mc.RatingCircleName>
              {preData.name}
            </mc.RatingCircleName>
          </mc.RatingCircleNameContainer>

          <mc.ButtonsContainer>
            <c.Button onPress={() => console.log('hello world')}>
              Show in Maps
            </c.Button>
          </mc.ButtonsContainer>
        </mc.RatingCircleBottomContainer>
      </Svg>
    );
  }
}
