/**
 * Model file for authenticating.
 */
const db = require('../../config/db.js');


/**
 * Checks a token to the authentication token stored in the database.
 *
 * @param uid
 * @param token
 */
exports.isValidToken = function(token) {
    // let sql = "SELECT authentication FROM User WHERE user_id = " + uid;
    let sql = "SELECT authentication FROM User";
    db.get().query(sql, function(err, result) {

        if (err) return 404;

        console.log(result[0]);
        let tableToken = result[0].authentication;

        if (tableToken === token) {
            return true;
        }
        return false;
    });
};

