const db = require('../../config/db.js');

exports.getAll = function(done) {
    db.get().query('SELECT * FROM Users', function (err, rows) {

        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};

exports.getOne = function() {
    return null;
};

exports.insert = function(username, location, email, password,  done) {

    let sql = 'INSERT INTO PublicUser (username, location, email) VALUES (\'' + username + '\', \'' + location + '\', \'' + email + '\')';
    db.get().query(sql, function(err, result) {

        if (err) return done(err);

    })

    /**
     * Currently I am creating a user in PublicUser table. I will then get the ID specified to the person and then I will add it to the user.
     * @type {string}
     */
    let anothersql = 'SELECT id FROM PublicUser WHERE username = \'' + username + '\' AND location = \'' + location + '\' AND email = \'' + email + '\'';
    console.log(db.get().query(anothersql, function(err, result) {

        if (err) return done(err);

        done(result);
    }));

    // db.get().query('INSERT INTO Users (id, password) VALUES ?', (), function(err, result) {
    //
    //     if (err) return done(err);
    //
    //     done(result);
    // })
};

exports.alter = function() {
    return null;
};

exports.remove = function() {
    return null;
};