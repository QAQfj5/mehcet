"use strict";
const { readFileSync, writeFileSync } = require('fs');
const {
  pbkdf2Sync,
} = require('crypto');
var usercnt=0,MyId=0;
function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for (var i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
//返回值：
//1 登录成功
//2 用户存在，但密码错误
//3 注册成功
//使用这个函数需要建一个users.json
//登录成功或注册成功后MyId会变为当前用户的Id
function user_login(nam,psw)
{
	// console.log("????");
	const Users = JSON.parse(readFileSync('./HA/users.json').toString());
	// console.log("AWA!!!!");
	// MyId = Users.size();
	for(let user of Users)
  		if(user.name === nam)
  		{
  			if(user.password==pbkdf2Sync(psw,user.salt,100000,64,'sha512').toString('hex'))
  			{
  				MyId=user.id;
  				return 1;
  			}
  			else return 2;
  		}
  	// var chiyoyi=randomString(100);
	// Users.push({
	//   name: nam,
	//   password: pbkdf2Sync(psw,chiyoyi,100000,64,'sha512').toString('hex'),
	//   salt:chiyoyi,
	//   id: usercnt,
	// });
	// MyId=usercnt;
	// writeFileSync('./HA/users.json', JSON.stringify(Users));
  	// usercnt+=1;
	return 3;
}

module.exports = user_login;