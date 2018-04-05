import React from 'react';
import { ratingColor } from '../../../../helpers';
import * as c from '../../../common';
import * as mc from './index';

export const Review = ({ data }) => {
  const d = new Date(0);
  d.setUTCSeconds(data.time);
  const date = d.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <mc.ReviewContainer>
      <mc.ReviewRatingContainer style={{ borderColor: ratingColor(data.rating) }}>
        <mc.ReviewRatingText style={{ color: ratingColor(data.rating) }}>
          {data.rating}
        </mc.ReviewRatingText>
      </mc.ReviewRatingContainer>

      <mc.ReviewTextContainer>
        <c.Title noMargin>
          {data.author_name}
        </c.Title>

        <mc.ReviewDate>
          {date}
        </mc.ReviewDate>

        <mc.ReviewTextInner>
          <mc.ReviewText>
            {data.text}
          </mc.ReviewText>
        </mc.ReviewTextInner>
      </mc.ReviewTextContainer>
    </mc.ReviewContainer>
  );
};

Review.propTypes = {};
