import { createRouter, createWebHistory } from 'vue-router'
import TheWelcome from '../components/TheWelcome.vue'
import BookshelfView from '../views/Bookshelf.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: TheWelcome
  },
  {
    path: '/bookshelf',
    name: 'bookshelf',
    component: BookshelfView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router