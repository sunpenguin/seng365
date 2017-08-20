const users = require('../controllers/user.server.controller');
const tokenValidate = require('../models/user.server.authentication');

module.exports = function(app) {
    app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/login')
        .post( users.login);

    app.route('/users/logout', validateToken)
        .post(users.logout); // Validate

    app.route('/users/:id')
        .get(users.userById);

    app.route('/users/:id', validateToken)
        .put(users.update)  // Validate
        .delete(users.delete);  // Validate
};

const validateToken = (req, res, next) => {
    console.log(tokenValidate.isValidToken(req.get('X-Authorization')));
    if (tokenValidate.isValidToken(req.get('X-Authorization'))) {
        next();
    } else {
        res.status(401).send("Unauthorized - not logged in");
    }
};