import React from 'react';
import * as mc from './index';

export const Reviews = ({ data }) => {
  if (data == null) {
    return null;
  }

  const sortedReviews = data.sort((a, b) => a.time < b.time);

  return (
    <mc.ContentContainer>
      {sortedReviews.map(review => (
        <mc.Review key={review.time} data={review} />
      ))}
    </mc.ContentContainer>
  );
};

Reviews.propTypes = {};
