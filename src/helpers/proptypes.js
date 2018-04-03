import PT from 'prop-types';

/* eslint-disable function-paren-newline */
const attributesShape = PT.shape({
  groups: PT.arrayOf(
    PT.shape({
      count: PT.number,
      items: PT.arrayOf(
        PT.shape({
          displayName: PT.string,
          displayValue: PT.string,
        }),
      ),
      name: PT.string,
      summary: PT.string,
      type: PT.string,
    }),
  ),
});

const iconShape = PT.shape({
  prefix: PT.string,
  suffix: PT.string,
});

const highlightColorShape = PT.shape({
  photoId: PT.string,
  value: PT.number,
});

const countitemsnametypeShape = PT.shape({
  count: PT.number,
  items: PT.arrayOf(PT.any),
  name: PT.string,
  type: PT.string,
});

const hereNowShape = PT.shape({
  count: PT.number,
  groups: PT.arrayOf(countitemsnametypeShape),
  summary: PT.string,
});

const richStatusShape = PT.shape({
  entities: PT.arrayOf(PT.any),
  text: PT.string,
});

const daysincludesTodayopensegmentsShape = PT.shape({
  days: PT.string,
  includesToday: PT.bool,
  open: PT.arrayOf(
    PT.shape({
      renderedTime: PT.string,
    }),
  ),
  segments: PT.arrayOf(PT.any),
});

const inboxShape = PT.shape({
  count: PT.number,
  items: PT.arrayOf(PT.any),
});

const listedShape = PT.shape({
  count: PT.number,
  groups: PT.arrayOf(countitemsnametypeShape),
});

export const venueProps = PT.shape({
  attributes: attributesShape,
  beenHere: PT.shape({
    count: PT.number,
    lastCheckinExpiredAt: PT.number,
    marked: PT.bool,
    unconfirmedCount: PT.number,
  }),
  bestPhoto: PT.shape({
    createdAt: PT.number,
    height: PT.number,
    id: PT.string,
    prefix: PT.string,
    source: PT.shape({
      name: PT.string,
      url: PT.string,
    }),
    suffix: PT.string,
    visibility: PT.string,
    width: PT.number,
  }),
  canonicalUrl: PT.string,
  categories: PT.arrayOf(
    PT.shape({
      icon: iconShape,
      id: PT.string,
      name: PT.string,
      pluralName: PT.string,
      primary: PT.bool,
      shortName: PT.string,
    }),
  ),
  colors: PT.shape({
    algoVersion: PT.number,
    highlightColor: highlightColorShape,
    highlightTextColor: highlightColorShape,
  }),
  contact: PT.shape({
    facebook: PT.string,
    facebookName: PT.string,
    facebookUsername: PT.string,
    formattedPhone: PT.string,
    instagram: PT.string,
    phone: PT.string,
    twitter: PT.string,
  }),
  createdAt: PT.number,
  description: PT.string,
  dislike: PT.bool,
  hereNow: hereNowShape,
  hours: PT.shape({
    dayData: PT.arrayOf(PT.any),
    isLocalHoliday: PT.bool,
    isOpen: PT.bool,
    richStatus: richStatusShape,
    status: PT.string,
    timeframes: PT.arrayOf(daysincludesTodayopensegmentsShape),
  }),
  id: PT.string,
  inbox: inboxShape,
  likes: hereNowShape,
  listed: listedShape,
  location: PT.shape({
    address: PT.string,
    cc: PT.string,
    city: PT.string,
    country: PT.string,
    crossStreet: PT.string,
    formattedAddress: PT.arrayOf(PT.string),
    labeledLatLngs: PT.arrayOf(
      PT.shape({
        label: PT.string,
        lat: PT.number,
        lng: PT.number,
      }),
    ),
    lat: PT.number,
    lng: PT.number,
    postalCode: PT.string,
    state: PT.string,
  }),
  name: PT.string,
  ok: PT.bool,
  page: PT.shape({
    pageInfo: PT.shape({
      banner: PT.string,
      description: PT.string,
      links: inboxShape,
    }),
    user: PT.shape({
      bio: PT.string,
      contact: PT.shape({
        facebook: PT.string,
        twitter: PT.string,
      }),
      firstName: PT.string,
      gender: PT.string,
      homeCity: PT.string,
      id: PT.string,
      lists: attributesShape,
      photo: iconShape,
      tips: PT.shape({
        count: PT.number,
      }),
      type: PT.string,
    }),
  }),
  pageUpdates: inboxShape,
  photos: listedShape,
  phrases: PT.arrayOf(
    PT.shape({
      count: PT.number,
      phrase: PT.string,
      sample: richStatusShape,
    }),
  ),
  popular: PT.shape({
    isLocalHoliday: PT.bool,
    isOpen: PT.bool,
    timeframes: PT.arrayOf(daysincludesTodayopensegmentsShape),
  }),
  rating: PT.number,
  ratingColor: PT.string,
  ratingSignals: PT.number,
  reasons: inboxShape,
  shortUrl: PT.string,
  specials: inboxShape,
  stats: PT.shape({
    checkinsCount: PT.number,
    tipCount: PT.number,
    usersCount: PT.number,
    visitsCount: PT.number,
  }),
  storeId: PT.string,
  timeZone: PT.string,
  tips: listedShape,
  url: PT.string,
  venueChains: PT.arrayOf(PT.any),
  verified: PT.bool,
});
/* eslint-enable */
