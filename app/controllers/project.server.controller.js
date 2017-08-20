const Project = require('../models/project.server.model');

exports.viewAll = function(req, res) {
    let startIndex = req.get('startIndex');
    let count = req.get('count');

    Project.getAll(startIndex, count, function(result) {
        res.status(200).send(result);
    });
};

exports.create = function(req, res) {
    let body = req.body;
    let title = body.title;
    let subtitle = body.subtitle;
    let description = body.description;
    // let image = body.imageUri; Ignored
    let target = body.target;
    let creators = body.creators;
    let rewards = body.rewards;

    Project.createProject(title, subtitle, description, target, creators, rewards, function(result) {
        switch(result) {
            case 400:
                res.status(result).send("Malformed project data");
                break;
            case 401:
                res.status(result).send("Unauthorized - create account to create project");
                break;
            default:
                res.status(201).send(result);
                break;
        }
    });
};

exports.viewOne = function(req, res) {
    let pid = req.params.id;

    Project.getOne(pid, function(result) {
        switch (result) {
            case 404:
                res.status(result).send("Not found");
                break;
            default:
                res.status(200).send(result);
                break;
        }
    });
};

exports.update = function(req, res) {
    let pid = req.params.id;
    let open = req.body.open;

    Project.update(pid, open, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Malformed request");
                break;
            case 401:
                res.status(result).send("Unauthorized - create account to update project");
                break;
            case 403:
                res.status(result).send("Forbidden - unable to update a project you do not own");
                break;
            case 404:
                res.status(result).send("Not found");
                break;
            default:
                res.status(201).send(result);
                break;
        }
    });
};

exports.viewImage = function() {
    return null;
};

exports.updateImage = function() {
    return null;
};

exports.pledge = function(req, res) {
    let pid = req.params.id;

    let body = req. body;
    let backerId = body.id;
    let amount = body.amount;
    let anonymous = body.anonymous;
    // Is this just an authentication token being passed in? If so then we can store it in.
    let token = body.card.authToken;

    Project.createPledge(pid, backerId, amount, anonymous, token, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Bad user, project, or pledge details");
                break;
            case 401:
                res.status(result).send("Unauthorized - create account to pledge to a project");
                break;
            case 403:
                res.status(result).send("Forbidden - cannot pledge to own project - this is fraud!");
                break;
            case 404:
                res.status(result).send("Not found");
                break;
            default:
                res.status(201).send(result);
                break;
        }
    });
};

exports.viewRewards = function(req, res) {
    let pid = req.params.id;

    Project.getRewards(pid, function(result) {
        switch (result) {
            case 404:
                res.status(result).send("Not found");
                break;
            default:
                res.status(200).send(result);
                break;
        }
    });
};

exports.updateRewards = function(req, res) {
    let pid = req.params.id;
    let rewards = req.body;

    Project.newRewards(pid, rewards, function(result) {
        switch (result) {
            case 400:
                res.status(result).send("Malformed request");
                break;
            case 401:
                res.status(result).send("Unauthorized - create account to update project");
                break;
            case 403:
                res.status(result).send("Forbidden - unable to update a project you do not own");
                break;
            case 404:
                res.status(result).send("Not found");
                break;
            default:
                res.status(201).send(result);
                break;
        }
    });
};