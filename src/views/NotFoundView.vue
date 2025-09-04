<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>¡Ups! Página no encontrada</h2>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <router-link to="/" class="home-button">
        <i class="fas fa-home"></i> Volver al Inicio
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
  mounted() {
    document.title = '404 - Página no encontrada';
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.not-found-content {
  max-width: 600px;
  padding: 3rem 2rem;
  background: rgba(42, 42, 42, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

h1 {
  font-size: 8rem;
  margin: 0;
  color: #42b4ca;
  line-height: 1;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 2rem;
  margin: 1rem 0 0.5rem;
  color: #fff;
}

p {
  font-size: 1.1rem;
  color: #bbb;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.8rem;
  background: #42b4ca;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.home-button:hover {
  background: #3694a8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.home-button i {
  font-size: 0.9em;
}

/* Responsive Design */
@media (max-width: 768px) {
  h1 {
    font-size: 6rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  .not-found {
    padding: 1.5rem;
  }
  
  .not-found-content {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 4.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1rem;
  }
  
  .home-button {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.5rem;
  }
}
</style>
