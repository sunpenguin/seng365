const express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {
    const app = express();

    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));

    app.use(bodyParser.json());

    app.route('/').get(function(req,res) {
        res.json("{status:im working}")
    });

    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/project.server.routes')(app);

    return app;
};