const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let LinkModel = {};

// mongoose.Types.ObjectId is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setSlug = (slug) => _.escape(slug).trim().toLowerCase();
const nowPlusOneMonth = () =>
  new Date().setDate(new Date().getDate() + 30);
  // now + 30 days

const LinkSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
    set: setSlug,
  },

  redirect: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  start: {
    type: Date,
    default: Date.now,
  },

  end: {
    type: Date,
    default: nowPlusOneMonth,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

LinkSchema.statics.toAPI = (doc) => ({
  slug: doc.slug,
  redirect: doc.redirect,
  start: doc.start,
  end: doc.end,
});

LinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LinkModel.find(search).select('slug redirect start end').exec(callback);
};

LinkSchema.statics.delete = (ownerId, linkId, callback) => {
  const search = {
    owner: convertId(ownerId),
    _id: linkId,
  };

  return LinkModel.remove(search).exec(callback);
};

LinkSchema.statics.findBySlug = (slug, ownerId, callback) => {
  const search = {
    slug,
  };

  if (ownerId !== null) {
    search.owner = convertId(ownerId);
  }

  return LinkModel.find(search).select('slug redirect start end').exec(callback);
};

LinkModel = mongoose.model('Link', LinkSchema);

module.exports = {
  LinkModel,
  LinkSchema,
};
