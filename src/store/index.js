import { createStore } from 'vuex'
import axios from 'axios';

export default createStore({
  state: {
    token: null,
    name: null
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
        const response = await axios.post(`/api/login`, credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
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
        console.error('Error al iniciar sesión:', error)
        return {
          status: false,
          message: 'Error al iniciar sesión'
        }
      }
    },
    getToken({ commit }) {
      if (localStorage.getItem('token')) {
        commit('setToken', localStorage.getItem('token'))
      }else{
        commit('setToken', null)
      }
    },
    async logout({ commit, dispatch }) {
      try {
        await axios.post(`/api/logout`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        commit('setToken', null)
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        
        window.location.href = '/'
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        commit('setToken', null)
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        window.location.href = '/'
      }
    }
  },
  modules: {
  }
})
