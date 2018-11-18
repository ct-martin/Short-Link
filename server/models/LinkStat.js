const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

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
/*
Potential future additions:
  * User Agent
    * Device (Windows, iOS, Android, Linux, etc.)
    * Browser (Chrome, Firefox, etc.)
  * IP (this is a privacy risk though...)
  * Region of country (APIs for this are limited...)
*/

LinkStatSchema.statics.toAPI = (doc) => ({
  slug: doc.slug,
  referrer: doc.referrer,
  country: doc.country,
  timestamp: doc.timestamp,
});

LinkStatSchema.statics.findByDateRange = (slug, start, end, callback) => {
  const search = {
    slug,
    timestamp: { $gte: start, $lte: end },
  };

  return LinkStatModel.find(search).select('slug referrer country timestamp').exec(callback);
};

LinkStatModel = mongoose.model('LinkStat', LinkStatSchema);

module.exports = {
  LinkStatModel,
  LinkStatSchema,
};
