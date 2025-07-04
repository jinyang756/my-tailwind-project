import { createRouter, createWebHistory } from 'vue-router'
import Bookshelf from '../views/Bookshelf.vue'
import Reader from '../views/Reader.vue'
import Admin from '../views/Admin.vue'
import BooksManagement from '../components/admin/BooksManagement.vue'

const routes = [
  { path: '/', name: 'Bookshelf', component: Bookshelf },
  { path: '/reader/:bookId', name: 'Reader', component: Reader, props: true },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: 'books',
        name: 'BooksManagement',
        component: BooksManagement
      },
      {
        path: '',
        redirect: 'books'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router