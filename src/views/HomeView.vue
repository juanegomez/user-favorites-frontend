<template>
  <AppNavbar />

  <!-- Loader while data is being fetched -->
  <div v-if="loadingData" class="loading-overlay">
    <div class="spinner-container">
      <div class="spinner-large"></div>
      <p>Obteniendo personajes y favoritos...</p>
    </div>
  </div>

  <div class="home" v-else>
    <h1 class="home-title">Listado de Personajes</h1>

    <!-- Characters container -->
    <div class="characters-grid">
      <CharacterCard
        v-for="character in characters"
        :key="character.id"
        :image="character.image"
        :name="character.name"
        :species="character.species"
        :is-favorite="favorites.includes(Number(character.id))"
        :favorite-id="character.id"
        @toggle-favorite="confirmFavoriteAction"
      />
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="getPublicApiData(page - 1)" 
        :disabled="page <= 1"
        class="pagination-button"
      >
        Anterior
      </button>

      <div class="page-input">
        <span>Página</span>
        <input 
          type="number" 
          v-model.number="inputPage"
          @change="goToPage"
          min="1"
          :max="totalPages"
        />
        <span>de <strong>{{ totalPages }}</strong></span>
      </div>

      <button 
        @click="getPublicApiData(page + 1)" 
        :disabled="page >= totalPages"
        class="pagination-button"
      >
        Siguiente
      </button>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmationModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-icon" :class="{ 'delete': isFavorite, 'add': !isFavorite }">
        <i :class="isFavorite ? 'fas fa-trash-alt' : 'fas fa-heart'"></i>
      </div>
      <h3>{{ isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos' }}</h3>
      <p>¿Estás seguro que deseas {{ isFavorite ? 'eliminar a' : 'agregar a' }} <strong>{{ selectedFavorite.name }}</strong> {{ isFavorite ? 'de' : 'a' }} tus favoritos?</p>
      <div class="modal-actions">
        <button @click="cancelAddFavorite" class="btn btn-cancel">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button 
          @click="isFavorite ? deleteFavorite() : addFavorite()" 
          class="btn" 
          :class="{ 'btn-delete': isFavorite, 'btn-add': !isFavorite }"
        >
          <i :class="isFavorite ? 'fas fa-trash-alt' : 'fas fa-heart'"></i>
          {{ isFavorite ? 'Eliminar' : 'Agregar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/config/axios';
import axios from 'axios';
import AppNavbar from '@/components/AppNavbar.vue';
import CharacterCard from '@/components/CharacterCard.vue';

export default {
  name: 'HomeView',
  components: {
    AppNavbar,
    CharacterCard
  },
  data() {
    return {
      characters: [],
      favorites: [],
      loadingData: true,
      page: 1,
      inputPage: 1,
      totalPages: 1,
      showConfirmationModal: false,
      selectedFavorite: {
        api_id: null,
        name: '',
        image: '',
        description: '',
      },
      isFavorite: false
    };
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    async loadFavoriteIds() {
      try {
        const response = await api.get('/favorites/ids');

        this.favorites = response.data.data || [];
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    },

    async getPublicApiData(page = 1) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) return;
      
      this.loadingData = true;
      try {
        // Usamos axios directamente para la API de Rick and Morty ya que es una API externa
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
        this.characters = response.data.results;
        this.page = page;
        this.inputPage = page;
        this.totalPages = response.data.info.pages;

        this.characters = this.characters.map(character => ({
          ...character,
          id: Number(character.id)
        }));
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        this.loadingData = false;
      }
    },

    goToPage() {
      const page = Math.min(Math.max(1, parseInt(this.inputPage) || 1), this.totalPages);
      if (page !== this.page) {
        this.getPublicApiData(page);
      } else {
        this.inputPage = page; // Reset if same page
      }
    },

    confirmFavoriteAction(character) {
      this.selectedFavorite = {
        api_id: character.id,
        name: character.name,
        image: character.image,
        description: character.species,
      };
      this.isFavorite = this.favorites.includes(character.id)
      this.showConfirmationModal = true;
    },

    cancelAddFavorite() {
      this.showConfirmationModal = false;
      this.selectedFavorite = {
        id: null,
        name: '',
        image: '',
      };
      this.isFavorite = false;
    },

    async addFavorite() {
      try {
        await api.post(
          '/favorite',
          this.selectedFavorite
        );
        
        // Actualizar el estado local de favoritos
        if (!this.favorites.includes(this.selectedFavorite.api_id)) {
          this.favorites.push(this.selectedFavorite.api_id);
          this.isFavorite = true;
        }
        
        this.showConfirmationModal = false;
      } catch (error) {
        console.error('Error adding favorite:', error);
        alert('Error al agregar a favoritos');
      }
    },

    async deleteFavorite() {
      try {
        // Primero obtenemos el ID del favorito para este personaje
        const response = await api.get(`/favorite/character/${this.selectedFavorite.api_id}`);
        const favoriteId = response.data.id;
        
        // Luego eliminamos el favorito
        await api.delete(`/favorite/${favoriteId}`);
        
        // Actualizamos el estado local
        this.favorites = this.favorites.filter(id => id !== this.selectedFavorite.api_id);
        this.isFavorite = false;
        
        this.showConfirmationModal = false;
      } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Error al eliminar de favoritos');
      }
    }
  },
  
  async created() {
    this.loadingData = true
    try {
      await this.getPublicApiData(this.page)
      await this.loadFavoriteIds()
    } finally {
      this.loadingData = false
    }
  }
};
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #2c2c2c;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 28px;
}

.modal-icon.add {
  background-color: rgba(66, 180, 202, 0.2);
  color: #42b4ca;
}

.modal-icon.delete {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.modal h3 {
  margin: 0 0 1rem;
  color: #fff;
  font-size: 1.5rem;
}

.modal p {
  color: #bbb;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn i {
  font-size: 0.9em;
}

.btn-cancel {
  background-color: #3d3d3d;
  color: #bbb;
}

.btn-cancel:hover {
  background-color: #4a4a4a;
}

.btn-add {
  background-color: #42b4ca;
  color: white;
}

.btn-add:hover {
  background-color: #3694a8;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(66, 180, 202, 0.3);
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

/* Responsive */
@media (max-width: 480px) {
  .modal {
    padding: 1.5rem;
    width: 85%;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.8rem;
  }
}

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #42b4ca;
  font-size: 2.5rem;
}

/* Characters Grid */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner-container {
  text-align: center;
  color: white;
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #42b4ca;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.pagination-button {
  background: #42b4ca;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.pagination-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.pagination-button:not(:disabled):hover {
  background: #3694a8;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.page-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ddd;
}

.page-input input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #2c2c2c;
  color: white;
  text-align: center;
}

.page-input input:focus {
  outline: none;
  border-color: #42b4ca;
  box-shadow: 0 0 0 2px rgba(66, 180, 202, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: #2c2c2c;
  padding: 2rem;
  border-radius: 10px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal h3 {
  color: #42b4ca;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  color: #ddd;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-confirm {
  background: #42b4ca;
  color: white;
}

.btn-confirm:hover {
  background: #3694a8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-input {
    order: -1;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .characters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .modal {
    width: 90%;
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

.home-title {
  color: white;
  text-align: center;
  font-size: 2rem;
}
</style>
