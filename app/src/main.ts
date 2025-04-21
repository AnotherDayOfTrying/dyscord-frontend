import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ChatView from './components/ChatView.vue'
import LandingView from './components/LandingView.vue'
import './style.css'
import App from './App.vue'

const routes = [
    { path: '/', component: LandingView},
    { path: '/:chatId', component: ChatView}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

createApp(App)
    .use(router)
    .mount('#app')
