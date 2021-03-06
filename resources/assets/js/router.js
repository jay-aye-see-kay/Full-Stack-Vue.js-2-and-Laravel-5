import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import store from './store';

import ListingPage from '../components/ListingPage.vue';
import HomePage from '../components/HomePage.vue';
import SavedPage from '../components/SavedPage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';

Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [{
            name: 'home',
            path: '/',
            component: HomePage,
        }, {
            name: 'listing',
            path: '/listing/:listing',
            component: ListingPage,
        }, {
            name: 'saved',
            path: '/saved',
            component: SavedPage,
        }, {
            name: 'login',
            path: '/login',
            component: LoginPage,
        },
        {
            name: 'register',
            path: '/register',
            component: RegisterPage
        }
    ]
});

router.beforeEach((to, from, next) => {
    let serverData = JSON.parse(window.vuebnb_server_data);
    if (to.name === 'listing' ?
        store.getters.getListing(to.params.listing) :
        store.state.listing_summaries.length > 0 ||
        to.name === 'login' ||
        to.name === 'register'
    ) {
        next();
    } else if (!serverData.path || to.path !== serverData.path) {
        axios.get(`/api${to.path}`).then(({ data }) => {
            store.commit('addData', { route: to.name, data });
            next();
        })
    } else {
        store.commit('addData', { route: to.name, data: serverData });
        serverData.saved.forEach(id => store.commit('toggleSaved', id));
        next();
    }
})


export default router;