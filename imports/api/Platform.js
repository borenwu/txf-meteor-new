import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base'

export const Platforms = new Mongo.Collection('platforms');

// JsonRoutes.add("post", '/meteor/platformRegister', function (req, res, next) {
//     let platform_name = req.params.platform_name
//     let province = req.params.province
//     let city = req.params.city
//     let description = req.params.description
//     let platform = Platforms.findOne({ platform_name: platform_name })
//     if (platform) {
//         let data = {
//             code: -1,
//             msg: '平台已经存在'
//         }
//         JsonRoutes.sendResult(res, {
//             data: data
//         });
//     } else {
//         let secret = '1234'
//         const platform_id = Platforms.insert({
//             platform_name: platform_name,
//             province: province,
//             city: city,
//             description: description,
//             secret: secret
//         })
//         let userInfo = {
//             username: `${platform_name}` + 'admin',
//             password: 'admin',
//             profile: {
//                 platform_id: platform_id,
//                 platform_name: platform_name,
//                 role: 'admin'
//             }
//         }
//         Accounts.createUser(userInfo)
//         let data = {
//             code: 0,
//             msg: '平台注册完成'
//         }
//         JsonRoutes.sendResult(res, {
//             data: data
//         });
//     }
// })

Meteor.methods({
    'platforms.add'(platformInfo) {
        Platforms.insert({

        })
    },
    'platforms.remove'(platformInfo) {

    },

    'platformRegiste'(data) {
        let platform_name = data.platform_name
        let province = data.province
        let city = data.city
        let description = data.description
        let platform = Platforms.findOne({ platform_name: platform_name })
        if (platform) {
            let data = {
                code: -1,
                msg: '平台已经存在'
            }
            return data
        } else {
            let secret = '1234'
            const platform_id = Platforms.insert({
                platform_name: platform_name,
                province: province,
                city: city,
                description: description,
                secret: secret
            })
            let userInfo = {
                username: `${platform_name}` + 'admin',
                password: 'admin',
                profile: {
                    platform_id: platform_id,
                    platform_name: platform_name,
                    role: 'admin'
                }
            }
            Accounts.createUser(userInfo)
            let data = {
                code: 0,
                msg: '平台注册完成'
            }
            return data
        }
    },

    'platforms.signin'(platformInfo) {
        // platform_name: '淘鲜蜂', secret: '1234'
        console.log(platformInfo)
        let platform_name = platformInfo.platform_name
        let secret = platformInfo.secret
        let platform = Platforms.findOne({ platform_name: platform_name, secret: secret })
        console.log(platform)
        if (platform) {
            let data = {
                code: 0,
                platform: platform
            }
            return data
        }
        else {
            let data = {
                code: -1
            }
            return data
        }
    },

})
