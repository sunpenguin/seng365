const User = require('../models/user.server.model');


/**
 * Lists all the users. For testing purposes.
 *
 * @param req
 * @param res
 */
exports.list = function(req, res) {
    User.getAll(function(result) {
        res.json(result);
    });
};


/**
 * Method to create a new user in the database.
 *
 * @param req the request message
 * @param res the response message
 */
exports.create = function(req, res) {
    let user = req.body.user;
    let username = user.username.toString();
    let location = user.location.toString();
    let email = user.email.toString();

    let password = req.body.password.toString();

    User.insert(username, location, email, password, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Malformed request");
                break;
            default:
                res.status(201).send(result);
                break;
        }
    });
};

exports.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    User.login(username, password, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Invalid username/password supplied");
                break;
            default:
                res.status(200).send(result);
                break;
        }
    });
};

exports.logout = function(req, res) {
    let token = req.get('X-Authorization');

    User.logout(token, function(result) {
        switch (result) {
            case 401:
                res.status(result).send("Unauthorized - already logged out");
                break;
            default:
                res.status(200).send("OK");
                break;
        }
    });
};


/**
 * Gets a user by ID.
 *
 * @param req
 * @param res
 */
exports.userById = function(req, res) {
    let uid = req.params.id;

    User.getOne(uid, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Malformed request");
                break;
            case 401:
                res.status(result).send("Unauthorized - not logged in");
                break;
            case 403:
                res.status(result).send("Forbidden - account not owned");
                break;
            case 404:
                res.status(result).send("User not found");
                break;
            default:
                res.status(200).send(result);
                break;
        }
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
        switch (result) {
            case 400:
                res.status(result).send("Malformed request");
                break;
            case 401:
                res.status(result).send("Unauthorized - not logged in");
                break;
            case 403:
                res.status(result).send("Forbidden - account not owned");
                break;
            case 404:
                res.status(result).send("User not found");
                break;
            default:
                res.json(result);
                break;
        }
    });
};


/**
 * Deletes a user (sets the field active to false)
 *
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    let uid = req.params.id;
    let token = req.get('X-Authorization');

    User.remove(uid, token, function(result) {
        switch (result) {
            case 401:
                res.status(result).send("Unauthorized - not logged in");
                break;
            case 403:
                res.status(result).send("Forbidden - account not owned");
                break;
            case 404:
                res.status(result).send("User not found");
                break;
            default:
                res.status(result).send("User deleted");
                break;
        }
    });
};