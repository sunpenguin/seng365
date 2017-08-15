const User = require('../models/user.server.model');

exports.list = function(req, res) {
    User.getAll(function(result) {
        res.json(result);
    });
};

exports.create = function(req, res) {
    let user = req.body.user;

    let username = user.username.toString();
    let location = user.location.toString();
    let email = user.email.toString();

    let password = req.body.password.toString();

    let user_details = [
        [username, location, email]
    ];

    User.insert(username, location, email, password, function(result) {
        res.json(result);
    });
};

exports.login = function(req, res) {
    return null;
};

exports.logout = function(req, res) {
    return null;
};

exports.userById = function(req, res) {
    return null;
};

exports.update = function(req, res) {
    return null;
};

exports.delete = function(req, res) {
    return null;
};