const express = require("express"); //turns the file into a webserver
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors"); //open the server to all the ips that we want, other computers can cnnect to our server
const bodyparser = require('body-parser'); //access to the body request
const mongoose = require("mongoose");
const app = express(); //express instance
const post = require("./models/posts");
const student = require("./models/posts");
const user = require("./models/posts");
const router = require('./routes/posts');
const routerDelete = require('./routes/deletes');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/testdb').then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("connection failed");
})

const port = 8080;
const protectedRoute = express.Router();

app.set('key', 'secret');

//authorization middleware
protectedRoute.use((req, res, next) => {
    const token = req.headers["access-token"];
    if(token){
        jwt.verify(token, app.get('key'), (err, decoded) => {
            if(err){
                return res.send({'msg': 'Invalid token'});
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.send({'msg':'Token not provided'});
    }
});

app.use(express.json()); //allows the requests in json
app.use(cors());

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin","*"); //request header and body, header contains rules, body contains the data in a json
    res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS"); //methods allowed
    res.header("Access-Control-Allow-Headers","Content-Type"); //content type

    next();
});

//endpoints start here

//------------------------------------------------------
//use this endpoint to insert into mongo db
app.use("/api/posts", router);

//-------------------------------------------------------
//use this endpoint to delete iteams in mongo db with the id of the posts
app.use("/api/deletes", router);

//------------------------------------------------------
//get endpoint that returns hello
app.get('/api/hello', protectedRoute, function(req, res){
    res.send({
        msg: 'hello',
        content: 'You are using my api!'
    });
});

//-------------------------------------------------------
//post method
app.post('/api/new', function(req, res){
    let body = req.body;
    res.send({
        msg: 'hello',
        content: `user: ${body.username}`
    });
});

//-------------------------------------------------------------------
//put method that returns  the sum between two numbers
app.put('/addition', function(req, res){
    let body = req.body;
    let sum = body.num1 + body.num2;
    res.send({
        msg: `The result of ${body.num1} + ${body.num2} is:`,
        content: sum
    });
});

//--------------------------------------------------------
//delete nmethod
app.delete('/api/delete', function(req, res){
    let body = req.body;
    res.send({
        msg: `Successfully deleted!`,
        content: `You delete the element with id ${body.id}!`
    })
})


app.listen(port, function(){
    console.log('api is running!')
});