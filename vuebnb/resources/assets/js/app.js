import Vue from 'vue';

import ListingPage from '../components/ListingPage.vue';

var app = new Vue({
    el: '#app',
    render: h => h(ListingPage),
});