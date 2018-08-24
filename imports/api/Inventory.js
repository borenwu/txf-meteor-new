import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Inventories = new Mongo.Collection('inventories');

Meteor.methods({
    'inventories.add'(inventoryInfo) {
        Inventories.insert(inventoryInfo)
        let data = {
            code: 0,
        }
        return data
    },
    'inventories.remove'(inventory_id) {
        Inventories.remove({ _id: inventory_id })
        let data = {
            code: 0,
            status:'1'
        }
        return data
    },
    'inventories.update'(inventoryInfo) {
        let inventory_id = inventoryInfo.id
        Inventories.update(inventory_id, {
            $set: {
                name: inventoryInfo.name,
                origin: inventoryInfo.origin,
                category: inventoryInfo.category,
                description: inventoryInfo.description,
                unit: inventoryInfo.unit,
                balance: inventoryInfo.balance,
                benefitRate:inventoryInfo.benefitRate
            }
        })
        let data = {
            code: 0,

        }
        return data
    },

    'getInventoryBalance'(inventory_id){

    }

})