// mongoose
// var mongoose = require('mongoose');
//Retreive the User mongoose object

//Model Call
// var Model = mongoose.model('Model');

var cards = require('../lib/cardsx.json');

//Module Export
module.exports = (function() {
    return {
        index: function(req, res) {
            var names = [];
            for (var name in cards) {
                names.push(name);
            }
            res.json(names);
        },
        // retrieve: function(req, res) {
        //     res.json(cards['Elesh Norn, Grand Cenobite']);
        // },
        retrieveOne: function(req, res) {
            if (cards.hasOwnProperty(req.params.name)) {

                res.json(cards[req.params.name]);
            }
        }
    }
})();
