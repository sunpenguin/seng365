const db = require('../../config/db.js');

/**
 * Gets all the users from the database. Will be useless since it is not a Swaffer requirement.
 *
 * @param done the function to return the result in
 */
exports.getAll = function(done) {
    db.get().query('SELECT * FROM User', function (err, rows) {

        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};


/**
 * Gets a single user from the database.
 *
 * @param uid the user id to query for
 * @param done the function to return
 * @returns if ther are errors, return the error code, else return the first person found with that id
 */
exports.getOne = function(uid, done) {
    if (isNaN(uid)) {
        return done(400);
    }

    let sql = "SELECT user_id, username, location, email FROM User WHERE user_id = " + uid;

    db.get().query(sql, function (err, rows) {

        if (err || JSON.stringify(rows) === "[]") return done(404);

        return done(rows);
    });
};


/**
 * Inserts a new user into the database.
 *
 * @param username
 * @param location
 * @param email
 * @param password
 * @param done
 */
exports.insert = function(username, location, email, password,  done) {
    let sql = 'INSERT INTO User (username, location, email, password) VALUES (\''
        + username + '\', \'' + location + '\', \'' + email + '\', \'' + password + '\')';

    db.get().query(sql, function(err, result) {

        if (err || result.affectedRows === 0) return done(400);

        done(JSON.stringify(result.insertId));
    });
};


/**
 * Generates and puts the authentication token to the user_id.
 *
 * @param uid
 * @param done
 */
function updateAuth(uid, done) {
    // Generate random string.
    require('crypto').randomBytes(4, function(err, buffer) {

        let token = buffer.toString('hex');

        let sql = "UPDATE User SET authentication = \'" + token + "\' WHERE user_id = " + uid;
        db.get().query(sql, function(err, result) {
            sql = "SELECT user_id, authentication FROM User WHERE user_id = " + uid;

            db.get().query(sql, function(err, result) {
                done(result);
            });
        });
    });
}

exports.login = function(username, password, done) {
    let sql = "SELECT user_id FROM User WHERE username = \'" + username + "\' and password = \'" + password + "\'";

    db.get().query(sql, function(err, result) {

        if (err || JSON.stringify(result) === '[]') return done(400);

        let id = result[0].user_id;

        updateAuth(id, done);
    });
};


exports.logout = function(token, done) {
    let sql = "UPDATE User SET authentication = NULL WHERE authentication = \'" + token + "\'";

    db.get().query(sql, function(err, result) {

        if (err) return done(401);

        done(200);
    });
};


exports.alter = function(uid, username, location, email, password, done) {
    let sqlForbidden = "SELECT * FROM User WHERE user_id = " + uid + " AND username = \'" + username + "\' AND password = \'" + password + "\'";

    db.get().query(sqlForbidden, function(err, result) {

        if (err || JSON.stringify(result) === '[]') return done(403);

        let sql = "UPDATE User SET username = \'" + username + "\' , location = \'" + location + "\' , email = \'" +
            email + "\', password = \'" + password + "\' WHERE user_id = " + uid;

        db.get().query(sql, function(err, result) {

            if (err || result.affectedRows === 0) return done(404);

            // Give out correct result
            done(result);
        });
    });

};


exports.remove = function(uid, done) {
    let sql = "SELECT username, password FROM User WHERE user_id = " + uid;

    db.get().query(sql, function(err, result) {

        if (err || JSON.stringify(result) === '[]') return done(err);

        let username = result[0].username;
        let password = result[0].password;
        let sqlForbidden = "SELECT * FROM User WHERE user_id = " + uid + " AND username = \'" + username + "\' AND password = \'" + password + "\'";

        db.get().query(sqlForbidden, function(err, result) {

            if (err || JSON.stringify(result) === '[]') return done(403);

            let sql = "UPDATE User SET active = false WHERE user_id = " + uid;

            db.get().query(sql, function(err, result) {

                if (err) return done(err);

                done(200);
            });
        });
    });
};