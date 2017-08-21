const users = require('../controllers/user.server.controller');
const middleware = require('../models/user.server.authentication');

module.exports = function(app) {
    app.route('/users')
        .post(users.create);
        // .get(users.list);

    app.route('/users/login')
        .post( users.login);

    app.route('/users/logout')
        .post(middleware.validateTokenLogout, users.logout);

    app.route('/users/:id')
        .get(users.userById)
        .put(middleware.validateTokenLogin, users.update)
        .delete(middleware.validateTokenLogin, users.delete);
};