<template>
  <nav class="navbar">
    <!-- Título -->
    <div class="navbar-left">
      <h1 class="navbar-title">Rick and Morty App</h1>
    </div>

    <!-- Bienvenida -->
    <div class="navbar-center" v-if="name">
      <p class="navbar-welcome">Bienvenido, <strong>{{ name }}</strong></p>
    </div>

    <!-- Links -->
    <div class="navbar-right">
      <router-link to="/" class="nav-link" v-if="isLoggedIn">Inicio</router-link>
      <router-link to="/favorites" class="nav-link" v-if="isLoggedIn">Favoritos</router-link>
      <router-link to="/" class="nav-link" v-if="isLoggedIn" @click="logout">Cerrar Sesión</router-link>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppNavbar',
  computed: {
    ...mapState(['name']),
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #20232a;
  color: white;
  padding: 15px 30px;
  border-bottom: 1px solid #42b4ca;
}

.navbar-left {
  flex: 1;
}

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.navbar-center {
  flex: 1;
  text-align: center;
}

.navbar-welcome {
  font-size: 16px;
  margin: 0;
}

.navbar-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-link:hover {
  color: #61dafb;
}
</style>
