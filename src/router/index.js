import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useStore } from 'vuex'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: { requiresAuth: true },
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    meta: { requiresAuth: true },
    component: () => import('../views/FavoritesView.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    props: route => ({
      token: route.params.token,
      email: route.query.email || ''
    })
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const isProtectedRoute = to.matched.some(record => record.meta.requiresAuth)
  const isLoginRoute = to.path === '/'
  const isAuthenticated = store.state.token !== null

  // Si la ruta es protegida y no hay token, redirigir a login
  if (isProtectedRoute && !isAuthenticated) {
    return next('/')
  }

  // Si el usuario está autenticado e intenta acceder al login, redirigir a home
  if (isLoginRoute && isAuthenticated) {
    return next('/home')
  }

  // En cualquier otro caso, continuar
  next()
})

export default router
