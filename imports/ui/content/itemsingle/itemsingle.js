import { Template } from 'meteor/templating';
import './itemsingle.html'
import './itemsingle.css'
import { Orders } from '../../../api/Order'
import {Items} from '../../../api/Item'
import {Inventories} from '../../../api/Inventory'

Template.ItemSingle.onCreated(function () {
    console.log('created')
    let platform_id = FlowRouter.getParam('platform_id')
    let id = FlowRouter.getParam('id')
    // console.log(platform_id)
    // console.log(id)
    this.autorun(() => {
        this.subscribe('orders.admin', platform_id, id);
        this.subscribe('inventories.all',platform_id)
        this.subscribe('items.all',platform_id)
    });
    // Meteor.call('')
    // Meteor.subscribe('orders.admin', platform_id, id)
})

Template.ItemSingle.events({
    'click .back-btn'(event) {
        let platform_id = FlowRouter.getParam('platform_id')
        FlowRouter.go(`/${platform_id}`);
    }
});

Template.ItemSingle.helpers({
    orders() {
        return Orders.find();
    },
    itemTitle(){
        return FlowRouter.getQueryParam("title");
    },
    inventoryBalance(){
        let id = FlowRouter.getParam('id')
        let item = Items.findOne({_id:id})
        if(item){
            let inventory_id = item.inventory_id
            let inventory = Inventories.findOne({_id:inventory_id})
            if(inventory){
                return inventory.balance
            }   
        }
    },
    sum(){
        let orders = Orders.find().fetch()
        let sum = 0
        orders.forEach(item=>{
            sum = sum + item.total
        })
        return sum
    }
});

