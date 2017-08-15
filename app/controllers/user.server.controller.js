const User = require('../models/user.server.model');

exports.list = function(req, res) {
    User.getAll(function(result) {
        res.json(result);
    });
};

exports.create = function(req, res) {
    return null;
};

exports.read = function(req, res) {
    return null;
}

exports.update = function(req, res) {
    return null;
};

exports.delete = function(req, res) {
    return null;
};

exports.userById = function(req, res) {
    return null;
};