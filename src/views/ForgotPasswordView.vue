<template>
  <div class="home">
    <div class="login-card">
      <img alt="Vue logo" src="../assets/rick_and_morty_logo.png" class="logo" />
      <h1 class="title">Recuperar Contraseña</h1>
      <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Correo electrónico"
            class="input"
            :class="{ 'error': errors.email }"
            @input="errors.email = undefined"
            :disabled="isLoading"
          >
          <div v-if="errors?.email" class="error-message">
            {{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}
          </div>
        </div>

        <button type="submit" class="btn" :disabled="isLoading">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> Enviando...
          </span>
          <span v-else>Enviar enlace de recuperación</span>
        </button>

        <div v-if="message" class="message" :class="{ 'error': isError, 'success': !isError }">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../config/axios';

export default {
  name: 'ForgotPasswordView',
  setup() {
    const email = ref('');
    const isLoading = ref(false);
    const message = ref('');
    const isError = ref(false);
    const errors = ref({});
    const router = useRouter();

    const handleSubmit = async () => {
      if (!email.value) return;
      
      isLoading.value = true;
      message.value = '';
      isError.value = false;
      errors.value = {}; // Reset errors

      try {
        await api.post('/forgot-password', { email: email.value });
        message.value = 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.';
        isError.value = false;
        
      } catch (error) {
        console.error('Error al solicitar recuperación de contraseña:', error);
        
        // Handle 422 validation errors
        if (error.response?.status === 422 && error.response?.data?.errors) {
          errors.value = error.response.data.errors;
          // Show the first error message if available
          const firstError = Object.values(error.response.data.errors)[0];
          message.value = Array.isArray(firstError) ? firstError[0] : firstError;
        } else {
          // Handle other errors
          message.value = error.response?.data?.message || 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.';
        }
        
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      isLoading,
      message,
      isError,
      errors,
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
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

p {
  color: #bbb;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
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
}
</style>
