const mtg = require('mtgsdk');
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
            mtg.card.all({name: req.params.name}).on('data', function(card) {
                if (card.name == req.params.name) {
                    res.json(card);
                } else {
                    res.json(cards[req.params.name]);
                }
            })
        }
    }
})();
