import React from 'react';
import { ActivityIndicator } from 'react-native';
import * as mc from './index';
import * as c from '../../../common';
import { getDistanceFromLatLonInM } from '../../../../helpers';

export const VenueDetails = (props) => {
  const distance = () => getDistanceFromLatLonInM(
    props.data.geometry.location.lat,
    props.data.geometry.location.lng,
    props.location.lat,
    props.location.lon,
  );

  // 1.4 = walking speed in m/s
  const minWalk = () => Math.ceil((distance() / 1.4) / 60);

  return (
    <mc.VenueInfoContainer>
      <mc.ContentContainer>
        {props.data == null ? (
          <c.CenterView>
            <ActivityIndicator />
          </c.CenterView>
        ) : (
          <React.Fragment>
            {props.data.vicinity && <mc.InfoText>{props.data.vicinity}</mc.InfoText>}
            {props.location && (
              <mc.InfoText light>
                {distance()} meter away ({minWalk()} minute walk)
              </mc.InfoText>
            )}
            {props.data.website && (
              <c.Button
                white
                onPress={props.onMapsClick}
                style={{ marginTop: 10 }}
              >
                Show in Maps
              </c.Button>
            )}
          </React.Fragment>
        )}
      </mc.ContentContainer>
    </mc.VenueInfoContainer>
  );
}

VenueDetails.propTypes = {};
