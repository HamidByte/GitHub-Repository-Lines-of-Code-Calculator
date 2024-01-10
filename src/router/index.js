import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchResult from '@/components/SearchResult.vue'
import UserRepositories from '@/components/UserRepositories.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/:user',
      name: 'UserRepositories',
      component: UserRepositories,
      meta: {
        title: 'Repositories'
      }
    },
    {
      path: '/:user/:repo',
      name: 'SearchResult',
      component: SearchResult,
      meta: {
        title: 'Search'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: 'About'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'PageNotFound',
      component: PageNotFound,
      meta: {
        title: 'Error 404'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'SearchResult') {
    // Dynamically set the title for the SearchResult route
    document.title = `Search ${to.params.user ?? ''}/${to.params.repo ?? ''}`
  } else {
    // Set the title for other routes in the default way
    document.title = to.meta?.title ?? 'Default Title'
  }

  next()
})

export default router
