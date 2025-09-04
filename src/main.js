import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

// Usar plugins
app.use(router)
app.use(store)

// Verificar si hay un token guardado al iniciar la aplicación
store.dispatch('getToken')

app.mount('#app')
