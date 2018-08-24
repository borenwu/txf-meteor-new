import './clientorders.html'
import './clientorders.css'
import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'
import {Inventories} from "../../../api/Inventory";
import {Orders} from "../../../api/Order";
import {Items} from "../../../api/Item";

Template.ClientOrders.onCreated(function () {
    this.autorun(() => {
        let platform_id = FlowRouter.getParam('platform')
        let community_id = FlowRouter.getParam('community_id')
        this.subscribe('orders.leader',platform_id,community_id)
    });
})

Template.ClientOrders.events({

})

Template.ClientOrders.helpers({
    orders() {
        let orders = Orders.find({},{sort: {orderDate: -1,"wechatUser.nickName":1}},{limit:50}).fetch()
        orders.forEach(order=>{
            order.wechatUserName = order.wechatUser.nickName
            order.wechatUserImage = order.wechatUser.avatarUrl
        })
        return orders
    },
    // itemTitle(){
    //     return FlowRouter.getQueryParam("title");
    // },
    // inventoryBalance(){
    //     let id = FlowRouter.getParam('id')
    //     let item = Items.findOne({_id:id})
    //     if(item){
    //         let inventory_id = item.inventory_id
    //         let inventory = Inventories.findOne({_id:inventory_id})
    //         if(inventory){
    //             return inventory.balance
    //         }
    //     }
    // },
    // sum(){
    //     let orders = Orders.find().fetch()
    //     let sum = 0
    //     orders.forEach(item=>{
    //         sum = sum + item.total
    //     })
    //     return sum
    // }
});
