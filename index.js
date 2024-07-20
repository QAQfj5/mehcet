"use strict";
//#region head
import express from 'express';
import { createServer } from 'http';

// import 'editor.md';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static('node_modules'));
import WebSocket from 'websocket';
import path from 'path';
import cors from 'cors';
app.use(cors());
import cookie_parser from 'cookie-parser';
app.use(cookie_parser());
import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import fs from 'fs';
const { readFileSync } = fs;
//#endregion

//#region sendFile
app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    else return next();
});
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/article/", (req, res) => {
    // console.log(req.cookies.usraccess);
    console.log(req.query.name)
    res.send(req.query.name);
}); // send
app.get("/", (req, res) => {
    // console.log(req.cookies.usraccess);
    res.sendFile(__dirname + '/HA/main.html');
}); // send


import { calc_user_page, calc_question_page, calc_question_list_page, calc_article_page} from './server/calc_pages.js';
// calc_question_list_page();
app.get("/user/:user_id/article/:Filename", (req, res) => { 
    console.log(req.params.user_id, req.params.Filename);
    var str = calc_article_page(req.params.user_id, req.params.Filename);
    res.send(str);
}); // send
app.get("/user/:Filename", (req, res) => { 
    res.sendFile(__dirname + '/HA/user/' + req.params.Filename);
    console.log("/user/Filename");
}); // send
app.get("/user/:usrname", (req, res) => { 
    // console.log(req.params.usrname);
    // var str = calc_user_page(req.params.usrname);
    // res.send(str);
    res.sendFile(__dirname + '/HA/user_page_template.html');
    console.log("/user/usrname");
}); // send
app.get("/user/:usrname/setting", (req, res) => {
    res.sendFile(__dirname + '/HA/user_setting_template.html');
}); // send
app.get("/questions/:Filename", (req, res) => { res.sendFile(__dirname + '/HA/questions/' + req.params.Filename); }); // send
app.get("/questions/:question_id", (req, res) => { res.sendFile(__dirname + '/HA/question_page_template.html');}); // send
app.get("/questions", (req, res) => { res.send(calc_question_list_page());}); // send
app.get("/avatar/:usrid", (req, res) => { res.sendFile(__dirname + "/HA/user/" + req.params.usrid + "/avatar.jpg"); }); // send
app.get("/fonts/:Filename", (req, res) => { res.sendFile(__dirname + '/HA/fonts/' + req.params.Filename); }); // send
app.get("/lib/:Filename", (req, res) => { res.sendFile(__dirname + '/lib/' + req.params.Filename); }); // send
app.get("/lib/fonts/:Filename", (req, res) => { res.sendFile(__dirname + '/lib/fonts/' + req.params.Filename); }); // send

app.get("/:Filename", (req, res) => {
    if(fs.existsSync(__dirname + '/HA/' + req.params.Filename)) res.sendFile(__dirname + '/HA/' + req.params.Filename);
    else if(fs.existsSync(__dirname + '/' + req.params.Filename)) res.sendFile(__dirname + '/' + req.params.Filename);
    else if(fs.existsSync(__dirname + '/rubbish/' + req.params.Filename)) res.sendFile(__dirname + '/rubbish/' + req.params.Filename);
    else res.send('<center><h1>File Not Found</h1></center><hr>');
}); // send
import { user_login } from './server/register.js';
import { user_register } from './server/register.js';
// import { calc } from './HA/userpage.js';
//#endregion

//#region login & register
app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    // console.log(name, password);
    var ret = user_login(name, password);
    console.log(ret);
    if(ret == -1) {
        res.redirect('/error.html');
    } else if(ret == -2) {
        res.redirect('/error.html');
    } else if(ret == -3) {
        res.redirect('/error.html');
    } else {
        res.cookie("IsLogin", ret);
        res.redirect(`/`);
    }
});
app.post('/api/register', (req, res) => {
    const { name, password } = req.body;
    var ret = user_register(name, password);
    console.log(["failed", "succeeded"][ret]);
    if (ret) {
        res.redirect(`/login.html`);
    }
    else {
        res.redirect('/error.html');
    }
});
//#endregion

//#region interaction
import { Wpassed_message, Rpassed_message } from './server/manage_history_message.js';
import { Wpassed_ques, Rpassed_ques, Wpassed_extra_answers } from './HA/questions/manage_history.js';
import { new_question } from './HA/questions/mknew.js';
import { get_user_info, modify_user_avatar, modify_user_info } from './HA/user/manage_user.js';
import { modify_article, read_article, make_new_article, remove_article} from './server/manage_user_article.js';
io.on('connection', (socket) => {
    // console.log(socket.id);
    console.log(socket.id);
    socket.on('passed message', (id) => {
        io.emit('passed message', id, Rpassed_message());
    });
    socket.on('passed ques and answer', (id, ques_id) => {
        io.emit('passed ques and answer', id, Rpassed_ques(ques_id));
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        Wpassed_message(msg);
    });

    socket.on('answer message', (ques_id, msg) => {
        console.log("answer message", msg);
        io.emit('answer message', socket.id, msg);
        Wpassed_ques(ques_id, msg);
    });
    socket.on('extra answer message', (ques_id, object, msg) => {
        console.log(object, msg);
        io.emit('extra answer message', socket.id, object, msg);
        Wpassed_extra_answers(ques_id, object, msg);
    });
    socket.on('ques', (ques) => {
        console.log(ques);
        var ret = new_question(ques);
        console.log(ret);
        io.emit('ques', socket.id, ret);
    });
    socket.on('get user info', (user_id) =>{
        if(user_id === null) return;
        io.emit('user info', socket.id, get_user_info(user_id));
    });
    socket.on('save article', (user_id, article, jumping) => {
        console.log("save");
        console.log(article);
        var ret = modify_article(user_id, article);
        if(ret === -1) io.emit('article err', socket.id, "there is an article which had the same id as this article.");
        else if(ret === -2) io.emit('article err', socket.id, "cnm, 谁让你把id搞成这个鸟样的？/fn");
        else if(ret === -3) io.emit('article err', socket.id, "你怎么 path 里有空文件夹？")
        else if(jumping) io.emit('save article finished', socket.id);
    });
    socket.on('release article', (user_id, article) => {
        // var ret = modify_article(user_id, article);
        // if(ret === -1) io.emit('article err', socket.id, "there is an article which had the same id as this article.");
        // else if(ret === -2) io.emit('article err', socket.id, "cnm, 谁让你把id搞成这个鸟样的？/fn");
        // else if(ret === -3) io.emit('article err', socket.id, "你怎么 path 里有空文件夹？")
        io.emit('released', socket.id, article.id);
    });
    socket.on('delete article', (user_id, article_id) => {
        // modify_user_info(user_id, info);
        if(remove_article(user_id, article_id) === -1) io.emit('article err', socket.id, "文章已删除。");
        else io.emit('delete article finished', socket.id);
    });
    socket.on('get article', (user_id, article_id) => {
        const article = read_article(user_id, article_id);
        io.emit('article', socket.id, article);
    });
    socket.on('get user files info', (user_id) => {
        var idx = JSON.parse(readFileSync(`./HA/user/${user_id}/article/article_idx.json`).toString());
        var dir = JSON.parse(readFileSync(`./HA/user/${user_id}/article/article_dir.json`).toString());
        io.emit('user files info', socket.id, dir, idx);
    });
    socket.on('modify user avatar', (user_id, avatar) => {
        modify_user_avatar(user_id, avatar);
        io.emit('modify user avatar finished', socket.id);
    });
    socket.on('modify user info', (user_id, info) => {
        modify_user_info(user_id, info);
        io.emit('modify user info finished', socket.id);
    });
    // socket.on('create article', (user_id) => {
    //     io.emit("new article id", socket.id, make_new_article(user_id));
    // });
});
//#endregion

server.listen(3000, () => {
    console.log(`Port 3000 is opened`);
});


//#region  神秘读入
// import {createInterface} from 'readline';

// const rl = createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// import { WriteAllUsr } from './HA/register.js';

// rl.question(name => {console.log("jin");
//     if(name === `poweroff`)  WriteAllUsr();
//     rl.close();
// });
//#endregion
