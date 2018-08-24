const moment = require('moment')
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Items } from '../../../api/Item'
import './itemlist.html'
import './itemlist.css'

Template.ItemList.rendered = function () {
    $('.my-datepicker').datepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        console.log(e.date)
        console.log(moment(e.date).format('YYYY-MM-DD'))
    });;

}

Template.ItemList.onCreated(function () {
    let platform_id = FlowRouter.getParam('platform')
    this.autorun(() => {
        this.subscribe('items.onShow', platform_id)
    });
})

Template.ItemList.events({

});

Template.ItemList.helpers({
    items() {
        let items = Items.find().fetch()
        items.forEach(item=>{
            item.thumb = item.inventory_thumbs[0].url
        })
        return items;
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});


