import {Meteor} from 'meteor/meteor'
import {Platforms} from '../imports/api/Platform.js'
import {Inventories} from '../imports/api/Inventory.js'
import {Items} from '../imports/api/Item.js'
import {Orders} from '../imports/api/Order'
import {Communities} from '../imports/api/Community.js'
import {WechatUsers} from '../imports/api/WechatUsers.js'
import {CashLogs} from '../imports/api/CashLogs.js'
import '../imports/api/User.js'
import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';

const moment = require('moment')

Meteor.publish('platforms', function () {
    return Platforms.find({})
})

Meteor.publish('inventories.all', function (platform_id) {
    return Inventories.find({platform_id: platform_id})
})

Meteor.publish('communitis.all', function (platform_id) {
    return Communities.find({platform_id: platform_id})
})

Meteor.publish('leaders.all', function (platform_id) {
    return Meteor.users.find({"profile.platform_id": platform_id, "profile.role": "leader"})
})

Meteor.publish('items.all', function (platform_id) {
    return Items.find({platform_id: platform_id})
})

Meteor.publish('items.onShow', function (platform_id) {
    const threshold = moment().subtract(3, 'days').format('YYYY-MM-DD')
    return Items.find({platform_id: platform_id, close_date: {$gte: threshold}}, {sort: {open_date: -1}})
})

Meteor.publish('items.leader', function (platform_id, community_id) {
    const threshold = moment().subtract(7, 'days').format('YYYY-MM-DD')
    return Items.find({
        platform_id: platform_id,
        close_date: {$gte: threshold},
        communities: {$elemMatch: {_id: community_id}}
    }, {fields: {communities: 0}})
})

Meteor.publish('items.single', function (id) {
    return Items.find({_id: id}, {fields: {communities: 0}})
})

Meteor.publish('orders.leader', function (platform_id, community_id) {
    return Orders.find({platform_id: platform_id, community_id: community_id}, {sort: {orderDate: -1,"wechatUser.nickName":1}},{limit:50})
})

Meteor.publish('orders.all', function (platform_id, query) {
    let orderDate = query.orderDate
    return Orders.find({platform_id: platform_id, orderDate: orderDate}, {sort: {orderDate: -1}})
})

Meteor.publish('orders.admin', function (platform_id, item_id) {
    // const today = moment().format('YYYY-MM-DD')
    // let itemIds = []
    // let items = Items.find({ platform_id: platform_id, close_date: { $gte: today } }, { fields: { _id: 1 } }).fetch()
    // items.forEach(item => {
    //     itemIds.push(item._id)
    // })
    // return Orders.find({ platform_id: platform_id, item_id: { $in: itemIds } })
    const aggQuery = [
        {
            $match: {"platform_id": platform_id, "item_id": item_id}
        },
        {
            $group: {
                _id: "$community_name",
                total: {$sum: "$num"},
            }
        },

        {
            $sort: {_id: 1}
        },

    ]

    ReactiveAggregate(this, Orders, aggQuery)
    console.log(ReactiveAggregate(this, Orders, aggQuery))
})

Meteor.publish('leader.me',function(leader_id){
    return Meteor.users.find({_id:leader_id})
})


// db.Items.aggregate(
//     {$match:{name:"wbr"}},
//     {$addFields:{"bankCards":{$filter:{
//         input:"$bankCards",
//         as:"bankCard",
//         cond:{$eq:["$$bankCard.accountNo",1234]}
//     }}}}
// s)