import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
import { Accounts } from 'meteor/accounts-base'
import './publish'

Meteor.startup(() => {
  

  JsonRoutes.setResponseHeaders({
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With,X-Token',
  });
});
