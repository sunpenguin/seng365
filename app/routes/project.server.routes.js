/**
 * Created by spe76 on 19/08/17.
 */

const projects = require('../controllers/project.server.controller');

module.exports = function(app) {
    app.route('/projects')
        .get(projects.viewAll)
        .post(projects.create);

    app.route('/projects/:id')
        .get(projects.viewOne)
        .put(projects.update);

    app.route('/projects/:id/image')
        .get(projects.viewImage)
        .put(projects.updateImage);

    app.route('/projects/:id/pledge')
        .post(projects.pledge);
};