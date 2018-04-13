// dependencies
import React from 'react';
import { Linking } from 'react-native';
import call from 'react-native-phone-call';
import * as mc from './index';
import { asyncStorage } from '../../../../helpers';

export class ContactButtons extends React.Component {
  onWebsiteClick = () => {
    Linking.openURL(this.props.data.website)
      .catch(e => console.log(e));
  };

  onPhoneClick = () => {
    call({ number: this.props.data.formatted_phone_number, prompt: true })
      .catch(e => console.log(e));
  };

  onSaveClick = async () => {
    const { data, setSaveState, isSaved } = this.props;
    // eslint-disable-next-line
    const { place_id, name, vicinity } = data;

    if (!isSaved) {
      const saveDetails = {
        place_id,
        name,
        vicinity,
      };
      const saved = await asyncStorage.save(saveDetails);

      if (saved) {
        setSaveState(saved);
      }
    } else {
      const saved = await asyncStorage.unsave(place_id);

      if (saved) {
        setSaveState(!saved);
      }
    }
  };

  render() {
    const { data, isSaved } = this.props;

    return (
      <mc.ButtonsContainer>
        {data != null && (
          <React.Fragment>
            {data.formatted_phone_number && <mc.DetailButton onPress={this.onPhoneClick}>Call</mc.DetailButton>}
            <mc.DetailButton onPress={this.onWebsiteClick}>Website</mc.DetailButton>
            <mc.DetailButton invert={isSaved} last onPress={this.onSaveClick}>
              {isSaved ? 'Saved' : 'Save'}
            </mc.DetailButton>
          </React.Fragment>
        )}
      </mc.ButtonsContainer>
    );
  }
}
