<template>
  <AppNavbar />
  <div class="favorites">
    <h1>Lista de Favoritos</h1>

    <!-- Filtros -->
    <div class="favorites-filters">
      <input
        type="text"
        v-model="filterFavoritesParams.search"
        placeholder="Buscar por cualquier campo"
      />
      <input
        type="text"
        v-model="filterFavoritesParams.name"
        placeholder="Filtrar por nombre"
      />
      <input
        type="text"
        v-model="filterFavoritesParams.description"
        placeholder="Filtrar por descripción"
      />
      <button @click="getFavorites(1)" class="search-button">Buscar</button>
    </div>

    <!-- Contenedor de personajes -->
    <div class="characters-grid">
      <CharacterCard
        v-for="character in favorites"
        :key="character.api_id"
        :image="character.image"
        :name="character.name"
        :species="character.description"
        :isFavorite="true"
        :favoriteId="character.api_id"
        @toggle-favorite="confirmDeleteFavorite"
      />
    </div>

    <!-- Paginación -->
    <div class="pagination">
    
      <!-- Select para per_page -->
      <select v-model.number="filterFavoritesParams.per_page" @change="getFavorites(1)" class="per-page-select">
        <option v-for="n in [5,10,15,20]" :key="n" :value="n">
          {{ n }} por página
        </option>
      </select>

      <button 
        @click="getFavorites(page - 1)" 
        :disabled="page <= 1"
        class="pagination-button"
      >
        Anterior
      </button>

      <!-- Ir a página específica -->
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
        @click="getFavorites(page + 1)" 
        :disabled="page >= totalPages"
        class="pagination-button"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>¿Estás seguro de eliminar este favorito?</h3>
        <div class="modal-actions">
          <button @click="deleteFavorite" class="confirm-btn">Eliminar</button>
          <button @click="cancelDelete" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue"
import { mapState } from "vuex"
import CharacterCard from "@/components/CharacterCard.vue"
import axios from 'axios';

export default {
  name: 'FavoritesView',
  components: { AppNavbar, CharacterCard },
  data() {
    return {
      favorites: [],
      loading: false,
      filterFavoritesParams: {
        search: '',
        name: '',
        description: '',
        per_page: 20,
        page: 1,
      },
      totalPages: 1,
      inputPage: 1,
      showModal: false,
      favoriteToDelete: null, 
    }
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    async getFavorites(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/favorite`, {
          params: {
            search: this.filterFavoritesParams.search,
            name: this.filterFavoritesParams.name,
            description: this.filterFavoritesParams.description,
            per_page: this.filterFavoritesParams.per_page,
            page: page
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })

        if (!response.status) {
          console.error('Error al obtener favoritos:', response.message || 'Error al obtener favoritos')
          throw new Error('Error al obtener favoritos');
        }

        this.favorites = response.data.data || [];
        this.totalPages = response.data.meta?.last_page || 1;
        this.page = page;
        this.inputPage = page;
      } catch (error) {
        console.error('Error al obtener favoritos:', error)
      } finally {
        this.loading = false;
      }
    },

    goToPage() {
      if (this.inputPage >= 1 && this.inputPage <= this.totalPages) {
        this.getFavorites(this.inputPage)
      } else {
        // Resetea al valor actual si el input no es válido
        this.inputPage = this.page
      }
    },

    confirmDeleteFavorite(favorite) {
        this.favoriteToDelete = favorite.id;
        this.showModal = true;
    },


    async deleteFavorite() {
      if (!this.favoriteToDelete) return;

      try {
        await axios.delete(`/api/favorite/${this.favoriteToDelete}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          data: { api_id: this.favoriteToDelete }
        });
      
        this.favorites = this.favorites.filter(fav => fav.api_id !== this.favoriteToDelete);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Error al eliminar favorito');
      } finally {
        this.favoriteToDelete = null;
        this.showModal = false;
      }
    },

    cancelDelete() {
        this.favoriteToDelete = null;
        this.showModal = false;
    }
  },
  created() {
    this.getFavorites()
  }
}
</script>

<style scoped>
.favorites {
  padding: 20px;
  text-align: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.per-page-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #aaa;
  cursor: pointer;
  background-color: white;
  color: black;
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

.search-button {
  background: #3c3c3c;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.favorites-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.favorites-filters input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #aaa;
  width: 200px;
  max-width: 100%;
}

.loading,
.no-favorites {
  text-align: center;
  font-size: 18px;
  color: #ccc;
  width: 100%;
  margin: 40px 0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

/* Modal de confirmación */
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

.confirm-btn {
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

.characters-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin: 0 auto 20px;
  max-width: 1400px;
  padding: 0 20px;
}

/* Responsive adjustments */
@media (max-width: 1200px) { .characters-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 992px)  { .characters-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px)  { .characters-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .characters-grid { grid-template-columns: 1fr; } }


</style>