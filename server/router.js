const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/admin/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/admin/getLinks', mid.requiresLogin, controllers.Link.getLinks);
  app.get('/admin/getStats/:slug', mid.requiresLogin, controllers.Link.linkStats);
  app.post('/admin/delete', mid.requiresLogin, controllers.Link.deleteLink);
  app.post('/admin/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/admin/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/admin/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/admin/password', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/admin', mid.requiresLogin, controllers.Link.makerPage);
  app.post('/admin', mid.requiresLogin, controllers.Link.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/:slug', controllers.Link.linkRedirect);
};

module.exports = router;
