var express = require('express'),
    Bourne  = require('bourne'),
    bodyParser = require('body-parser'),
    session = require('express-session')
    crypto = require('crypto');

    db         = new Bourne('users.json'),
    router     = express.Router();

    function hash(password){
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    router
        .use(bodyParser.urlencoded())
        .use(bodyParser.json())
        .use(session({secret:'gejrjrktktoyoyukjthrhrytkrenswfd'}))
        .get('/login',function(req,res){
            res.sendfile('public/login.html');
        })
        .post('/login', function(req,res){
            var user = {
                username: req.body.username,
                password: hash(req.body.password)
            }
            db.findOne(user, function(err, data){
              if(data){
                 req.session.userId = data.id;
                 res.redirect('/');
              }else{
                 res.redirect('/login');
              }
            })
        })
        .post('/register', function(err, data){
            var user = {
                username: req.body.username,
                password: hash(req.body.password),
                options: {}
            };
           db.find({username:user.username}, function(err, data){
            if(!data.length){
               db.insert(user, function(err, data){
                req.session.userId = data.id;
                res.redirect('/');
               })
            }else{
                res.redirect('/')
            }
           })
        })
        .get('/logout', function(req, res){
           req.session.userId = null;
           res.redirect('/')
        })
        .use(function(req, res, next){
            if(req.session.userId){
               db.findOne({id:req.session.userId}, function(err, data){
                   req.user = data;
               })
            }
            next();
        })
        .get('/options/displayed_fields', function(){
            if(!req.user){
                res.json([]);
            }else{
                res.json(req.user.options.displayed_fields || []);
            }
        })
        .post('/options/displayed_fields', function(req,res){
            req.user.options.displayed_fields = req.body.fields;
            db.update({id: req.user.id}, req.user, function(err, data){
              res.json(data[0].options.displayed_fields);
            })
        })

        module.exports = router;