/**
 * Creates necessary database and tables when missing.
 */

const db = require('../config/db.js');

exports.createAndUseDatabase = function() {
    createCrowdfundingDatabase();
    useCrowdfundingDatabase();
};

exports.createTables = function() {
    createUserTable();
    createProjectTable();
    createRewardTable();
};

exports.createDependentTables = function() {
    createPledgeTable();
    createCreatorTable();
};

function createCrowdfundingDatabase() {
    let crowdfunding = "CREATE DATABASE IF NOT EXISTS crowdfunding";

    db.get().query(crowdfunding, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * Creates all the tables. Does not drop the tables so may come with errors.
 */
exports.createAll = function() {
    let crowdfunding = "CREATE DATABASE IF NOT EXISTS crowdfunding";

    db.get().query(crowdfunding, function(err, result) {
        if (err) {
            console.log(err);
        }

        let useCrowdfunding = "USE crowdfunding";

        db.get().query(useCrowdfunding, function(err, result) {
            if (err) {
                console.log(err);
            }

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

                let project =
                    "CREATE TABLE IF NOT EXISTS Project" +
                    "(" +
                    "proj_id     INT AUTO_INCREMENT," +
                    "creationDate   VARCHAR(20) NOT NULL," +
                    "title       VARCHAR(50) NOT NULL," +
                    "subtitle    VARCHAR(50)," +
                    "description VARCHAR(200)," +
                    "image       VARCHAR(20)," +
                    "target      INT," +
                    "open    BOOLEAN NOT NULL DEFAULT 0," +
                    "number_of_backers   INT DEFAULT 0," +
                    "PRIMARY KEY (proj_id)" +
                    ");";

                db.get().query(project, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                });

                let reward =
                    "CREATE TABLE IF NOT EXISTS Reward" +
                    "(" +
                    "reward_id   INT," +
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

                    let pledge =
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

                    db.get().query(pledge, function(err, result) {
                        if (err) {
                            console.log(err);
                        }

                        let create =
                            "CREATE TABLE IF NOT EXISTS Creator" +
                            "(" +
                            "user_id INT," +
                            "proj_id INT," +
                            "name    VARCHAR(30)," +
                            "PRIMARY KEY (user_id, proj_id)," +
                            "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
                            "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
                            ");";

                        db.get().query(create, function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                });
            });
        });
    });
};

/**
 * Creates everything, including dropping tables when needed.
 */
exports.resetAll = function() {
    let crowdfunding = "CREATE DATABASE IF NOT EXISTS crowdfunding";

    db.get().query(crowdfunding, function(err, result) {
        if (err) {
            console.log(err);
        }

        let useCrowdfunding = "USE crowdfunding";

        db.get().query(useCrowdfunding, function(err, result) {
            if (err) {
                console.log(err);
            }

                let dropCreator = "DROP TABLE IF EXISTS Creator";

                db.get().query(dropCreator, function(err, result) {
                    if (err) {
                        console.log(err);
                    }

                    let dropPledge = "DROP TABLE IF EXISTS Pledge";

                    db.get().query(dropPledge, function(err, result) {
                        if (err) {
                            console.log(err);
                        }

                        let dropReward = "DROP TABLE IF EXISTS Reward";

                        db.get().query(dropReward, function(err, result) {
                            if (err) {
                                console.log(err);
                            }

                            let dropProject = "DROP TABLE IF EXISTS Project";

                            db.get().query(dropProject, function(err, result) {
                                if (err) {
                                    console.log(err);
                                }

                                let dropUser = "DROP TABLE IF EXISTS User";

                                db.get().query(dropUser, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }

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

                                        let project =
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

                                        db.get().query(project, function(err, result) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });

                                        let reward =
                                            "CREATE TABLE IF NOT EXISTS Reward" +
                                            "(" +
                                            "reward_id   INT," +
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

                                            let pledge =
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

                                            db.get().query(pledge, function(err, result) {
                                                if (err) {
                                                    console.log(err);
                                                }

                                                let create =
                                                    "CREATE TABLE IF NOT EXISTS Creator" +
                                                    "(" +
                                                    "user_id INT," +
                                                    "proj_id INT," +
                                                    "name    VARCHAR(30)," +
                                                    "PRIMARY KEY (user_id, proj_id)," +
                                                    "FOREIGN KEY (user_id) REFERENCES User(user_id)," +
                                                    "FOREIGN KEY (proj_id) REFERENCES Project(proj_id)" +
                                                    ");";

                                                db.get().query(create, function(err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
            });
        });
    });
};


function useCrowdfundingDatabase() {
    let useCrowdfunding = "USE crowdfunding";

    db.get().query(useCrowdfunding, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

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
            "creationDate   VARCHAR(20) NOT NULL," +
            "title       VARCHAR(50) NOT NULL," +
            "subtitle    VARCHAR(50)," +
            "description VARCHAR(200)," +
            "image       VARCHAR(20)," +
            "target      INT," +
            "open    BOOLEAN NOT NULL DEFAULT 0," +
            "number_of_backers   INT DEFAULT 0," +
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
            "reward_id   INT," +
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

    db.get().query(pledge, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function createCreatorTable() {
    let create =
        "CREATE TABLE IF NOT EXISTS Creator" +
        "(" +
            "user_id INT," +
            "proj_id INT," +
            "name    VARCHAR(30)," +
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