const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const useragent = require('express-useragent');

let LinkStatModel = {};

const setName = (slug) => _.escape(slug).trim().toLowerCase();

const LinkStatSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  referrer: {
    type: String,
    trim: true,
    set: setName,
    default: '',
  },

  // User Agent
  ua: {
    type: String,
    trim: true,
    default: '',
  },

  country: {
    type: String,
    required: true,
    trim: true,
    set: setName,
    default: 'XX',
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const parseUA = (ua) => {
  const uaParsed = useragent.parse(ua);
  return {
    isMobile: uaParsed.isMobile,
    isBot: uaParsed.isBot,
    browser: uaParsed.browser,
    os: uaParsed.os,
    platform: uaParsed.platform,
  };
};

LinkStatSchema.statics.toAPI = (doc) => ({
  slug: doc.slug,
  referrer: doc.referrer,
  country: doc.country,
  ua: doc.ua || '',
  uaParsed: doc.ua ? parseUA(doc.ua) : {},
  timestamp: doc.timestamp,
});

LinkStatSchema.statics.findByDateRange = (slug, start, end, callback) => {
  const search = {
    slug,
    timestamp: { $gte: start, $lte: end },
  };

  return LinkStatModel.find(search).select('slug referrer ua country timestamp').exec(callback);
};

LinkStatModel = mongoose.model('LinkStat', LinkStatSchema);

module.exports = {
  LinkStatModel,
  LinkStatSchema,
};
