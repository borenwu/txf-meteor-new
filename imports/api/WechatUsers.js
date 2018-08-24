import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const WechatUsers = new Mongo.Collection('wechatusers');

Meteor.methods({
    'wechatusers.insert'(userInfo) {
        let openid = userInfo.openid
        let wechat_user = WechatUsers.findOne({ openid: openid })
        if (wechat_user) {
            let data = {
                code: 0,
            }
            return data
        } else {
            WechatUsers.insert(userInfo)
            let data = {
                code: 0,
            }
            return data
        }
    }
})
