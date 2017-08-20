const projects = require('../controllers/project.server.controller');
const multer = require('multer');
const imagesFolder = multer({dest: "images/"});

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
        // .put(rawParser, projects.updateImage); // Validate
        .put(imagesFolder.single('image'), projects.updateImage);

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