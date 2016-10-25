////////////////////////////////////////////////////////////
//                        Requires                        //
////////////////////////////////////////////////////////////
var mongoose    = require('mongoose'),
    path        = require('path'),
    db          = require(path.join(__dirname, './settings.js')).db,
    fs          = require('fs');

////////////////////////////////////////////////////////////
//                    Mongoose Connect                    //
////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/'+db);

////////////////////////////////////////////////////////////
//                     Setting Models                     //
////////////////////////////////////////////////////////////
var models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file) {
    if( file.indexOf('.js') >= 0 ) {
        require(models_path + '/' + file);
    }
})
