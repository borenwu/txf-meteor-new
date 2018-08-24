import {Template} from 'meteor/templating';
import './header.html'
import './header.css'

Template.Header.rendered = function () {
    // console.log('header rendered')
    // $('.sidenav').sidenav();
}



Template.Header.onCreated(function () {

})