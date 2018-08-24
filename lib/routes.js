import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'


FlowRouter.route('/:platform', {
    name: 'item-list',
    action() {
        BlazeLayout.render('MainLayout',{main:'ItemList'});
    }
});

FlowRouter.route('/:platform/:community_id', {
    name: 'client-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'ClientOrders' });
    }
});

FlowRouter.route('/leader/:platform/:community_id/:leader_id', {
    name: 'leader-board',
    action() {
        BlazeLayout.render('MainLayout', { main: 'LeaderBoard' });
    }
});

FlowRouter.route('/item-list/:platform_id/:id', {
    name: 'order-single',
    action() {
        BlazeLayout.render('MainLayout', { main: 'ItemSingle' });
    }
});







