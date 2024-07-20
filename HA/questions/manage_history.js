"use strict";
// import fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';
// function solve_quotation_marks(st) {
//     var tmp = "";
//     for(var j = 0; j < st.length; j++) {
//         if(st[j] === '"' || st[j] === '\\') tmp += '\\';
//         tmp += st[j];
//     }
//     return tmp;
// }
export function Rpassed_ques(ques_id) {
    const messages = JSON.parse(readFileSync(`./HA/questions/${ques_id}/info.json`).toString());
    return messages;
}
export function Wpassed_ques(ques_id, msg) {
    console.log(ques_id);
    const messages = JSON.parse(readFileSync(`./HA/questions/${ques_id}/info.json`).toString());
    // console.log(msg);
    // for(var i = 0; i < msg.answer.length; i++) {
    //     msg.answer[i] = solve_quotation_marks(msg.answer[i]);
    // }
    messages.answer_list.push(msg);
    writeFileSync(`./HA/questions/${ques_id}/info.json`, JSON.stringify(messages));
}
export function Wpassed_extra_answers(ques_id, answer_id, msg) {
    console.log(ques_id);
    const messages = JSON.parse(readFileSync(`./HA/questions/${ques_id}/info.json`).toString());
    // console.log(msg);
    // for(var i = 0; i < msg.answer.length; i++) {
    //     msg.answer[i] = solve_quotation_marks(msg.answer[i]);
    // }
    messages.answer_list[answer_id - 1].extra_answer.push(msg);
    writeFileSync(`./HA/questions/${ques_id}/info.json`, JSON.stringify(messages));
}
