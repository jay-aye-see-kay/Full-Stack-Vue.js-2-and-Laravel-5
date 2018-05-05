import Vue from 'vue';
import { populateAmenitiesAndPrices } from './helpers';

import "core-js/fn/object/assign";

import ImageCarousel from '../components/ImageCarousel.vue';
import ModalWindow from '../components/ModalWindow.vue';
import HeaderImage from '../components/HeaderImage.vue';

let model = JSON.parse(window.vuebnb_listing_model);
model = populateAmenitiesAndPrices(model);

var app = new Vue({
    el: '#app',
    data: Object.assign(model, {
        contracted: true,
    }),
    methods: {
        openModal() {
            this.$refs.imagemodal.modalOpen = true;
        }
    },
    components: {
        ImageCarousel,
        ModalWindow,
        HeaderImage,
    }
});