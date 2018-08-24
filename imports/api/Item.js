import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Inventories } from './Inventory.js'
import { Communities } from './Community.js'
const moment = require('moment')

export const Items = new Mongo.Collection('items');

Meteor.methods({
    'items.add'(itemInfo) {
        Items.insert(itemInfo)
        let data = {
            code: 0,

        }
        return data
    },

    'items.remove'(item_id) {
        Items.remove({ _id: item_id })
        let data = {
            code: 0,
        }
        return data
    },


    'getInventoryList'(platform_id) {
        const inventories = Inventories.find({ platform_id: platform_id }).fetch()
        return {
            code: 0,
            list: inventories
        }

    },

    'getCommunityList'(platform_id) {
        const communities = Communities.find({ platform_id: platform_id }).fetch()
        return {
            code: 0,
            list: communities
        }
    },

    // db.Items.aggregate(
    //     {$match:{name:"wbr"}},
    //     {$addFields:{"bankCards":{$filter:{
    //         input:"$bankCards",
    //         as:"bankCard",
    //         cond:{$eq:["$$bankCard.accountNo",1234]}
    //     }}}}
    // s)

    'getLeaderItemList'(platform_id, community_id) {
        const today = moment().format('YYYY-MM-DD')
        const items = Items.find(
            {
                platform_id: platform_id,
                communities: { $elemMatch: { _id: community_id } },
                close_date: { $gte: today }
            }).fetch()
        // console.log(items)
        for (let i = 0; i < items.length; i++) {
            items[i].communities = items[i].communities.filter(community => community._id == community_id)
        }

        return {
            code: 0,
            list: items
        }

    },

    'getSingleItem'(id, community_id) {
        const item = Items.findOne({ _id: id })
        item.communities = item.communities.filter(community => community._id == community_id)
        return {
            code: 0,
            item: item
        }
    }

})