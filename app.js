console.log("launching node app....");

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var expressValidator = require('express-validator')


var app = express();

/*

var logger = function(re, res, next){
    console.log('Reloaded..');
    next();
}
app.use(logger);
*/

//view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname,'views'))


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')))

//global vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});

//express validate middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + "]";
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));


var users = [
    {
        first_name: 'John',
        last_name: 'Doe',
        lap_time:'yes@gmail.com',
    },
    {
        first_name: 'Jill',
        last_name: 'tot',
        lap_time:'no@gmail.com',
    }
]

app.get('/', function(req, res){
    res.render('index',{
        title : "recordHolders",
        users: users
    });

});

app.post("/users/add", function(req, res){

    req.checkBody('first_name','First name is required').notEmpty();
    req.checkBody('last_name','Last name is required').notEmpty();
    req.checkBody('lap_time','Lap time is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index',{
            title : "recordHolders",
            users: users,
            errors : errors
        });
    }
    else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            lap_time: req.body.lap_time
        }
        console.log("New user has been added");
    }


    
});



app.listen(3000, function(){
    console.log('Server Started on port 3000..');
});