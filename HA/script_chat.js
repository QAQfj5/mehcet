"use strict";
var chat_lock = 0, input_click = 0;
var chatboxstyle=[{width: `0`, backgroundColor: `rgba(255, 255, 255, 0.1)`, display: `none`}, {width: `15em`, backgroundColor: `rgba(255, 255, 255, 0.85)`, display: `block`}];
function open(tweaks) { // 0: close, 1: open
	document.getElementById("div_chat").style.width = chatboxstyle[tweaks].width;
	document.getElementById("div_chat").style.backgroundColor = chatboxstyle[tweaks].backgroundColor;
	// document.getElementById("left_box_input").style.display = chatboxstyle[tweaks].display;
	// document.getElementById("messages").style.display = chatboxstyle[tweaks].display;
	document.getElementById("div_left_hidden").style.display = chatboxstyle[tweaks].display;
	// style.display = chatboxstyle[tweaks].display;
}
function switchlock(change)
{
	chat_lock ^= change;
	open(chat_lock);
}
var typin = false;
$(document).ready(() => {
	open(0 | chat_lock);
	$("#div_chat").hover(() => open(1 | chat_lock), () => open(0 | chat_lock));
	// $(document).keydown(function (event) { 
	// 	if (event.keyCode === 84) switchlock(1);
	// });
	document.getElementById("div_chat").onclick = () => {
		if(chat_lock && input_click == 0) switchlock(1);
		input_click = 0;
	};
	document.getElementById("left_box_input").onclick = () => {
		// console.log(`click 2————${chat_lock}`);
		chat_lock = 1;
		input_click = 1;
		open(1);
	};
	$("#islogin").hover( () => {
		if($.cookie("IsLogin") === undefined) return;
		document.getElementById("islogin").style.height = "13.5%";
		document.getElementById("direction").style.display = "block";
		// document.getElementById("dirction").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
	}, () => {
		if($.cookie("IsLogin") === undefined) return;
		// if($.cookie("IsLogin") === undefined) {
		// 	// document.getElementById("islogin").style.width = "2.5em";
		// } else {
			document.getElementById("islogin").style.height = "48px";
		// document.getElementById("dirction").style.backgroundColor = "rgba(255, 255, 255, 0.85)";
			document.getElementById("direction").style.display = "none";
		// }

	});
	// $("#islogin").hover( () => {
	// 	console.log(114514);
	// 	// document.getElementById("dirction").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
	// 	document.getElementById("dirction").style.display = "block";
	// }, () => {
	// 	// document.getElementById("dirction").style.backgroundColor = "rgba(255, 255, 255, 0.85)";
	// 	document.getElementById("dirction").style.display = "none";
	// });
})