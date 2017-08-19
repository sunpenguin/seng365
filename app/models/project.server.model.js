const db = require('../../config/db.js');

exports.getAll = function(startIndex, count, done) {
    let last = startIndex + count;
    let sql = "SELECT proj_id, title, subtitle, image FROM Project LIMIT " + startIndex + ", " + last;

    db.get().query(sql, function(err, result) {
        done(result);
    });


};

exports.createProject = function(title, subtitle, description, target, creators, rewards, done) {
    let sql = "INSERT INTO Project (creationDate, title, subtitle, description, target) VALUES (\'" + getToday()
        + "\', \'" + title + "\', \'" + subtitle + "\', \'" + description + "\', " + target + ")";

    db.get().query(sql, function(err, result) {
        if (err) return done(400);

        let proj_id = result.insertId;

        let sqlCreators = "INSERT INTO Creator (user_id, proj_id, name) VALUES ?";
        let valuesCreators = [];
        for (let i = 0; i < creators.length; i++) {
            valuesCreators.push([creators[i].id, proj_id, creators[i].name]);
        }

        db.get().query(sqlCreators, [valuesCreators], function(err, result) {
            if (err) return done(err);

            let sqlRewards = "INSERT INTO Reward (reward_id, proj_id, amount, description) VALUES ?";
            let valuesRewards = [];
            for (let i = 0; i < rewards.length; i++) {
                valuesRewards.push([rewards[i].id, proj_id, rewards[i].amount, rewards[i].description]);
            }

            db.get().query(sqlRewards, [valuesRewards], function(err, result) {
                if (err) return done(400);

                done(JSON.stringify(proj_id));
            });
        });
    });
};


function getToday() {
    let today = new Date();

    let days = today.getDate();
    if (days < 10) days = '0' + days;

    let months = today.getMonth();
    if (months < 10) months ='0' + months;

    let years = today.getFullYear();

    return days + '-' + months + '-' + years;
}

// View the details
// TODO: How to do this zzz
exports.getOne = function(pid, done) {
    let sql = "SELECT * FROM Project WHERE proj_id = " + pid;
    let details;

    db.get().query(sql, function(err, result) {
        if (err) return done(err);

        let sqlCreators = "SELECT user_id, name FROM Creator WHERE proj_id = " + pid;

        db.get().query(sqlCreators, function(err, result) {
            if (err) return done(err);

            let sqlRewards = "SELECT reward_id, amount, description FROM Reward WHERE proj_id = " + pid;

            db.get().query(sqlRewards, function(err, result) {
                if (err) return done(err);

                let sqlProgress = "SELECT user_id, amount, anonymous FROM Pledge WHERE proj_id = " + pid;

                db.get().query(sqlProgress, function(err, result) {
                    if (err) return done(err);

                    let sqlBackers = "SELECT user_id, amount, anonymous FROM Pledge WHERE proj_id = " + pid;

                    db.get().query(sqlBackers, function(err, result) {
                        if (err) return done(err);

                        done(result);
                    })
                });
            });
        });
    });
};

exports.update = function(pid, open, done) {
    let sql = "UPDATE Project SET open = " + open.toUpperCase() + " WHERE proj_id = " + pid;

    db.get().query(sql, function(err, result) {
        if (err) return done(403);

        done("OK");
    });
};