import Vue from "blessed-vue"
import App from "./src/App.vue"

const el = Vue.dom.createElement()

Vue.dom.append(el)

new Vue({
	name: "app",
	components: {
		App
	},
	template: "<App />"
}).$mount(el)
