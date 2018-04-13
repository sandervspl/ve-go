// dependencies
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as mc from './index';

export class RatingText extends React.Component {
  render() {
    const { loading, circle, rating } = this.props;

    return (
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
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
    );
  }
}
