const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to string b/c security
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/admin' });
  });
};

const signup = (request, response) => {
  if(process.env.signup !== 'enable') {
    return res.status(403).json({ error: 'Registration is disabled' });
  }

  const req = request;
  const res = response;

  // force cast to strings b/c security
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const reserved = ['admin', 'login', 'logout', 'getPages', 'getToken', 'logout', 'api'];
  if (reserved.includes(req.body.username)) {
    return res.status(400).json({ error: 'Username is a reserved string' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/admin' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred. Does this account already exist?' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings b/c security
  req.body.oldpassword = `${req.body.oldpassword}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldpassword || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error: Passwords do not match' });
  }

  const reserved = ['admin', 'login', 'logout', 'getPages', 'getToken', 'logout', 'api'];
  if (reserved.includes(req.body.username)) {
    return res.status(400).json({ error: 'Error: Username is a reserved string' });
  }

  return Account.AccountModel.changePassword(
    req.session.account.username,
    req.body.oldpassword, req.body.pass,
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ success: 'success' });
    }
  );
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  changePassword,
};
