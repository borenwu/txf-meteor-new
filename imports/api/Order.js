import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Inventories } from './Inventory.js'
import { Items } from './Item.js'
const moment = require('moment')


export const Orders = new Mongo.Collection('orders');

Meteor.methods({
    'orders.add'(orderInfo) {
        let inventory = Inventories.findOne({ _id: orderInfo.inventory_id })
        let orderAmount = parseFloat(orderInfo.num)
        let inventoryBalance = parseFloat(inventory.balance)
        if (orderAmount > inventoryBalance) {
            let data = {
                code: 2,
            }
            return data
        } else {
            orderInfo.sale_price = parseFloat(orderInfo.sale_price)
            orderInfo.morePrice = parseFloat(orderInfo.morePrice)
            let order_id = Orders.insert(orderInfo)

            let newBalance = inventoryBalance - orderAmount
            Inventories.update(inventory._id,{
                $set:{"balance":newBalance}
            })

            let order = Orders.findOne({ _id: order_id })
            let benefitRate = parseFloat(inventory.benefitRate)
            let sale = parseFloat(order.morePrice)
            let benefit = (sale * benefitRate).toFixed(2)
            let user = Meteor.users.findOne({ 'profile.platform_id': order.platform_id, 'profile.community_id': order.community_id })
            let newBenefit = (parseFloat(user.profile.benefit) + parseFloat(benefit)).toFixed(2)
            Meteor.users.update(user._id, {
                $set: { "profile.benefit": newBenefit }
            })
            let data = {
                code: 0,
                newBenefit: newBenefit
            }
            return data
        }


        // orderInfo.sale_price = parseFloat(orderInfo.sale_price)
        // orderInfo.morePrice = parseFloat(orderInfo.morePrice)
        // let order_id = Orders.insert(orderInfo)

        // let order = Orders.findOne({ _id: order_id })
        // let inventory = Inventories.findOne({ _id: order.inventory_id })

        // let inventoryBalance = parseFloat(inventory.balance)

        // let benefitRate = parseFloat(inventory.benefitRate)
        // let sale = parseFloat(order.morePrice)
        // let benefit = (sale * benefitRate).toFixed(2)
        // let user = Meteor.users.findOne({ 'profile.platform_id': order.platform_id, 'profile.community_id': order.community_id })
        // let newBenefit = (parseFloat(user.profile.benefit) + parseFloat(benefit)).toFixed(2)
        // Meteor.users.update(user._id, {
        //     $set: { "profile.benefit": newBenefit }
        // })
        // let data = {
        //     code: 0,
        //     newBenefit: newBenefit
        // }
        // return data
    },

    'order.finish'(order_id) {
        let order = Orders.findOne({ _id: order_id })

        if (order.deliver == false) {
            // let inventory = Inventories.findOne({ _id: order.inventory_id })
            // let benefitRate = parseFloat(inventory.benefitRate)
            // let sale = parseFloat(order.morePrice)
            // let benefit = (sale * benefitRate).toFixed(2)

            Orders.update(order_id, {
                $set: { deliver: true }
            })

            // let user = Meteor.users.findOne({ 'profile.platform_id': order.platform_id, 'profile.community_id': order.community_id })
            // let newBenefit = (parseFloat(user.profile.benefit) + parseFloat(benefit)).toFixed(2)
            // Meteor.users.update(user._id, {
            //     $set: { "profile.benefit": newBenefit }
            // })
            let data = {
                code: 0,
            }
            return data
        } else {
            let data = {
                code: 2
            }
            return data
        }
    },

    'getOrderList'(platform_id, query) {
        let orders = []
        let orderDate = query.orderDate
        let community_id = query.community_id
        if (community_id != '') {
            orders = Orders.find({ platform_id: platform_id, community_id: community_id, orderDate: orderDate }).fetch()
        } else {
            orders = Orders.find({ platform_id: platform_id, orderDate: orderDate }).fetch()
        }

        let data = {
            code: 0,
            list: orders
        }
        console.log(data)
        return data
    },

    'getMonthSoFarSales'(platform_id, community_id) {
        console.log(platform_id)
        const today = moment().format('YYYY-MM-DD')
        let thisMonth = moment().month()
        let thisYear = moment().year()
        const beginOfThisMonth = moment([thisYear, thisMonth]).format('YYYY-MM-DD')

        console.log(beginOfThisMonth)
        console.log(today)

        const aggQuery = [
            {
                $match: { "platform_id": platform_id, "community_id": community_id, "orderDate": { "$gte": beginOfThisMonth, "$lte": today } }
            },
            {
                $group: {
                    _id: "$platform_id",
                    total: { $sum: "$morePrice" },
                }
            }
        ]

        let result = Orders.aggregate(aggQuery);
        let data = {
            code: 0,
            result: result
        }
        return data

    },

    "getItemMonthStat"(platform_id, community_id) {
        const today = moment().format('YYYY-MM-DD')
        let thisMonth = moment().month()
        let thisYear = moment().year()
        const beginOfThisMonth = moment([thisYear, thisMonth]).format('YYYY-MM-DD')

        const aggQuery = [
            {
                $match: { "platform_id": platform_id, "community_id": community_id, "orderDate": { "$gte": beginOfThisMonth, "$lte": today } }
            },
            {
                $group: {
                    _id: "$item_title",
                    total: { $sum: "$num" },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]

        let result = Orders.aggregate(aggQuery);
        let data = {
            code: 0,
            result: result
        }
        return data
    },

    "getOrderId"(platform_id, item_title) {
        let id = Orders.findOne({ platform_id: platform_id, item_title: item_title })._id
        return id
    }

    // 'getCommunityList'(platform_id){
    //     const communities = Communities.find({ platform_id: platform_id }).fetch()
    //     return {
    //         code: 0,
    //         list: communities
    //     }
    // }
})