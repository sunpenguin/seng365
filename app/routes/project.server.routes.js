const projects = require('../controllers/project.server.controller');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rawParser = bodyParser.raw({
    limit: '10mb'
});

module.exports = function(app) {
    app.route('/projects')
        .get(jsonParser, projects.viewAll);

    app.route('/projects', validateToken)
        .post(jsonParser, projects.create); // Validate

    app.route('/projects/:id')
        .get(jsonParser, projects.viewOne);

    app.route('/projects/:id', validateToken)
        .put(jsonParser, projects.update); // Validate

    app.route('/projects/:id/image')
        .get(jsonParser, projects.viewImage);

    app.route('/projects/:id/image')
        .put(rawParser, projects.updateImage); // Validate

    app.route('/projects/:id/pledge', validateToken)
        .post(jsonParser, projects.pledge); // Validate

    app.route('/projects/:id/rewards')
        .get(jsonParser, projects.viewRewards);

    app.route('/projects/:id/rewards', validateToken)
        .put(jsonParser, projects.updateRewards);
};

const validateToken = (req, res, next) => {
    console.log(tokenValidate.isValidToken(req.get('X-Authorization')));
    if (tokenValidate.isValidToken(req.get('X-Authorization'))) {
        next();
    } else {
        res.status(401).send("Unauthorized - not logged in");
    }
};