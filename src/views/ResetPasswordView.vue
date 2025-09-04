<template>
  <div class="home">
    <div class="login-card">
      <img alt="Vue logo" src="../assets/rick_and_morty_logo.png" class="logo" />
      <h1 class="title">Restablecer Contraseña</h1>
      <p>Ingresa tu nueva contraseña para continuar.</p>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <div class="password-input">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              placeholder="Nueva contraseña"
              class="input"
              :class="{ 'error': errors.password }"
              @input="validatePassword"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div v-if="errors.password" class="error-message">
            {{ errors.password }}
          </div>
          <div class="password-requirements">
            <p>La contraseña debe contener al menos:</p>
            <ul>
              <li :class="{ 'valid': hasMinLength }">8 caracteres de longitud</li>
              <li :class="{ 'valid': hasUppercase }">1 letra mayúscula</li>
              <li :class="{ 'valid': hasNumber }">1 número</li>
              <li :class="{ 'valid': hasSpecialChar }">1 carácter especial</li>
            </ul>
          </div>
        </div>

        <div class="input-group">
          <div class="password-input">
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              placeholder="Confirmar nueva contraseña"
              class="input"
              :class="{ 'error': errors.passwordConfirmation }"
              @input="validatePasswordConfirmation"
            >
          </div>
          <div v-if="errors.passwordConfirmation" class="error-message">
            {{ errors.passwordConfirmation }}
          </div>
        </div>

        <button type="submit" class="btn" :disabled="isLoading || !isFormValid">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> Actualizando...
          </span>
          <span v-else>Actualizar Contraseña</span>
        </button>

        <div v-if="message" class="error-message">
          {{ message }}
        </div>
      </form>

      <div class="extra-links">
        <router-link to="/" class="link">
          <i class="fas fa-arrow-left"></i> Volver al Inicio de Sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../config/axios';

export default {
  name: 'ResetPasswordView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const showPassword = ref(false);
    const isLoading = ref(false);
    const message = ref('');
    const isError = ref(false);
    const errors = ref({
      password: '',
      passwordConfirmation: ''
    });

    // Validaciones de contraseña
    const hasMinLength = computed(() => password.value.length >= 8);
    const hasUppercase = computed(() => /[A-Z]/.test(password.value));
    const hasNumber = computed(() => /[0-9]/.test(password.value));
    const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value));
    const passwordsMatch = computed(() => 
      password.value === passwordConfirmation.value && passwordConfirmation.value.length > 0
    );

    const isFormValid = computed(() => {
      return (
        hasMinLength.value &&
        hasUppercase.value &&
        hasNumber.value &&
        hasSpecialChar.value &&
        passwordsMatch.value
      );
    });

    const validatePassword = () => {
      if (!password.value) {
        errors.value.password = 'La contraseña es requerida';
        return false;
      }
      
      if (password.value.length < 8) {
        errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
        return false;
      }
      
      errors.value.password = '';
      return true;
    };

    const validatePasswordConfirmation = () => {
      if (password.value !== passwordConfirmation.value) {
        errors.value.passwordConfirmation = 'Las contraseñas no coinciden';
        return false;
      }
      
      errors.value.passwordConfirmation = '';
      return true;
    };

    const handleSubmit = async () => {
      if (!validatePassword() || !validatePasswordConfirmation()) {
        return;
      }

      isLoading.value = true;
      message.value = '';
      isError.value = false;

      try {
        await api.post('/reset-password', {
          token: token.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value
        });

        // Mostrar alerta
        alert('¡Tu contraseña ha sido actualizada correctamente!');
        
        // Redirigir al login
        router.push('/');
        
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        message.value = error.response?.data?.message || 'Ocurrió un error al actualizar tu contraseña. Por favor, inténtalo de nuevo.';
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      // Obtener token y email de la URL
      token.value = route.params.token || '';
      email.value = route.query.email || '';
      
      if (!token.value || !email.value) {
        router.push('/');
      }
    });

    return {
      password,
      passwordConfirmation,
      showPassword,
      isLoading,
      message,
      isError,
      errors,
      hasMinLength,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isFormValid,
      validatePassword,
      validatePasswordConfirmation,
      handleSubmit
    };
  }
};
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
  max-width: 500px;
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
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

p {
  color: #bbb;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
  text-align: center;
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
  text-align: left;
}

.password-input {
  position: relative;
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.8rem 3rem 0.8rem 1rem;
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

.input.error {
  border-color: #dc3545;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 2;
}

.toggle-password:hover {
  color: #42b4ca;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  height: 1.25rem;
  text-align: left;
  padding-left: 0.5rem;
}

.password-requirements {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #bbb;
}

.password-requirements p {
  margin: 0 0 0.5rem 0;
  text-align: left;
  font-size: 0.9rem;
  color: #ddd;
}

.password-requirements ul {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: none;
}

.password-requirements li {
  margin-bottom: 0.25rem;
  position: relative;
  color: #ff6b6b;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.password-requirements li:before {
  content: '✗';
  position: absolute;
  left: -1.25rem;
}

.password-requirements li.valid {
  color: #51cf66;
}

.password-requirements li.valid:before {
  content: '✓';
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.link:hover {
  color: #3694a8;
  text-decoration: underline;
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
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.95rem;
  }
  
  .password-requirements {
    font-size: 0.8rem;
  }
  
  .password-requirements li {
    font-size: 0.8rem;
  }
}
</style>
