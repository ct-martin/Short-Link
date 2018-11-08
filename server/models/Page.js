const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PageModel = {};

// mongoose.Types.ObjectId is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  content: {
    type: String,
    required: true,
    trim: true,
    set: setName,
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

PageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  title: doc.title,
  content: doc.content,
});

PageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PageModel.find(search).select('name title content').exec(callback);
};

PageSchema.statics.delete = (ownerId, pageId, callback) => {
  const search = {
    owner: convertId(ownerId),
    _id: pageId,
  };

  return PageModel.remove(search).exec(callback);
};

PageModel = mongoose.model('Page', PageSchema);

module.exports = {
  PageModel,
  PageSchema,
};
