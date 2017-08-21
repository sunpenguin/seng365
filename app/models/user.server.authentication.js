/**
 * Model file for authenticating.
 */
const db = require('../../config/db.js');

module.exports = {
    validateTokenLogout: function(req, res, next) {
        let token = req.get('X-Authorization');
        let sql = "SELECT authentication FROM User WHERE authentication = \'" + token + "\'";
        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === '[]') {
                return res.status(401).send("Unauthorized - create account to update project");
            }

            let tableToken = result[0].authentication;
            if (tableToken === token) {
                next();
            } else {
                res.status(401).send("Unauthorized - already logged out");
            }
        });
    },

    validateTokenLogin: function(req, res, next) {
        let token = req.get('X-Authorization');
        let sql = "SELECT authentication FROM User WHERE authentication = \'" + token + "\'";
        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === '[]') {
                return res.status(401).send("Unauthorized - create account to update project");
            }

            let tableToken = result[0].authentication;
            if (tableToken === token) {
                next();
            } else {
                res.status(401).send("Unauthorized - not logged in");
            }
        });
    },

    validateTokenProject: function(req, res, next) {
        let token = req.get('X-Authorization');
        let sql = "SELECT authentication FROM User WHERE authentication = \'" + token + "\'";
        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === '[]') {
                return res.status(401).send("Unauthorized - create account to update project");
            }

            let tableToken = result[0].authentication;
            if (tableToken === token) {
                next();
            } else {
                res.status(401).send("Unauthorized - create account to update project");
            }
        });
    },

    validateTokenPledge: function(req, res, next) {
        let token = req.get('X-Authorization');
        let sql = "SELECT authentication FROM User WHERE authentication = \'" + token + "\'";
        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === '[]') {
                return res.status(401).send("Unauthorized - create account to update project");
            }

            let tableToken = result[0].authentication;
            if (tableToken === token) {
                next();
            } else {
                res.status(401).send("Unauthorized - create account to pledge to a project");
            }
        });
    }
};

