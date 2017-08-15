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

exports.insert = function() {
    return null;
};

exports.alter = function() {
    return null;
};

exports.remove = function() {
    return null;
};