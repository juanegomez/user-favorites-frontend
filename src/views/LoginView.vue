<template>
  <div class="home">
    <div class="login-card">
      <img alt="Vue logo" src="../assets/rick_and_morty_logo.png" class="logo" />
      <h1 class="title">Iniciar Sesión</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Input correo -->
        <div class="input-group">
          <input
            id="email"
            type="email"
            v-model="user.email"
            placeholder="Correo electrónico"
            class="input"
          />
        </div>

        <!-- Input contraseña con toggle -->
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="user.password"
            placeholder="Contraseña"
            class="input"
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <button type="submit" class="btn">Ingresar</button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="extra-links">
        <router-link to="/register" class="link">Crear cuenta</router-link>
        <router-link to="/forgot-password" class="link">¿Olvidaste tu contraseña?</router-link>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      errorMessage: '',
      showPassword: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const result = await this.login(this.user)

        if (result.status) {
          this.$router.push('/home')
        } else {
          this.errorMessage = result.message
        }
      } catch (error) {
        this.errorMessage = 'Error al iniciar sesión'
        console.error('Error en el login:', error)
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #00b5cc, #00ff9f);
  font-family: 'Arial', sans-serif;
}

.login-card {
  background: #2c2c2c;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.15);
  width: 350px;
  text-align: center;
}

.logo {
  width: 220px;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  position: relative;
  width: 100%;
}

.input {
  background-color: #303134;
  color: white;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  font-size: 1rem;
}

.input:focus {
  border-color: #00b5cc;
  box-shadow: 0 0 5px rgba(0, 181, 204, 0.5);
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #aaa;
}

.btn {
  background: #00b5cc;
  color: #fff;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
}

.btn:hover {
  background: #0095a5;
}

.extra-links {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link {
  font-size: 0.9rem;
  color: #00b5cc;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #0095a5;
  text-decoration: underline;
}

.error-message {
  margin-top: 1rem;
  color: red;
  font-size: 0.9rem;
}
</style>
