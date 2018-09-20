console.log("launching node app....");

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('laptimesApp', ['users'])
var ObjectId = mongojs.ObjectId


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




app.get('/', function(req, res){
    db.users.find(function (err, docs) {
        console.log(docs);
        res.render('index',{
            title : "recordHolders",
            users: docs
        });
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
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
});

app.delete('/users/delete/:id',function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)},function(err, result){
       console.log(req.params.id);
        if(err){
            conosle.log(err);
        }
        res.redirect('/');
    })
});
app.listen(3000, function(){
    console.log('Server Started on port 3000..');
});