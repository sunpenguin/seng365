/**
 * Creates necessary database and tables when missing.
 */

const db = require('../config/db.js');

/**
 * Creates all the tables. Does not drop the tables so may come with errors.
 */
exports.createAll = function() {
    let createAll = "CREATE DATABASE IF NOT EXISTS crowdfunding;";
    createAll += "USE crowdfunding;";

    createAll +=
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

    createAll +=
        "CREATE TABLE IF NOT EXISTS Project" +
        "(" +
        "proj_id     INT AUTO_INCREMENT," +
        "creationDate   INT NOT NULL," +
        "title       VARCHAR(50) NOT NULL," +
        "subtitle    VARCHAR(50)," +
        "description VARCHAR(200)," +
        "image       VARCHAR(200)," +
        "target      INT," +
        "open    BOOLEAN NOT NULL DEFAULT 0," +
        "number_of_backers   INT DEFAULT 0," +
        "PRIMARY KEY (proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Reward" +
        "(" +
        "reward_id   INT," +
        "proj_id     INT," +
        "amount      INT," +
        "description VARCHAR(200)," +
        "PRIMARY KEY (reward_id)," +
        "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Pledge" +
        "(" +
        "pledge_id   INT AUTO_INCREMENT," +
        "user_id INT," +
        "proj_id INT," +
        "amount  INT," +
        "anonymous   BOOLEAN," +
        "token   VARCHAR(20)," +
        "PRIMARY KEY (pledge_id)," +
        "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
        "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Creator" +
        "(" +
        "user_id INT," +
        "proj_id INT," +
        "name    VARCHAR(30)," +
        "PRIMARY KEY (user_id, proj_id)," +
        "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
        "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    db.get().query(createAll, function(err, result) {
        if (err) return err;
    });
};

/**
 * Creates everything, including dropping tables when needed.
 */
exports.resetAll = function() {
    let createAll = "CREATE DATABASE IF NOT EXISTS crowdfunding;";
    createAll += "USE crowdfunding;";
    createAll += "DROP TABLE IF EXISTS Creator;";
    createAll += "DROP TABLE IF EXISTS Pledge;";
    createAll += "DROP TABLE IF EXISTS Reward;";
    createAll += "DROP TABLE IF EXISTS Project;";
    createAll += "DROP TABLE IF EXISTS User;";

    createAll +=
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

    createAll +=
        "CREATE TABLE IF NOT EXISTS Project" +
        "(" +
            "proj_id     INT AUTO_INCREMENT," +
            "creationDate   INT NOT NULL," +
            "title       VARCHAR(50) NOT NULL," +
            "subtitle    VARCHAR(50)," +
            "description VARCHAR(200)," +
            "image       VARCHAR(200)," +
            "target      INT," +
            "open    BOOLEAN NOT NULL DEFAULT 0," +
            "number_of_backers   INT DEFAULT 0," +
            "PRIMARY KEY (proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Reward" +
        "(" +
            "reward_id   INT," +
            "proj_id     INT," +
            "amount      INT," +
            "description VARCHAR(200)," +
            "PRIMARY KEY (reward_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Pledge" +
        "(" +
            "pledge_id   INT AUTO_INCREMENT," +
            "user_id INT," +
            "proj_id INT," +
            "amount  INT," +
            "anonymous   BOOLEAN," +
            "token   VARCHAR(20)," +
            "PRIMARY KEY (pledge_id)," +
            "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    createAll +=
        "CREATE TABLE IF NOT EXISTS Creator" +
        "(" +
            "user_id INT," +
            "proj_id INT," +
            "name    VARCHAR(30)," +
            "PRIMARY KEY (user_id, proj_id)," +
            "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
        ");";

    db.get().query(createAll, function(err, result) {
        if (err) return err;
    });
};