import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const CashLogs = new Mongo.Collection('cashlogs');

Meteor.methods({
    'cashlogs.add'(log) {
        log.status = false
        let user = Meteor.users.findOne({_id:log.userID})
        let benefit = parseFloat(user.profile.benefit)
        let cashBenefit = parseFloat(log.cashBenefit)
        if(cashBenefit != 0){
            if(benefit >= cashBenefit){
                let newBenefit = (benefit - cashBenefit).toFixed(2)
                Meteor.users.update(user._id, {
                    $set: { "profile.benefit": newBenefit }
                })
    
                let logID = CashLogs.insert(log)
                let data = {
                    code: 0,
                    logID: logID
                }
                return data
            }        
        }else{
            let data = {
                code: 2,
            }
            return data
        }
        
    },

    'cashlogs.confirm'(){

    },

    'cashlogs.findCurrent'(logID) {
        let log = CashLogs.findOne({ _id: logID })
        let data = {
            code: 0,
            log: log
        }
        return data
    },

    'getCashLogs'(platform_id, query) {
        let logDate = query.logDate
        let logs = CashLogs.find({ platform_id: platform_id, logDate: logDate }).fetch()
        let data = {
            code: 0,
            list: logs
        }
        return data
    }
})