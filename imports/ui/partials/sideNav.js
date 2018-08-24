import {Template} from 'meteor/templating';
import './sideNav.html'
import './sideNav.css'

Template.SideNav.rendered = function () {
    $('.sidenav').sidenav();
}
