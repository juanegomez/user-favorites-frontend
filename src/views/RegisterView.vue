<template>
  <div class="home">
    <div class="login-card">
      <img alt="Vue logo" src="../assets/rick_and_morty_logo.png" class="logo" />
      <h1 class="title">Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister" class="login-form">
        <!-- Input nombre -->
        <div class="input-group">
          <input
            type="text"
            id="name"
            v-model="formData.name"
            @blur="validateName"
            @input="errors.name = ''"
            placeholder="Nombre completo"
            class="input"
            :class="{ 'input-error': errors.name }"
            :disabled="loading"
            required
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <!-- Input correo -->
        <div class="input-group">
          <input
            type="email"
            id="email"
            v-model="formData.email"
            @blur="validateEmail"
            @input="errors.email = ''"
            placeholder="Correo electrónico"
            class="input"
            :class="{ 'input-error': errors.email }"
            :disabled="loading"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <!-- Input contraseña -->
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="formData.password"
            @blur="validatePassword"
            @input="errors.password = ''"
            placeholder="Contraseña (mín. 8 caracteres, 1 mayúscula y 1 símbolo)"
            class="input"
            :class="{ 'input-error': errors.password }"
            :disabled="loading"
            required
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <!-- Input confirmar contraseña -->
        <div class="input-group">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="password_confirmation"
            v-model="formData.password_confirmation"
            @blur="validateConfirmPassword"
            @input="errors.password_confirmation = ''"
            placeholder="Confirmar contraseña"
            class="input"
            :class="{ 'input-error': errors.password_confirmation }"
            :disabled="loading"
            required
          />
          <span class="toggle-password" @click="toggleConfirmPassword">
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
          <div v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</div>
        </div>

        <div v-if="error" class="form-error-message">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Registrarse</span>
        </button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="extra-links">
        <router-link to="/login" class="link">¿Ya tienes cuenta? Inicia sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      errors: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      error: '',
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    validateName() {
      if (!this.formData.name) {
        this.errors.name = 'El nombre es obligatorio';
        return false;
      }
      if (this.formData.name.length > 255) {
        this.errors.name = 'El nombre no debe exceder 255 caracteres';
        return false;
      }
      this.errors.name = '';
      return true;
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.errors.email = 'El correo electrónico es obligatorio';
        return false;
      }
      if (!emailRegex.test(this.formData.email)) {
        this.errors.email = 'Ingrese un correo electrónico válido';
        return false;
      }
      if (this.formData.email.length > 255) {
        this.errors.email = 'El correo no debe exceder 255 caracteres';
        return false;
      }
      this.errors.email = '';
      return true;
    },
    validatePassword() {
      const hasUpperCase = /[A-Z]/.test(this.formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.formData.password);
      
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es obligatoria';
        return false;
      }
      if (this.formData.password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
        return false;
      }
      if (!hasUpperCase) {
        this.errors.password = 'La contraseña debe contener al menos una letra mayúscula';
        return false;
      }
      if (!hasSpecialChar) {
        this.errors.password = 'La contraseña debe contener al menos un carácter especial';
        return false;
      }
      this.errors.password = '';
      return true;
    },
    validateConfirmPassword() {
      if (this.formData.password !== this.formData.password_confirmation) {
        this.errors.password_confirmation = 'Las contraseñas no coinciden';
        return false;
      }
      this.errors.password_confirmation = '';
      return true;
    },
    validateForm() {
      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      const isConfirmPasswordValid = this.validateConfirmPassword();
      
      return isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async handleRegister() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const response = await axios.post('/api/register', this.formData);
        
        // Redirigir al login después de registro exitoso
        this.$router.push({ 
          name: 'login',
          query: { registered: 'true' }
        });
        
      } catch (error) {
        console.error('Error en el registro:', error);
        this.error = error.response?.data?.message || 'Error en el registro. Por favor, inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #00b5cc, #00ff9f);
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.login-card {
  background: #2c2c2c;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: white;
}

.logo {
  max-width: 200px;
  margin-bottom: 1.5rem;
}

.title {
  color: #42b983;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.input-group {
  position: relative;
  margin-bottom: 0.2rem;
  text-align: left;
  padding-bottom: 1.1rem; /* Space for error message */
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: 500;
  text-align: left;
}

.input {
  width: 100%;
  padding: 0.8rem 3rem 0.8rem 1rem;
  border: 2px solid #444;
  border-radius: 8px;
  background: #3a3a3a;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  height: 45px;
}

.input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.3);
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 0;
  height: 45px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1rem;
  z-index: 2;
  padding: 0;
  margin: 0;
}

.btn {
  width: 100%;
  padding: 0.8rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  background: #3aa876;
}

.extra-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link {
  color: #42b983;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.link:hover {
  color: #3aa876;
  text-decoration: underline;
}

/* Error message for individual fields */
.error-message {
  position: absolute;
  bottom: 0.1rem;
  left: 0;
  color: #ff6b6b;
  font-size: 0.7rem;
  text-align: left;
  width: 100%;
  padding: 0.1rem 0 0 0;
  line-height: 1.2;
}

/* Main form error message */
.form-error-message {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 4px solid #ff6b6b;
}

.form-error-message i {
  font-size: 1.1rem;
}

.input-error {
  border-color: #ff6b6b !important;
  background: rgba(231, 76, 60, 0.1) !important;
}

.input:focus.input-error {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2) !important;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    width: 100%;
    margin: 0 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>
