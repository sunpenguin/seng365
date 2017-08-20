const express = require('express');

module.exports = function() {
    const app = express();

    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));

    app.route('/').get(function(req,res) {
        res.json("{status:im working}")
    });

    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/project.server.routes.js')(app);

    return app;
};