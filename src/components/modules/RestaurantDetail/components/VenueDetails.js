import React from 'react';
import { ActivityIndicator } from 'react-native';
import * as mc from './index';
import * as c from '../../../common';

export const VenueDetails = (props) => (
  <mc.VenueInfoContainer>
    <mc.ContentContainer>
      {props.data == null ? (
        <c.CenterView>
          <ActivityIndicator />
        </c.CenterView>
      ) : (
        <React.Fragment>
          {props.data.vicinity && <mc.InfoText>{props.data.vicinity}</mc.InfoText>}
          {props.data.website && (
            <c.Button
              white
              onPress={props.onWebsiteClick}
              style={{ marginTop: 10 }}
            >
              Website
            </c.Button>
          )}
        </React.Fragment>
      )}
    </mc.ContentContainer>
  </mc.VenueInfoContainer>
);

VenueDetails.propTypes = {};
