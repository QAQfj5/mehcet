"use strict"
import { readFileSync, writeFileSync } from 'fs';
import { stringify } from 'querystring';

export function get_user_info(user_id) {
    const info = JSON.parse(readFileSync(`./HA/user/${user_id}/info.json`).toString());
    return info;
}
export function modify_user_avatar(user_id, avatar) {
    writeFileSync(`./HA/user/${user_id}/avatar.jpg`, avatar);
}
export function modify_user_info(user_id, new_info) {
    const info = JSON.parse(readFileSync(`./HA/user/${user_id}/info.json`).toString());
    info.home_background = new_info.home_background;
    info.signature = new_info.signature;
    writeFileSync(`./HA/user/${user_id}/info.json`, JSON.stringify(info));
}