"use strict";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { stringify } from 'querystring';
var cnt = JSON.parse(readFileSync('./HA/questions/cnt_questions.json').toString());
var idx = JSON.parse(readFileSync('./HA/questions/questions_idx.json').toString());
// console.log
function solve_quotation_marks(st) {
    var tmp = "";
    for(var j = 0; j < st.length; j++) {
        if(st[j] === '"' || st[j] === '\\') tmp += '\\';
        tmp += st[j];
    }
    return tmp;
}
export function new_question(ques) {
    // var ns = ques.main.split('\n');
    idx.push({id: ques.id, title: ques.title})
            // ques.title = solve_quotation_marks(ques.title);
    // for(var i = 0; i < ns.length; i++) ns[i] = solve_quotation_marks(ns[i]);
    // for(var i = 0; i < ns.length; i++) ns[i] = `"${ns[i]}"`;
    mkdirSync('./HA/questions/' + cnt + '/');
    var ques = {
        id: ques.id,
        title: ques.title,
        main: ques.main,
        time: ques.time,
        answer_list: []
    }
    appendFileSync(`./HA/questions/${cnt}/info.json`, JSON.stringify(ques));
    cnt += 1;
    // appendFileSync(`./HA/questions/${cnt}/main.txt`, ques.main);
    writeFileSync('./HA/questions/questions_idx.json', JSON.stringify(idx));
    writeFileSync('./HA/questions/cnt_questions.json', JSON.stringify(cnt));
    return cnt - 1;
}
