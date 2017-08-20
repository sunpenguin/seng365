/**
 * Created by spe76 on 19/08/17.
 */

const projects = require('../controllers/project.server.controller');

module.exports = function(app) {
    app.route('/projects')
        .get(projects.viewAll);

    app.route('/projects', validateToken)
        .post(projects.create); // Validate

    app.route('/projects/:id')
        .get(projects.viewOne);

    app.route('/projects/:id', validateToken)
        .put(projects.update); // Validate

    app.route('/projects/:id/image')
        .get(projects.viewImage);

    app.route('/projects/:id/image')
        .put(projects.updateImage); // Validate

    app.route('/projects/:id/pledge', validateToken)
        .post(projects.pledge); // Validate

    app.route('/projects/:id/rewards')
        .get(projects.viewRewards);

    app.route('/projects/:id/rewards', validateToken)
        .put(projects.updateRewards);
};

const validateToken = (req, res, next) => {
    console.log(tokenValidate.isValidToken(req.get('X-Authorization')));
    if (tokenValidate.isValidToken(req.get('X-Authorization'))) {
        next();
    } else {
        res.status(401).send("Unauthorized - not logged in");
    }
};