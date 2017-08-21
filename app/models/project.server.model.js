const db = require('../../config/db.js');
const fs = require('fs');

exports.getAll = function(startIndex, count, done) {
    let last = startIndex + count;
    let sql = "SELECT proj_id, title, subtitle, image FROM Project LIMIT " + startIndex + ", " + last;

    db.get().query(sql, function(err, result) {
        done(result);
    });
};

exports.createProject = function(title, subtitle, description, target, creators, rewards, done) {
    let sql = "INSERT INTO Project (creationDate, title, subtitle, description, target) VALUES (" + parseInt(getToday())
        + ", \'" + title + "\', \'" + subtitle + "\', \'" + description + "\', " + parseInt(target) + ")";

    db.get().query(sql, function(err, result) {

        if (err) return done(400);

        let proj_id = result.insertId;

        let sqlCreators = "INSERT INTO Creator (user_id, proj_id, name) VALUES ?";
        let valuesCreators = [];
        for (let i = 0; i < creators.length; i++) {
            valuesCreators.push([creators[i].id, proj_id, creators[i].name]);
        }

        db.get().query(sqlCreators, [valuesCreators], function(err, result) {
            let sqlRewards = "INSERT INTO Reward (reward_id, proj_id, amount, description) VALUES ?";
            let valuesRewards = [];
            for (let i = 0; i < rewards.length; i++) {
                valuesRewards.push([rewards[i].id, proj_id, rewards[i].amount, rewards[i].description]);
            }

            db.get().query(sqlRewards, [valuesRewards], function(err, result) {
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

    return days + months + years;
}

// View the details of a single project
exports.getOne = function(pid, done) {
    let details = {
        "project": {},
        "progress": {},
        "backers": []
    };

    let creators = [];
    let rewards = [];

    let sqlCreators = "SELECT user_id, name FROM Creator WHERE proj_id = " + pid;

    // Get creator information from Creator
    db.get().query(sqlCreators, function(err, result) {
        if (err) return done(err);

        for (let i = 0; i < result.length; i++) {
            creators.push({
                "id": result[i].user_id,
                "name": result[i].name
            });
        }

        let sqlRewards = "SELECT reward_id, amount, description FROM Reward WHERE proj_id = " + pid;

        // Get rewards information from Reward
        db.get().query(sqlRewards, function(err, result) {
            if (err) return done(err);

            for (let i = 0; i < result.length; i++) {
                rewards.push({
                    "id": result[i].reward_id,
                    "amount": result[i].amount,
                    "description": result[i].description
                });
            }

            let sql = "SELECT * FROM Project WHERE proj_id = " + pid;
            // Get basic project details stored in Project
            db.get().query(sql, function(err, result) {
                if (err) return done(err);

                let project = result[0];
                details.project = {
                    "id": project.proj_id,
                    "creationDate": project.creationDate,
                    "data": {
                        "title": project.title,
                        "subtitle": project.subtitle,
                        "description": project.description,
                        "imageUri": project.image,
                        "target": project.target,
                        "creators": creators,
                        "rewards": rewards
                    }
                };

                let sqlProgress = "SELECT target, number_of_backers FROM Project WHERE proj_id = " + pid;

                // Get the progress calculated by both Project and Pledge table
                db.get().query(sqlProgress, function(err, result) {
                    if (err) return done(err);

                    details.progress = {
                        "target": result[0].target,
                        "currentPledged": 0,
                        "numberOfBackers": result[0].number_of_backers
                    };

                    let sqlBackers = "SELECT user_id, amount, anonymous FROM Pledge WHERE proj_id = " + pid;
                    // Get the backer information
                    db.get().query(sqlBackers, function(err, result) {
                        if (err) return done(404);

                        let total = 0;

                        for (let i = 0; i < result.length; i++) {
                            if (result[i].anonymous === 0) {
                                details.backers.push({
                                    "name": result[i].user_id,
                                    "amount": result[i].amount,
                                });
                            }
                            total += result[i].amount;
                        }

                        details.progress.currentPledged = total;

                        done(details);
                    })
                });
            });
        });
    });
};

exports.update = function(pid, open, done) {
    let sqlVerifyProjectDetails = "SELECT * FROM Project WHERE proj_id = " + pid;

    db.get().query(sqlVerifyProjectDetails, function(err, result) {

        if (err || JSON.stringify(result) === "[]") return done(404);

        let sql = "SELECT user_id FROM Creator WHERE proj_id = " + pid;

        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === "[]") return done(403);

            sql = "UPDATE Project SET open = " + open + " WHERE proj_id = " + pid;

            db.get().query(sql, function(err, result) {

                if (err) return done(400);

                done("OK");
            });
        });
    });
};


exports.getImage = function(pid, done) {
    let sql = "SELECT image FROM Project WHERE proj_id =" + pid;

    db.get().query(sql, function(err, result) {

        let path = result[0].image;

        if (fs.existsSync(path)) {
            done(path);
        } else {
            done(404);
        }
    });
};

exports.newImage = function(pid, filename, done) {
    let sql = "SELECT user_id FROM Creator WHERE proj_id = " + pid;

    db.get().query(sql, function(err, result) {

        if (err || JSON.stringify(result) === "[]") return done(403);

        let sql = "UPDATE Project SET image = \'images/" + filename + "\' WHERE proj_id = " + pid;

        db.get().query(sql, function (err, result) {

            if (err) return done(400);

            done("OK");
        });
    });
};

exports.createPledge = function(pid, backerId, amount, anonymous, token, done) {
    if (isNaN(pid) || isNaN(backerId) || isNaN(amount)
        || typeof(anonymous) !== 'boolean' || typeof(token) !== 'string') {
        return done(400);
    }

    let sqlVerifyProjectDetails = "SELECT * FROM Project WHERE proj_id = " + pid;

    db.get().query(sqlVerifyProjectDetails, function(err, result) {

        if (err || JSON.stringify(result) === "[]") return done(404);

        let sqlVerifyNotSelf = "SELECT user_id FROM Creator WHERE proj_id = " + pid + " AND user_id = " + backerId;

        db.get().query(sqlVerifyNotSelf, function(err, result) {

            if (err || JSON.stringify(result) !== "[]") return done(403);

            let pledgeDetails = [[backerId, pid, amount, anonymous, token]];
            let sqlCreatePledge = "INSERT INTO Pledge (user_id, proj_id, amount, anonymous, token) VALUES ?";

            db.get().query(sqlCreatePledge, [pledgeDetails], function(err, result) {
                if (err) return done(err);
                // Increment number of backers!!!
                let sqlBackers = "UPDATE Project SET number_of_backers = number_of_backers + 1 WHERE proj_id = " + pid;

                db.get().query(sqlBackers, function(err, result) {
                    done("OK");
                });
            });
        });
    });
};


exports.getRewards = function(pid, done) {
    let sql = "SELECT reward_id, amount, description FROM Reward WHERE proj_id = " + pid;

    db.get().query(sql, function(err, result) {
        if (err || JSON.stringify(result) === "[]") return done(404);

        done(result);
    });
};


exports.newRewards = function(pid, rewards, done) {
    let sql = "SELECT * FROM Project WHERE proj_id = " + pid;

    db.get().query(sql, function(err, result) {

        if (err || JSON.stringify(result) === "[]") return done(404);

        sql = "SELECT user_id FROM Creator WHERE proj_id = " + pid;

        db.get().query(sql, function(err, result) {

            if (err || JSON.stringify(result) === "[]") return done(403);

            sql = "DELETE FROM Reward WHERE proj_id = " + pid;
            let existing = [];
            for (let i = 0; i < rewards.length; i++) {
                existing.push(rewards[i].reward_id);
            }

            db.get().query(sql, [[existing]], function(err, result) {

                if (err) return done(400);

                let sqlNewRewards = "INSERT INTO Reward (reward_id, proj_id, amount, description) VALUES ?";

                let newData = [];
                for (let i = 0; i < rewards.length; i++) {
                    newData.push([rewards[i].id, pid, rewards[i].amount, rewards[i].description]);
                }

                db.get().query(sqlNewRewards, [newData], function(err, result) {

                    if (err) return done(400);

                    done("OK");
                });
            });
        });
    });
};