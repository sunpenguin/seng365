const projects = require('../controllers/project.server.controller');
const multer = require('multer');
const imagesFolder = multer({dest: "images/"});
const middleware = require('../models/user.server.authentication');

module.exports = function(app) {
    app.route('/projects')
        .get(projects.viewAll)
        .post(middleware.validateTokenProject, projects.create);

    app.route('/projects/:id')
        .get(projects.viewOne)
        .put(middleware.validateTokenProject,  projects.update);

    app.route('/projects/:id/image')
        .get(projects.viewImage)
        .put(middleware.validateTokenProject, imagesFolder.single('image'), projects.updateImage);

    app.route('/projects/:id/pledge')
        .post(middleware.validateTokenPledge, projects.pledge);

    app.route('/projects/:id/rewards')
        .get(projects.viewRewards)
        .put(middleware.validateTokenProject, projects.updateRewards);
};