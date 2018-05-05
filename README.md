# About
I'm using this readme file to keep my notes from the book Fullstack Vuejs and Laravel.

## Content
[Chapter 1](#chapter-1) - Just intro stuff, nothing interesting
[Chapter 2](#chapter-2) - Basic functionality of Vue
[Chapter 3](#chapter-3) - Setting up Laravel

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
Mustache syntax does not work in attributes, while `<div class="{{ styleClass }}"></div>` looks like it should work, but it won't. 

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

A good example of attaching a key listener for the the escape key is below. We have a method to listen for all keypresses and set `escPressed` if esc was pressed. The listener is added when the vue instance is added and remove with the vue instance.

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