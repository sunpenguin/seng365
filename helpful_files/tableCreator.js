/**
 * Creates necessary tables when missing.
 */

const db = require('../config/db.js');

exports.createTables = function(req, res) {
    createUserTable();
    createProjectTable();
    createRewardTable();
    createPledgeTable();
    createCreateTable();
};

function createUserTable() {
    let user =
        "CREATE TABLE IF NOT EXISTS User" +
        "(" +
            "user_id     INT AUTO_INCREMENT," +
            "username    VARCHAR(20) UNIQUE NOT NULL," +
            "location    VARCHAR(20) NOT NULL," +
            "email       VARCHAR(40) NOT NULL," +
            "password    VARCHAR(40)," +
            "authentication   VARCHAR(20)," +
            "active BOOLEAN NOT NULL DEFAULT 1," +
            "PRIMARY KEY (user_id)" +
        ");";

    db.get().query(user, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function createProjectTable() {
    let project =
        "CREATE TABLE IF NOT EXISTS Project" +
        "(" +
            "proj_id     INT AUTO_INCREMENT," +
            "title       VARCHAR(50) NOT NULL," +
            "subtitle    VARCHAR(50)," +
            "description VARCHAR(200)," +
            "image       VARCHAR(20)," +
            "target      INT," +
            "number_of_backers   INT," +
            "PRIMARY KEY (proj_id)" +
        ");";

    db.get().query(project, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function createRewardTable() {
    let reward =
        "CREATE TABLE IF NOT EXISTS Reward" +
        "(" +
            "reward_id   INT AUTO_INCREMENT," +
            "proj_id     INT," +
            "amount      INT," +
            "description VARCHAR(200)," +
            "PRIMARY KEY (reward_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    db.get().query(reward, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function createPledgeTable() {
    let pledge =
        "CREATE TABLE IF NOT EXISTS Pledge" +
        "(" +
            "user_id INT," +
            "proj_id INT," +
            "amount  INT," +
            "anonymous   BOOLEAN," +
            "token   VARCHAR(20)," +
            "PRIMARY KEY (user_id, proj_id)," +
            "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    db.get().query(pledge, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function createCreateTable() {
    let create =
        "CREATE TABLE IF NOT EXISTS Creator" +
        "(" +
            "user_id INT," +
            "proj_id INT," +
            "PRIMARY KEY (user_id, proj_id)," +
            "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    db.get().query(create, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}