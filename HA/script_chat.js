"use strict";
var chat_lock = 0, input_click = 0;
var chatboxstyle=[{width: `0`, backgroundColor: `rgba(255, 255, 255, 0.1)`, display: `none`}, {width: `15em`, backgroundColor: `rgba(255, 255, 255, 0.85)`, display: `block`}];
function open(tweaks) { // 0: close, 1: open
	document.getElementById("div_chat").style.width = chatboxstyle[tweaks].width;
	document.getElementById("div_chat").style.backgroundColor = chatboxstyle[tweaks].backgroundColor;
	document.getElementById("left_box_input").style.display = chatboxstyle[tweaks].display;
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
})