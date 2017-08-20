/**
 * The main application window.
 */
const db = require('./config/db'),
    express = require('./config/express'),
    tables = require('./helpful_files/tableCreator');

const app = express();

// Connect to MySQL on start
// TODO Go through and check that all authorizations say the correct messages.
db.connect(function(err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    } else {
        app.listen(4941, function() {
            console.log('Listening on port: ' + 4941);
        });
    }
});

tables.createAndUseDatabase();
tables.createTables();
tables.createDependentTables();