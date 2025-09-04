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
            required
          />
        </div>

        <!-- Input contraseña con toggle -->
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="user.password"
            placeholder="Contraseña"
            class="input"
            required
            minlength="6"
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="!loading">Ingresar</span>
          <span v-else>Procesando...</span>
        </button>
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
      showPassword: false,
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        this.loading = true
        this.errorMessage = ''
        
        const result = await this.login(this.user)

        if (result.status) {
          this.$router.push('/home')
        } else {
          this.errorMessage = result.message || 'Error al iniciar sesión'
        }
      } catch (error) {
        console.error('Error en el login:', error)
        this.errorMessage = error.response?.data?.message || 'Error al conectar con el servidor'
      } finally {
        this.loading = false
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
  min-height: 100vh;
  background: linear-gradient(135deg, #00b5cc, #00ff9f);
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.login-card {
  background: #2c2c2c;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo {
  width: 200px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

.title {
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #3d3d3d;
  border-radius: 8px;
  background: #1e1e1e;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #42b4ca;
  box-shadow: 0 0 0 3px rgba(66, 180, 202, 0.2);
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #42b4ca;
}

.btn {
  background: #42b4ca;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.btn:hover:not(:disabled) {
  background: #3694a8;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.8;
}

.extra-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.link {
  color: #42b4ca;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.link:hover {
  color: #3694a8;
  text-decoration: underline;
}

.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .logo {
    width: 160px;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
