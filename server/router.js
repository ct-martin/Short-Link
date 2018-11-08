const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPages', mid.requiresLogin, controllers.Page.getPages);
  app.get('/getPages/:user', mid.requiresLogin, controllers.Page.getPages);
  app.post('/admin/delete', mid.requiresLogin, controllers.Page.deletePage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/admin', mid.requiresLogin, controllers.Page.makerPage);
  app.post('/admin', mid.requiresLogin, controllers.Page.make);
  app.get('/:user', controllers.Page.makerPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
