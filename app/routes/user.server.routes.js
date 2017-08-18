const users = require('../controllers/user.server.controller');

module.exports = function(app) {
    app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/login')
        .post(users.login);

    app.route('/users/logout')
        .post(users.logout);

    app.route('/users/:id')
        .get(users.userById)
        .put(users.update)
        .delete(users.delete);
};