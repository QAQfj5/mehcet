"use strict";
const express = require('express');
// const jquery = require('jquery');
const app = express();
const cors = require('cors');
const path = require('path');
app.use(cors());
app.use(require('cookie-parser')());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { readFileSync } = require('fs');


const Files = JSON.parse(readFileSync('./HA/PATHS.json').toString());
//app.get('/HA/style.css', (req, res) => { res.sendFile('HA/style.css', {root: path.join(__dirname)},err=>{});});
app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    else return next();
});
for(let file of Files) app.get(file.path, (req, res) => { res.sendFile(file.from, {root: path.join(__dirname)},err=>{});}); // send
const user_login = require('./HA/login.js');
// console.log(1);
app.post('/api/login', (req, res) => {
    // console.log("!!!");
    const { name, password } = req.body;
    console.log(name,password);
    var ret = user_login(name, password);
    // console.log(ret);
    if(ret == 1) {
        res.redirect(`/`);
    }
    else if(ret == 2) {
        document.getElementById("login").text = "sb, sb";
    }
    else if(ret == 3){
        document.getElementById("login").text = "sb, ";
    }

});
var server = app.listen(3000, () => {
    console.log(`Port ${server.address().port} is opened`);
});
