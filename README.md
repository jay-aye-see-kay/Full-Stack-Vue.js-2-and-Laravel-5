# About
I'm using this readme file to keep my notes from the book Fullstack Vuejs and Laravel.

## Table of Contents
* [Chapter 1](#chapter-1) - Just intro stuff, nothing interesting
* [Chapter 2](#chapter-2) - Basic functionality of Vue
* [Chapter 3](#chapter-3) - Setting up Laravel
* [Chapter 4](#chapter-4) - Make a simple web service
* [Chapter 5](#chapter-5) - Webpack
* [Chapter 6](#chapter-6) - Vue components
* [Chapter 7](#chapter-7) - Vue router
* [Chapter 8](#chapter-8) - Managing state with Vuex
* [Chapter 9](#chapter-9) - API auth with passport

# Chapter 1

Introducton to Vue and the two important (and officially support packages) Vuex and Vue-router. Some basic examples and descriptions of basic functionality. 

* Directives are how we add functionality, they start with v-
* Reactivity is a key function of Vue, it automatically updates the page based on it's data.
* Components are a way to extend html syntax and create custom 'html tags' or components
* Single file components put all logic, configuration, and styles in one file. The disadvange is that it requires a bundler (like webpack), so may not be worth it on small or legacy projects.

## Vue ecosystem
* Vue Devtools - browser extension that shows current vue state
* Vue Router - map different states of the SPA to urls to create virtual pages, doesn't trigger page reload so very fast
* Vuex - a central store of application data, essential for anything complex

## Case study project - Vuebnb
During the book we build mock marketplace like Airbnb, where users can look through a list of accomodation options, and can look at a single listing page with more details.

## Code base
The starter code for this project is here: https://github.com/PacktPublishing/Full-Stack-Vue.js-2-and-Laravel-5. (this repo is a clone of that one)

# Chapter 2

Goals: Cover basic vue functionality, install and config (without a bundler).

## The vue instance

Created by `var app = new Vue();` and normally passed a configuration object like:
```js
var app = new Vue({
  el: '#app',
  data: {
    ...
  }
})
```
Where el refers to the root element of this vue instance and data is the data bound to this component. This data can be accessed using mustache sytax in the template ( `{{ data }}` ).

## Binding
Mustache syntax does not work in attributes, while `<div class="{{ styleClass }}"></div>` looks like it should work, it won't. 

The correct way is to bind a variable to the class attribute like this: `<div v-bind:class="styleClass"></div>` (any attribute with a `v-` prefix will be evaluated as a JS expression, not as text).

## Directives
`v-bind` is a directive. The other main ones are:
* `v-if`: Conditionally render the element
* `v-for`: Render the element multiple times
* `v-on`: Attach an event listener to the object
(There are more to come)

Directives are also valid HTML atributes that will be ignored if vue is not present.

If the directive requires an argument it will follow a colon after the directive eg; `v-on:click="..."`, if it doesn't require an argument it doesn't have a colon eg, `v-if="..."`.

### Lists with v-for
`v-for` requires an expression in the form of `v-for="item in items"`, where items is usually an array.

They also require a key value for use by vue when re-rendering components. So a standard list would look like this:
```html
<div v-for="item in items" v-bind:key="item.id">
     {{ item.title }}
</div>
```

### Event listeners with v-on
`v-on:click` is used in the same way as JS' `onclick`. A standard listener might look like:
```html
<button v-on:click="clicked = true">Click me</button>
```

## Lifecycle hooks
We can hook into parts of vue's process to run code based on events. The hooks are:
* beforeCreate
* created
* beforeMount
* mounted
* beforeUpdate
* updated
* beforeDestroy
* destroyed

We can attach a function to one of these hooks by add a function of the same name to the element object like so:
```js
var app = new Vue({
  data: { ... },
  created() {
    ...
  }
})
```
 
 ## Methods
 A vue config object can also take methods, these are just functions that have the vue instance set as this so other methods can be reference by `this.methodName()` and data values can be referenced by `this.dataValue`.

 ## Listening for a keypress
Events can have modifiers that follow after a dot, this great for detecting keypresses. To listen for the escape key we can do: `v-on:keyup.esc`.

Unfortunately keypresses are handled by the body tag (unless something is in focus, like a text box in use), and a vue instance must be inside the body tag. So we can't just attach a key listener to our element we have to use some traditional JS.

A good example of attaching a key listener for the the escape key is below. We have a method to listen for all keypresses and set `escPressed` if esc was pressed. The listener is added when the vue instance is added and removed with the vue instance.

```js
new Vue({
     data: { 
       escPressed = false
      },
     methods: { 
       escapeKeyListener: function(evt) {
         if (evt.keyCode === 27 && this.modalOpen) {
           this.escPressed = true;
         }
        }
      },
     created() {
      document.addEventListener('keyup', this.escapeKeyListener);
     },
     destroyed() {
      document.removeEventListener('keyup', this.escapeKeyListener);
     }
});
```
# Chapter 3

Goal: Introduce laravel and get a ~~Homestead~~Docker development evironment set up. (I don't like homestead and am used to docker so I'm going to differ from the book here)

## About Larvel
Laravel was at 5.5 when this book was published and 5.6 while I'm working through it. 5.5 is their current LTS version so we'll stick with that.

Laravel should be useful for a variety of projects like:
* Websites with use auth requirements
* Web apps
* Web services like APIs

## Environment
Laravel 5.5 requires PHP 7+, composer, some other PHP extensions, a web server, and a database. The book recommends homestead to get set up quickly but I found homestead too heavy so I'm going to user the docker set up recommended [here](https://medium.com/@shakyShane/laravel-docker-part-1-setup-for-development-e3daaefaf3c). This will be set up in the vuebnb folder.

# Chapter 4

Goals: Create a simple web service with Laravel, set up (with migrations) and seed the database, create API endpoints, serve images.

## Migrations
Migrations are a class with instructions of how to set up a database. They can be added with this artisan command
```bash
php artisan make:migration migration_description
```

Inside a migration file we can set up the schema of the table using the boilerplate code provided by the command above. After a migration has been set up it is applied to the database using
```bash
php artisan migrate
```

## Mock data
The database can be filled with mock (or real) data using a seeder. Create a seeder like so
```bash
php artisan make:seeder FooTableSeeder
```

The database can be seeded with data from a json file, like in this book, or directly in php, or using a factory (see docs). Seeding from json is as easy as:
```php
public function run()
{
     $path = base_path() . '/database/data.json';
     $file = File::get($path);
     $data = json_decode($file, true);
     DB::table('listings')->insert($data);
}
```

All seeding is done from the `DatabaseSeeder` class' run function. So need to put any new seeding classes in there. Then run 
```bash
php artisan db:seed
```

#### Notes (from experience):
Sometimes we need to regenerate composer's autoloader for seeding to work
```bash
composer dump-autoload
```

To wipe the database, re-run migrations and re-seed:
```bash
php artisan migrate:refresh --seed
```

## Eloquent ORM
Object Relational Mapping (ORM) is way of mapping rich objects from OO languages to scalar values used in relational databases. Eloquent uses the [active record design pattern](https://en.wikipedia.org/wiki/Active_record_pattern) where each model is tied to one table, and each instance is tied to a row.

By default the model class name uses the UpperCameCase version of the (lower_underscore_case) table name and includes all fields(columns) in the table.

A model can be created using the following command (this doesn't create a db table)
```bash
php artisan make:model ModelName
```

### Casting
Data types between php and MySQL (or other dbs) don't line up exactly. For example MySQL doesn't have a boolean type and will just store 0 or 1. This could cause errors but by setting casts in the model it will correct any. Adding this array to a model's class can set cast types for fields.
```php
protected $casts = [
  'field_name' => 'boolean',
  ...
];
```

## API routes
APA routes are stored in `routes/api.php` as they have different middleware to web routes `routes/web.php`. They are also prefixed with `/api` in their URLs. Routes take the form
```php
Route::get('url/{optional_variable}', 'ControllerName@function');
```

## Controllers
Controllers seperate the routes from the logic that each route has. They are created using:
```php
php artisan make:controller FooController
```

## Images
Images in this project are stored in `public/images` and can be accessed from `url/images/image`. Normally images would be stored in `storage/app/public` and symlinked to public images using the command below or just served from a CDN.
```bash
php artisan storage:link
```

# Chapter 5

Goals: Migrate front end prototype from Chapter 2 into this project, config webpack using laravel-mix.

## Webpack
Webpack is a bundler that takes assets like js/css/scss and bundles them into single files, it can also process files ie sass to css and ES2015+ to ES5. It is famously hard to configure so laravel comes with laravel-mix which does most of the config for us, and any config is done simply in the `webpack.mix.js` file.

The two main advanages for us are that it can compile .vue files into js, and modern JS down to ES5 that almost all browsers can use.

Laravel comes with a few CLI scripts make things easier, the main 3 are `npm run dev`, `npm run watch`, and `npm run prod`. These scripts can be changed/customised in `package.json`.

## Vue in a blade file
Both vue and blade files use the mustache syntax (`{{ exp }}`). To pass vue mustache brackets through a blade file we can escape them like so `@{{ exp }}`.

## Browsersync
Browsersync is a feature that comes with Yarn that auto reloads the page based on file changes, very useful when paired with `npm run watch`. Simply add the following to `webpack.mix.js` and it will proxy through `localhost:3000` with an autoreloading version of the site.
```js
mix.js('...', ',,,')
  ...
  .browserSync({
    proxy: process.env.APP_URL,
    open: false
  });
```

## ES2015 and polyfills
Laravel mix will run our js through babel to transpile it to ES5 syntax but it doesn't have polyfills for new Web APIs. These can be added individually from the `core-js` library.

For example the `Object.assign()` method is new in ES2015 but could be added by added `import "core-js/fn/object/assign";` to the top of a file. And of course installing core-js:
```bash
 npm i --save-dev core-js
 ```

 #### Note:
 The comments about polyfills are from the book, I think they might be out of date, babel-polyfill can handle these without import statements per file.

 # Chapter 6

 Goals: Refactor some existing code to be more component based, add a component based image carousel.

 ## Components
 `<div>` and `<span>` are great but what if we could make our own custom tags/elements, that what vue (and pretty much every modern front-end framework) allow us to do. The easiest way to do that is with the Vue api like so
 ```js
 Vue.component('my-component', {
     template: '<div>My component!</div>'
});
   new Vue({
     el: '#app'
});
```

Which can now be used like
```html
<div id="app">
     <my-component></my-component>
     <!-- Renders as <div>My component!</div> -->
</div>
```

Each component can also have it's own state, ie a checkbox component can remember if it's checked. 

```js
Vue.component('check-box', {
  template: '<div v-on:click="checked = !checked"></div>'
  data() {
    return {
      checked: false
    }
  }
});
```

*Note: data must be a function that returns an object so each object get's it's own version of it. Otherwise all copies of the checkbox would share the same state*.

### Component names
A component can be referred to in your code by a kebab-case name such as my-component, a PascalCase name such as MyComponent, or a camelCase name such as myComponent. Vue sees these all as the same component. However, in a DOM or string template, the component should always be kebab-cased.

## Single file components
Single File Components (SFCs) are files with a `.vue` extension that contain the complete definition of a component. They are similar to HTML files with 3 optional root elements. `<template>`, `<script>`, and `<style>`.

In the template tags should be the html to be rendered, variables, methods, and computed values can be referenced here between mustache brackets without previxing the with `this.`.

In the script tags is all the logic for the component all the main parts needs to go in an object that is exported.

In the style tags is standard css that will be applied everywhere, it's only put here for convenience. It can have a `scoped` attribute that will cause all the css to only affect this component.

### Transforming .vue files
To use single file components webpack requires the vue loader. Webpack mix is already set up with this, so nothing further needed in this project.

## Composing with components
Components can be nested as would be expected but they must be declare children components. using the Vue API it looks like this
```js
Vue.component('component-a', { ... }

Vue.component('component-b', {
  template: `<div>
              <component-a></component-a>
            </div>`,
}
```

In a SFC declaring components looks like this
```html
<script>  
import ComponentA from './ComponentA.vue';
...
export default {
  ...
  components: {
    ComponentA,
  }
}
</script>
}
```

### Registration scope
Components registered using the API above have global scope, they can be even be using in SFCs without declaring them. Components in a SFC have to be registered locally like above in every file they are used.

The advantage of registering components locally is they are only added to the web app if they are used. Old unused components in a big project won't get included. Also it keeps the global namespace clearer.

## Communicating with components
Data can go down with `props` and back up with `events`. If elements fall outside the normal flow of the page `refs` can be used.

## Props
Props are read only data passed down from the parent element. They are sent like a directive, and must be declared to be used. Props can be text only or dyamic using `v-bind`. Dynamic props will automatically flow down and re-render.
```js
export default {
  props: ['prop-a', 'prop-b'],
  ...
}
```

## Custom events
Custom events can be emitted from a child and listened for by the parent (only the direct parent). A event can be emitted like below with any number of arguments containing payload/arguments.
```js
this.$emit('my-event', 'event payload');
```

The parent can listen for events using `v-on` or `@` like so.
```html
<parent-component @my-event="doSomething"></parent-component>
```

## Refs
Refs are a special property that allows direct referencing of a child component, and access to it's data object.
```html
<weird-component ref="weirdcomponentref"> ... </weird-component>
```

A ref can then be accessed by it's parent like so
```js
...
methods: {
  specialAction() {
    this.$refs.weirdcomponentref.someState = true
  }
}
```

## Slots
If a parent element puts content between the tags of a child element, that content will be placed where the `<slot></slot>` tags are in the child's template. All content in the slot is in the scope of the parent, it cannot access any data of the child.

## Scoped slots
Scoped slots allow a way of passing data back to the parent when rendering child components. Kind of complicated but offers flexibility.

In the child:
```html
<div>
  <slot v-bind="item"></slot>
</div>
```

In the parent:
```html
<child>
  <template scoped-slot="theItem">
    <span>{{ theItem }}</span>
  </template>
</child>
```

Or for passing more than one variable back to the parent:

In the child:
```html
<div>
  <slot :my-prop-a="item.name" :my-prop-b="item.id"></slot>
</div>
```

In the parent:
```html
<child>
  <template scoped-slot="props">
    <span>{{ props.my-prop-a }}</span>
    <span>{{ props.my-prop-b }}</span>
  </template>
</child>
```

## Vue vs. Vue Runtime
Standard Vue allows us to define components with template strings in `.js` files and have them compiled to render functions in the browser. If we can remove all template strings from `.js` files and put all of them in `.vue` files then we can switch our vue to vue runtime which save ~25kB in production.

Switching a template string for a render function:
```js
var app = new Vue({
  template: `<ListingPage></ListingPage>`,
  el: '#app',
});
```

Becomes:
```js
var app = new Vue({
  el: '#app',
  render: h => h(ListingPage)
});
```

To switch the vue version used add this to `webpack.mix.js`:
```js
mix.webpackConfig({
  resolve: {
    alias: {
     'vue$': 'vue/dist/vue.runtime.esm.js'
    }
  }
});
```

# Chapter 7

Goals: Give the project a home page and ocnfigure it to work with vue router, then add carousels to the front page.

## Single page applications (SPAs)
Traditional server/client websites perform a full page reload for every new page, often reloading a bunch of un-needed html and js that was already on the previous page.

The SPA model changes pages without reloading, and new data required comes from an API. The advantage of this is less user waiting and often less bandwidth used. The disadvantage of this is browser built in features like history and remembering scroll position have to be re-implemented in JS (but the framework will handle most of that).

## Vue router
This is not included by default, but is made by the Vue team so integrates well. Vue router will handle our navigation, address bar updates, browser history, and scroll bar behaviour.

Install Vue router:
```bash
npm i --save-dev vue-router
```

Basic router set up, create `js/router.js`
```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import FooComponent from '../components/FooComponent.vue';
Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      name: 'home', // name is optional but good practice
      path: '/',
      component: FooComponent,
    },
  ]
});
```

Then add the router to the vue config object
```js
import router from './router';

var app = new Vue({
    ...
    router,
});
```

Then the router will render it's select component in the `router-view` tag, it normally goes somewhere high up. And the router's state can be changed by clicking on `router-link` tags, which render as `a` tags. A typical example of `App.vue`:
```html
<div>
  <div id="menu">
    <router-link :to="{ name: 'home' }"></router-link>
    <router-link :to="{ name: 'about' }"></router-link>
    ...
  </div>

  <router-view></router-view>

  <custom-footer></custom-footer>
</div>
```

### Note about the book
In the book the author creates a system where the inital page state is sent as a json object with index.html so first page load speeds up a bit. This then creates a lot of complexity around current valid state and moves a bunch of front end logic to the back end.

I followed his example in the code, but I don't think it's good software design so I'm not going to take any notes from that part of the chapter.

## Route navigation guards
Similar to lifecycle hooks, we can intercept vue router navigations. `beforeRouteEnter` is the most useful, but `afterEach` could be useful for something more subtle.

Gaurds halt navigation until the `next` function is called. This allows async functions to run before page navigation. If `false` is passed to `next()` the navigation will be cancelled.
```js
beforeRouteEnter(to, from, next) {
  // some code
  next();
}
```

In the `beforeRouteEnter` guard this is `undefined` because it is called before the next page's component had been created. However `next` can accept a callback that can access the new page component, and it will have access to scope of the surrounding code (because it's a closure). So we can do the following:
```js
beforeRouteEnter(to, from, next) {
  var data = { /* data to pass to new page */ } 
  next(component => { component.$data = data })
}
```

## Scroll behaviour
Unless we explicity give vue router some scroll behaviour the page will stay at the same place as routes change. When a user clicks on a new page they expect to see the top of the page, anything else is disorientating.

We can easily tell vue router to always go to the top of the page for any route by adding this to `js/router.js`
```js
export default new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  ...
})
```

## The route object
The route object represent the state of the current route and can be accessed inside a component instance using `this.$route`.

## Mixins
Functionality that is shared between components can be put in a mixin. For example we could add a method to multiple components by creating a `js/mixins.js` like this:
```js
export default {
    methods: {
      commonMethod() {
        console.log(this);
      }
    }
};
```

Then adding the mixin to a SFC like so:
```js
import routeMixin from '../js/route-mixin';

export default {
  mixins: [ routeMixin ],
...
}
```

# Chapter 8

Goals: Understand the flux architecture pattern, set up Vuex, use Vuex's sweet debugging tools.

## Flux application architecture
This concept came from the facebook messenger developers who were have trouble with 'zombie' messages, notifications for messages that had already been read. They came to the conclusion that the issue came from teh architecture of their app where there were too many connections to predict what would actually happen. 

### Principles of flux
* Single source of truth - any data share between components must be kept in one place only
* Data is read-only - only mutations (setters) can change the store
* Mutations are synchronous - all mutation functions must be synchronous

## Vuex
Vuex is Vue's offical implementation of flux. Install like so:
```bash
npm i --save-dev vuex
```

And set up by creating a `js/store.js` with contents:
```js
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store();
```

And add the following to the vue config object
```js
import store from './store';

var app = new Vue({
  ...
  store,
});
```

## Mutator methods
AKA setter methods, self explanitory. How to create:
```js
export default new Vuex.store({
  state: { foo: true },
  mutations: {
    toggleFoo() {
      state.foo = !state.foo
    }
  }
})
```

Accessing the state can be done from anywhere directly:
```js
var foo = this.$store.bar
```

## Getters
If what we want derived values from the store, and want to get them more than once it makes sense to use to getting function. They are defined in the same manner as mutations, in a getters object.

## Router and beforeEach
Now we have a Vuex store we can user the navigation guard `beforeEach` to replace `beforeRouteEnter`. I think `beforeEach` is better because it hooks into the route instead of the component. It has similar syntax and is added to the `js/router.js` file like so:
```js
import store from './store';

let router = new VueRouter({
  ...
});

router.beforeEach((to, from, next) => {
  // some sort of route logic
  next();
})
```

# Chapter 9

Goals: Create a user login system with CSRF protection and OAuth that stays logged in accross page refreshes.

## Login system
We need a login form, a POST route to recieve the form, a controller to check the login, and a session cookie to be sent back if login successfull.