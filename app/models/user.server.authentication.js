/**
 * Model file for authenticating.
 */
const db = require('../../config/db.js');


/**
 * Checks a token to the authentication token stored in the database.
 *
 * @param token
 */
function isValidToken(token) {
    // let sql = "SELECT authentication FROM User WHERE user_id = " + uid;
    let sql = "SELECT authentication FROM User WHERE authentication = " + token;
    db.get().query(sql, function(err, result) {

        if (err || JSON.stringify(result) === '[]') return 401;

        console.log(result[0]);
        let tableToken = result[0].authentication;

        return tableToken === token;

    });
}

module.exports = {
    validateTokenLogout: function(req, res, next) {
        if (isValidToken(req.get('X-Authorization'))) {
            next();
        } else {
            res.status(401).send("Unauthorized - already logged out");
        }
    },

    validateTokenLogin: function(req, res, next) {
        if (middleware.isValidToken(req.get('X-Authorization'))) {
            next();
        } else {
            res.status(401).send("Unauthorized - not logged in");
        }
    },

    validateTokenProject: function(req, res, next) {
        if (middleware.isValidToken(req.get('X-Authorization'))) {
            next();
        } else {
            res.status(401).send("Unauthorized - create account to update project");
        }
    },

    validateTokenPledge: function(req, res, next) {
        if (middleware.isValidToken(req.get('X-Authorization'))) {
            next();
        } else {
            res.status(401).send("Unauthorized - create account to pledge to a project");
        }
    }
};

