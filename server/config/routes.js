//Require the controller
var main = require('../controllers/main.js');
const path = require('path');
//////////////////////////////////////////////////////////
//                        Routes                        //
//////////////////////////////////////////////////////////
module.exports = function(app) {
    // app.get('/cards', function(req, res) {
    //     main.index(req, res);
    // })
    app.get('/api/cards', function(req, res) {
        main.index(req, res);
    });
    app.get('/api/card/:name', function(req, res) {
        main.retrieveOne(req, res);
    })
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    })
}
