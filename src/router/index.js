import { createRouter, createWebHistory } from 'vue-router'
import Bookshelf from '../views/Bookshelf.vue'
import Reader from '../views/Reader.vue'

const routes = [
  { path: '/', name: 'Bookshelf', component: Bookshelf },
  { path: '/reader/:bookId', name: 'Reader', component: Reader, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router