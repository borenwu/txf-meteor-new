import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Communities = new Mongo.Collection('communities');

Meteor.methods({
    'communities.add'(communityInfo){
        Communities.insert(communityInfo)
        let data = {
            code: 0,

        }
        return data
    },
    'communities.remove'(community_id){
        Communities.remove({ _id: community_id })
        let data = {
            code: 0,

        }
        return data
    },
    'communities.update'(communityInfo) {
        let community_id = communityInfo.id
        Communities.update(community_id, {
            $set: {
                name: communityInfo.name,
                province: communityInfo.province,
                city: communityInfo.city,
                description: communityInfo.description,
            }
        })
        let data = {
            code: 0,

        }
        return data
    }
    
})