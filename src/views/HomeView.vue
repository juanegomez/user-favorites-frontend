<template>
  <AppNavbar />

  <!-- Loader mientras se cargan los datos -->
  <div v-if="loadingData" class="loading-overlay">
    <div class="spinner-container">
      <div class="spinner-large"></div>
      <p>Obteniendo personajes y favoritos...</p>
    </div>
  </div>

  <div class="home" v-else>
    <h1>Listado de Personajes</h1>

    <!-- Contenedor de personajes -->
    <div class="characters-grid">
      <CharacterCard
        v-for="character in characters"
        :key="character.id"
        :image="character.image"
        :name="character.name"
        :species="character.species"
        :isFavorite="favorites.includes(character.id)"
        :favoriteId="character.id"
        @toggle-favorite="confirmFavoriteAction"
      />
    </div>

    <!-- Paginación -->
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

    <!-- Modal de confirmación para agregar favorito -->
    <div v-if="showAddFavoriteModal" class="modal-overlay">
      <div class="modal">
        <h3>¿Estás seguro de agregar este favorito?</h3>
        <div class="modal-actions">
          <button 
            @click="addFavorite" 
            class="confirm-add-favorite-btn"
            :disabled="loadingAddFavorite"
          >
            <span class="button-content">
              <span v-if="loadingAddFavorite" class="spinner"></span>
              <span v-else>Guardar</span>
            </span>
          </button>
          <button @click="cancelAddFavorite" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar favorito -->
    <div v-if="showDeleteFavoriteModal" class="modal-overlay">
      <div class="modal">
        <h3>¿Estás seguro de eliminar este favorito?</h3>
        <div class="modal-actions">
          <button 
            @click="deleteFavorite" 
            class="confirm-delete-favorite-btn"
            :disabled="loadingDeleteFavorite"
          >
            <span class="button-content">
              <span v-if="loadingDeleteFavorite" class="spinner"></span>
              <span v-else>Eliminar</span>
            </span>
          </button>
          <button @click="cancelDeleteFavorite" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex"
import axios from 'axios';
import CharacterCard from "@/components/CharacterCard.vue"
import AppNavbar from "@/components/AppNavbar.vue"

export default {
  name: "HomeView",
  components: { CharacterCard, AppNavbar },
  data() {
    return {
      loadingData: false,
      characters: [],
      favorites: [],
      page: 1,
      totalPages: 1,
      inputPage: 1,

      //Add favorite
      showAddFavoriteModal: false,
      loadingAddFavorite: false,
      favoriteToAdd: {
        api_id: 0,
        name: '',
        image: '',
        description: ''
      },

      //Delete favorite
      showDeleteFavoriteModal: false,
      favoriteToDelete: null,
      loadingDeleteFavorite: false,
    }
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    async loadFavoriteIds() {
      try {
        const response = await axios.get('/api/favorites/ids', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        this.favorites = response.data.data || [];
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        alert("Error al cargar favoritos");
      }
    },

    async getPublicApiData(page = 1) {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/`, {
          params: { page }
        })
        this.characters = response.data.results
        this.totalPages = response.data.info.pages
        this.page = page
        this.inputPage = page
      } catch (error) {
        console.error("Error al obtener datos de la API pública:", error)
      }
    },

    goToPage() {
      if (this.inputPage >= 1 && this.inputPage <= this.totalPages) {
        this.getPublicApiData(this.inputPage)
      } else {
        // Resetea al valor actual si el input no es válido
        this.inputPage = this.page
      }
    },

    confirmFavoriteAction(favorite) {
      if (this.favorites.includes(favorite.id)) {
        this.favoriteToDelete = favorite.id;
        this.showDeleteFavoriteModal = true;
      } else {
        this.favoriteToAdd = {
          api_id: favorite.id,
          name: favorite.name,
          image: favorite.image,
          description: favorite.species
        };
        this.showAddFavoriteModal = true;
      }
    },

    cancelAddFavorite() {
      this.showAddFavoriteModal = false;
      this.favoriteToAdd = {
        api_id: 0,
        name: '',
        image: '',
        description: ''
      };
    },

    async addFavorite() {
      if (!this.favoriteToAdd || !this.favoriteToAdd.api_id) return;

      this.loadingAddFavorite = true;
      try {
        await axios.post(`/api/favorite`, this.favoriteToAdd, {
          headers: { Authorization: `Bearer ${this.token}` }
      });

      this.favorites.push(this.favoriteToAdd.api_id);
      } catch (error) {
        console.error("Error al guardar favorito:", error);
        alert("No se pudo guardar como favorito");
      } finally {
        this.loadingAddFavorite = false;
        this.showAddFavoriteModal = false;
        this.favoriteToAdd = {
        api_id: 0,
        name: '',
        image: '',
        description: ''
      };
    }
  },

  async deleteFavorite() {
    if (!this.favoriteToDelete) return;

    this.loadingDeleteFavorite = true;
    try {
      await axios.delete(`/api/favorite/${this.favoriteToDelete}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          data: { api_id: this.favoriteToDelete }
        });

      this.favorites = this.favorites.filter(id => id !== this.favoriteToDelete);
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("No se pudo eliminar el favorito");
    } finally {
      this.loadingDeleteFavorite = false;
      this.showDeleteFavoriteModal = false;
      this.favoriteToDelete = null;
    }
  },
  
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
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin: 0 auto 20px;
  max-width: 1400px;
  padding: 0 20px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .characters-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .characters-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .characters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .characters-grid {
    grid-template-columns: 1fr;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.pagination-button {
  background: #3c3c3c;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-input {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.page-input input {
  width: 60px;
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 6px;
  text-align: center;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #2c2c2c;
  padding: 20px;
  border-radius: 12px;
  color: white;
  text-align: center;
  width: 300px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.confirm-add-favorite-btn {
  background: green;
  color: white;
  font-weight: bold;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-delete-favorite-btn {
  background: #ec5353;
  color: white;
  font-weight: bold;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background: gray;
  color: white;
  font-weight: bold;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.button-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  height: 20px;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

/* Loader overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: white;
}

.spinner-large {
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
