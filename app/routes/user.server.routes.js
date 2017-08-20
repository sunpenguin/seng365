const users = require('../controllers/user.server.controller');
const tokenValidate = require('../models/user.server.authentication');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app) {
    app.route('/users')
        .post(jsonParser, users.create)
        .get(jsonParser, users.list);

    app.route('/users/login')
        .post(jsonParser, users.login);

    app.route('/users/logout', validateToken)
        .post(jsonParser, users.logout); // Validate

    app.route('/users/:id')
        .get(jsonParser, users.userById);

    app.route('/users/:id', validateToken)
        .put(jsonParser, users.update)  // Validate
        .delete(jsonParser, users.delete);  // Validate
};

const validateToken = (req, res, next) => {
    console.log(tokenValidate.isValidToken(req.get('X-Authorization')));
    if (tokenValidate.isValidToken(req.get('X-Authorization'))) {
        next();
    } else {
        res.status(401).send("Unauthorized - not logged in");
    }
};