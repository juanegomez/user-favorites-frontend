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
        <router-link to="/" class="link">¿Ya tienes cuenta? Inicia sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/config/axios';

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
      error: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false
    };
  },
  methods: {
    validateName() {
      if (!this.formData.name.trim()) {
        this.errors.name = 'El nombre es obligatorio';
        return false;
      }
      if (this.formData.name.length < 3) {
        this.errors.name = 'El nombre debe tener al menos 3 caracteres';
        return false;
      }
      return true;
    },
    
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.errors.email = 'El correo es obligatorio';
        return false;
      }
      if (!emailRegex.test(this.formData.email)) {
        this.errors.email = 'Ingresa un correo válido';
        return false;
      }
      return true;
    },
    
    validatePassword() {
      const password = this.formData.password;
      if (!password) {
        this.errors.password = 'La contraseña es obligatoria';
        return false;
      }
      if (password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        this.errors.password = 'La contraseña debe contener al menos una mayúscula';
        return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        this.errors.password = 'La contraseña debe contener al menos un símbolo';
        return false;
      }
      return true;
    },
    
    validateConfirmPassword() {
      if (this.formData.password !== this.formData.password_confirmation) {
        this.errors.password_confirmation = 'Las contraseñas no coinciden';
        return false;
      }
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
      if (!this.validateForm()) return;
      
      this.loading = true;
      this.error = '';
      
      try {
        const response = await api.post('/register', this.formData);
        
        if (response.data.status) {
          // Registro exitoso, redirigir a login con mensaje
          this.$router.push({
            path: '/',
            query: { registered: 'true' }
          });
        } else {
          this.error = response.data.message || 'Error en el registro';
        }
      } catch (error) {
        console.error('Error en el registro:', error);
        this.error = error.response?.data?.message || 'Error al conectar con el servidor';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos base del contenedor */
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #00b5cc, #00ff9f);
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

/* Tarjeta de registro */
.login-card {
  background: #2c2c2c;
  padding: 2.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Logo */
.logo {
  width: 200px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

/* Título */
.title {
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: left;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

/* Grupos de entrada */
.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 0.25rem;
}

/* Campos de entrada */
.input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #3d3d3d;
  border-radius: 8px;
  background: #1e1e1e;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  height: 48px;
}

.input:focus {
  outline: none;
  border-color: #42b4ca;
  box-shadow: 0 0 0 3px rgba(66, 180, 202, 0.2);
}

.input-error {
  border-color: #ff6b6b !important;
}

/* Botón de mostrar/ocultar contraseña */
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;
  background: transparent;
  border: none;
  padding: 0 8px;
}

.toggle-password:hover {
  color: #42b4ca;
}

/* Mensajes de error */
.error-message {
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  text-align: left;
  min-height: 1.2rem;
}

/* Botón de registro */
.btn {
  background: #42b4ca;
  color: white;
  border: none;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 48px;
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

/* Spinner de carga */
.spinner {
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mensaje de error general */
.form-error-message {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 0.8rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Enlaces adicionales */
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

/* Diseño responsivo */
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
  
  .input, .btn {
    padding: 0.7rem 1rem;
  }
}
</style>
