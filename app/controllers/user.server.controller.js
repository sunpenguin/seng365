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

    User.insert(username, location, email, password, function(result) {
        res.json(result);
    });
};

exports.login = function(req, res) {
    let username = req.username;
    let password = req.password;

    User.login(username, password, function(result) {
       res.json(result);
    });
};

exports.logout = function(req, res) {
    return null;
};

exports.userById = function(req, res) {
    let uid = req.params.id;

    User.getOne(uid, function(result) {
        res.json(result);
    });
};

exports.update = function(req, res) {
    let uid = req.params.id;

    let user = req.body.user;
    let username = user.username.toString();
    let location = user.location.toString();
    let email = user.email.toString();

    let password = req.body.password.toString();

    User.alter(uid, username, location, email, password, function(result) {
        res.json(result);
    });
};

exports.delete = function(req, res) {
    let uid = req.params.id;

    User.remove(uid, function(result) {
        res.json(result);
    });
};