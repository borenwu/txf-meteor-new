import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

const userMap = {
    admin: {
        roles: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'adminAdmin'
    },
    leader: {
        roles: ['leader'],
        token: 'leader',
        introduction: '我是社区团长',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}


Meteor.methods({
    // Server method 
    'loginUser'(data) {
        console.log(data)
        //find user if exist from paramter email
        let user = Meteor.users.findOne({
            'username': data.username
        });

        //if user is found
        if (user) {
            //get paramter password
            let password = data.password;
            //authenticate user
            let result = Accounts._checkPassword(user, password);
            if (result.error) {
                return result.error;
            } else {
                let role = user.profile.role
                return userMap[role]
            }
        } else {
            //if user is not found
            return {
                error: "user not found"
            }
        }
    },

    'getUserInfo'(data) {
        if (userMap[data.token]) {
            return userMap[data.token]
        } else {
            return false
        }
    },

    'leaders.add'(leaderInfo){ 
        let userInfo = {
            username: leaderInfo.username,
            password: leaderInfo.password,
            
            profile: {
                platform_id: leaderInfo.platform_id,
                community_id:leaderInfo.community_id,
                platform_name: leaderInfo.platform_name,
                community_name:leaderInfo.community_name,
                pickups:leaderInfo.pickups,
                role: 'leader',   
                benefit: '0.00',           
            }
        }
        console.log(userInfo)
        Accounts.createUser(userInfo)
        let data = {
            code: 0,

        }
        return data
    },
    'leaders.remove'(leader_id){
        Meteor.users.remove({ _id: leader_id })
        let data = {
            code: 0,
        }
        return data
    },
    'leaders.update'(leaderInfo) {
        let leader_id = leaderInfo.id
        Meteor.users.update(leader_id, {
            $set: {
                "username": leaderInfo.username,
                "profile.benefit": parseFloat(leaderInfo.benefit)
            }
        })
        let data = {
            code: 0,

        }
        return data
    },
    'leader.benefit'(leader_id){
        let user = Meteor.users.findOne({_id:leader_id})
        let data = {
            code:0,
            benefit:user.profile.benefit
        }
        return data
    }
})
