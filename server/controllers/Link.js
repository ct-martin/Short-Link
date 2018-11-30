const models = require('../models');

const Link = models.Link;
const LinkStat = models.LinkStat;

const makerPage = (req, res) =>
  // Links are loaded post-page-load
   res.render('app', { csrfToken: req.csrfToken() });

const makeLink = (req, res) => {
  if (!req.body.slug || !req.body.redirect) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }
  if(!req.body.slug.toLowerCase.match(/[a-z0-9-]+/)) {
    return res.status(400).json({ error:
      'Error: Only the hyphen (-) and alphanumeric characters are allowed in the slug.'
    });
  }

  const linkData = {
    slug: req.body.slug,
    redirect: req.body.redirect,
    owner: req.session.account._id,
  };

  const newLink = new Link.LinkModel(linkData);

  const linkPromise = newLink.save();

  linkPromise.then(() => res.json({ redirect: '/admin' }));

  linkPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Link already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return linkPromise;
};

const getLinks = (request, response) => {
  const req = request;
  const res = response;

  return Link.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ links: docs });
  });
};

const deleteLink = (request, response) => {
  const req = request;
  const res = response;

  req.body.linkId = `${req.body.linkId}`;

  if (!req.body.linkId) {
    return res.status(400).json({ error: 'Error: No Link id given' });
  }

  return Link.LinkModel.delete(req.session.account._id, req.body.linkId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ links: docs });
  });
};

const linkStats = (request, response) => {
  const req = request;
  const res = response;

  req.params.slug = `${req.params.slug}`;

  if (!req.params.slug) {
    return res.status(400).json({ error: 'Error: No slug given' });
  }

  return Link.LinkModel.findBySlug(req.params.slug, req.session.account._id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred. Do you have the right slug?' });
    } else if (docs.length === 0) {
      return res.status(400).json({ error: 'An error occurred. Do you have the right slug?' });
    }
    const doc = Link.LinkModel.toAPI(docs[0]);
    if (doc === undefined) {
      return res.status(400).json({ error: 'An error occurred.' });
    }

    const startObj = new Date();
    startObj.setFullYear(new Date().getFullYear() - 1);
    const start = startObj.toISOString();
    const end = new Date().toISOString();

    return LinkStat.LinkStatModel.findByDateRange(
      req.params.slug,
      start,
      end,
      (err2, docs2) => {
        if (err2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ link: doc, stats: docs2 });
      });
  });
};

const linkRedirect = (request, response) => {
  const req = request;
  const res = response;

  req.params.slug = `${req.params.slug}`;

  if (!req.params.slug) {
    return res.status(400).json({ error: 'Error: No slug given' });
  }

  return Link.LinkModel.findBySlug(req.params.slug, null, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred. Do you have the right link?' });
    } else if (docs.length === 0) {
      return res.status(400).json({ error: 'An error occurred. Do you have the right link?' });
    }
    const doc = Link.LinkModel.toAPI(docs[0]);
    if (doc === undefined) {
      return res.status(400).json({ error: 'An error occurred.' });
    } else if (doc.redirect === undefined) {
      return res.status(400).json({ error: 'An error occurred.' });
    }
    if (doc.start > Date.now()) {
      return res.status(400).json({ error: 'An error occurred. Do you have the right link?' });
    } else if (doc.end < Date.now()) {
      return res.status(400).json({ error: 'Error: This link has expired' });
    }

    const linkData = {
      slug: req.params.slug,
      //ip: req.ip,
    };

    if (req.header('Referrer')) {
      linkData.referrer = req.header('Referrer');
    } else {
      linkData.referrer = '';
    }

    // Uses Cloudflare's GeoIP header, if set
    if (req.header('CF-IPCountry')) {
      linkData.country = req.header('CF-IPCountry');
    } else {
      linkData.country = 'XX'; // Did not get Header; parity w/ Cloudflare's "Unknown" value
    }

    const newLink = new LinkStat.LinkStatModel(linkData);

    const linkPromise = newLink.save();

    linkPromise.then(() => res.redirect(doc.redirect));

    linkPromise.catch((err2) => {
      console.log(err2);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return linkPromise;
  });
};

module.exports = {
  makerPage,
  make: makeLink,
  deleteLink,
  getLinks,
  linkRedirect,
  linkStats,
};
