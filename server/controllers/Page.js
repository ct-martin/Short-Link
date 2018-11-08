const models = require('../models');

const Page = models.Page;
const Account = models.Account;

const makerPage = (request, response) => {
  const req = request;
  const res = response;

  if (req.params.user) {
    return Account.AccountModel.findByUsername(req.params.user, (err, doc) => {
      if (doc) {
        return Page.PageModel.findByOwner(doc.id, (err2, docs) => {
          if (err2) {
            console.log(err2);
            return res.status(400).json({ error: 'An error occurred' });
          }

          return res.render('app', {
            csrfToken: req.csrfToken(), ownProfile: false, pages: docs, user: req.params.user,
          });
        });
      }
      return res.render('app', {
        csrfToken: req.csrfToken(), ownProfile: false, pages: [], user: req.params.user,
      });
    });
  }
  return Page.PageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(), ownProfile: true, pages: docs, user: false,
    });
  });
};

const makePage = (req, res) => {
  if (!req.body.name || !req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const pageData = {
    name: req.body.name,
    title: req.body.title,
    content: req.body.content,
    owner: req.session.account._id,
  };

  const newPage = new Page.PageModel(pageData);

  const pagePromise = newPage.save();

  pagePromise.then(() => res.json({ redirect: '/admin' }));

  pagePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Page already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return pagePromise;
};

const getPages = (request, response) => {
  const req = request;
  const res = response;

  if (req.params.user) {
    return Account.AccountModel.findByUsername(req.params.user, (err, doc) => {
      if (doc) {
        return Page.PageModel.findByOwner(doc.id, (err2, docs) => {
          if (err2) {
            console.log(err2);
            return res.status(400).json({ error: 'An error occurred' });
          }

          return res.json({ pages: docs });
        });
      }
      return res.json({ pages: [] });
    });
  }
  return Page.PageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ pages: docs });
  });
};

const deletePage = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.pageId) {
    return res.send(400).json({ error: 'RAWR! No Page id given' });
  }

  return Page.PageModel.delete(req.session.account._id, req.body.pageId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ pages: docs });
  });
};

module.exports = {
  makerPage,
  make: makePage,
  deletePage,
  getPages,
};
