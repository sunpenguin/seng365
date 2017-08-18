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

exports.getOne = function(uid, done) {
    let sql = "SELECT user_id, username, location, email FROM User WHERE user_id = " + uid

    db.get().query(sql, function (err, rows) {

        if (err) return done(err);

        return done(rows);
    });
};

exports.insert = function(username, location, email, password,  done) {
    let sql = 'INSERT INTO User (username, location, email, password) VALUES (\''
        + username + '\', \'' + location + '\', \'' + email + '\', \'' + password + '\')';

    db.get().query(sql, function(err, result) {

        if (err) return done({400: "Malformed request"});

        // Get the user id and return it here with code 201
        done(result);
    });
};

exports.login = function(username, password, done) {
    let sql = "SELECT id FROM User WHERE username = \'" + username + "\' and password = \'" + password + "\'";
    let id = -1;
    let token = -1;

    db.get().query(sql, function(err, result) {
        if (err) return done(err);

        id = result;
    });

    // Generate random string.
    require('crypto').randomBytes(16, function(err, buffer) {

        token = buffer.toString('hex');
    });

    sql = "UPDATE User SET authentication = \'" + token + "\' WHERE id = " + id;
    db.get().query(sql, function(err, result) {

        if (err) return done(err);

        done(id + " " + token);
    });
};

exports.logout = function() {
    return null;
};

exports.alter = function(uid, username, location, email, password, done) {
    let sql = "UPDATE User SET username = \'" + username + "\' , location = \'" + location + "\' , email = \'" +
        email + "\', password = \'" + password + "\' WHERE user_id = " + uid

    db.get().query(sql, function(err, result) {

        if (err) return done({404:"User not found"});

        // Give out correct result
        done(result);
    });
};

exports.remove = function(uid, done) {
    let sql = "DELETE FROM User WHERE user_id = " + uid;

    db.get().query(sql, function(err, result) {

        if (err) return done({404:"User not found"});

        // Give out correct result
        done(result);
    });
};