import './leaderboard.html'
import './leaderboard.css'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Items } from '../../../api/Item'

Template.LeaderBoard.onCreated(function () {
    this.autorun(() => {
        let platform_id = FlowRouter.getParam('platform')
        let community_id = FlowRouter.getParam('community_id')
        let leader_id = FlowRouter.getParam('leader_id')

        console.log(platform_id)
        console.log(community_id)

        this.subscribe('items.leader',platform_id,community_id)
        this.subscribe('leader.me',leader_id)
    });
})

Template.LeaderBoard.events({

})


Template.LeaderBoard.helpers({
    items() {
        let items = Items.find().fetch()
        items.forEach(item=>{
            item.thumb = item.inventory_thumbs[0].url
        })
        return items;
    },
    benefit(){
        let leader_id = FlowRouter.getParam('leader_id')
        let user = Meteor.users.findOne({_id:leader_id})
        if(user){
            let profile = user.profile
            if(profile){
                return profile.benefit
            }
        }    
    }
});
