import { createStore } from 'vuex'
import api from '@/config/axios';

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    name: localStorage.getItem('name') || null
  },
  getters: {
    isLoggedIn: state => !!state.token,
    getName: state => state.name
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setName(state, name) {
      state.name = name
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/login', credentials)
        
        const data = response.data
    
        if (data?.access_token) {
          // Guardar el token en el store y localStorage
          commit('setToken', data.access_token)
          localStorage.setItem('token', data.access_token)

          // Guardar el nombre en el store y localStorage
          commit('setName', data.user?.name)
          localStorage.setItem('name', data.user?.name)
    
          return {
            status: true,
            message: 'Inicio de sesión exitoso'
          }
        } else {
          return {
            status: false,
            message: 'Error al iniciar sesión'
          }
        }
      } catch (error) {
        console.error('Error en login:', error)
        return {
          status: false,
          message: error.response?.data?.message || 'Error al conectar con el servidor'
        }
      }
    },
    
    getToken({ commit }) {
      const token = localStorage.getItem('token')
      const name = localStorage.getItem('name')
      if (token) {
        commit('setToken', token)
        commit('setName', name)
      }
    },
    
    async logout({ commit }) {
      try {
        // Llamar al endpoint de logout del backend
        await api.post('/logout')
        window.location.href = '/'
      } catch (error) {
        console.error('Error en logout:', error)
      } finally {
        // Limpiar el store y localStorage
        commit('setToken', null)
        commit('setName', null)
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        window.location.href = '/'
      }
    }
  },
  modules: {
  }
})
