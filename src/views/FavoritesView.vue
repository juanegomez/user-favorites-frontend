<template>
  <AppNavbar />
  <div class="favorites">
    <h1 class="home-title">Lista de Favoritos</h1>

    <!-- Filtros -->
    <div class="filters-container">
      <h3 class="filters-title">Filtros de Búsqueda</h3>
      <div class="filters">
        <div class="filter-group">
          <label class="filter-label">Búsqueda general</label>
          <input
            type="text"
            v-model="filterParams.search"
            placeholder="Buscar en todos los campos"
            @keyup.enter="getFavorites(1)"
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Nombre</label>
          <input
            type="text"
            v-model="filterParams.name"
            placeholder="Filtrar por nombre"
            @keyup.enter="getFavorites(1)"
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Descripción</label>
          <input
            type="text"
            v-model="filterParams.description"
            placeholder="Filtrar por descripción"
            @keyup.enter="getFavorites(1)"
            class="filter-input"
          />
        </div>
        
        <div class="filter-actions">
          <button @click="getFavorites(1)" class="search-button">
            <i class="fas fa-search"></i> Buscar
          </button>
          <button @click="resetFilters" class="reset-button">
            <i class="fas fa-undo"></i> Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay favoritos -->
    <div v-if="!loading && favorites.length === 0" class="no-favorites">
      <p>No tienes personajes favoritos aún.</p>
      <router-link to="/home" class="btn-primary">
        <i class="fas fa-arrow-right"></i> Ver personajes
      </router-link>
    </div>

    <!-- Contenedor de personajes -->
    <div v-else class="characters-grid">
      <CharacterCard
        v-for="character in favorites"
        :key="character.api_id"
        :image="character.image"
        :name="character.name"
        :species="character.description || 'Unknown'"
        :is-favorite="true"
        :favorite-id="character.api_id"
        @toggle-favorite="confirmDeleteFavorite"
      />
    </div>

    <!-- Paginación - Siempre visible -->
    <div class="pagination">
      <!-- Items por página -->
      <div class="per-page-selector">
        <span>Mostrar:</span>
        <select 
          v-model.number="filterParams.per_page" 
          @change="getFavorites(1)" 
          class="per-page-select"
        >
          <option v-for="n in [5, 10, 15, 20]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>

      <!-- Navegación de páginas -->
      <div class="page-navigation">
        <button 
          @click="getFavorites(currentPage - 1)" 
          :disabled="currentPage <= 1 || totalPages <= 1"
          class="pagination-button"
          :class="{ 'pagination-disabled': totalPages <= 1 }"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="page-info">
          Página 
          <input 
            type="number" 
            v-model.number="inputPage"
            @change="goToPage"
            :min="1"
            :max="totalPages"
            class="page-input"
            :class="{ 'pagination-disabled': totalPages <= 1 }"
            :disabled="totalPages <= 1"
          />
          de {{ totalPages }}
        </div>
        
        <button 
          @click="getFavorites(currentPage + 1)" 
          :disabled="currentPage >= totalPages || totalPages <= 1"
          class="pagination-button"
          :class="{ 'pagination-disabled': totalPages <= 1 }"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="total-items">
        {{ totalItems }} {{ totalItems === 1 ? 'favorito' : 'favoritos' }}
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para eliminar favorito -->
  <div v-if="showDeleteModal" class="modal-overlay">
    <div class="modal">
      <h3>Eliminar de favoritos</h3>
      <p>¿Estás seguro de que deseas eliminar a {{ selectedFavorite.name }} de tus favoritos?</p>
      
      <div class="modal-actions">
        <button @click="cancelDelete" class="btn btn-cancel">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button @click="deleteFavorite" class="btn btn-danger">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  </div>
  
  <!-- Loading overlay -->
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <p>Cargando favoritos...</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/config/axios';
import axios from 'axios';
import AppNavbar from '@/components/AppNavbar.vue';
import CharacterCard from '@/components/CharacterCard.vue';

export default {
  name: 'FavoritesView',
  components: {
    AppNavbar,
    CharacterCard
  },
  data() {
    return {
      favorites: [],
      loading: true,
      currentPage: 1,
      inputPage: 1,
      totalPages: 1,
      totalItems: 0,
      showDeleteModal: false,
      selectedFavorite: {
        id: null,
        name: ''
      },
      filterParams: {
        search: '',
        name: '',
        description: '',
        page: 1,
        per_page: 10
      }
    };
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    async getFavorites(page = 1) {
      if (!this.token) {
        this.$router.push('/');
        return;
      }

      this.loading = true;
      this.currentPage = page;
      this.filterParams.page = page;
      
      try {
        const response = await api.get('/favorite', {
          params: {
            search: this.filterParams.search || undefined,
            name: this.filterParams.name || undefined,
            description: this.filterParams.description || undefined,
            page: this.filterParams.page,
            per_page: this.filterParams.per_page
          },
          headers: { 
            Authorization: `Bearer ${this.token}` 
          }
        });
        
        this.favorites = response.data.data || [];
        this.totalItems = response.data.meta?.total || 0;
        this.totalPages = response.data.meta?.last_page || 1;
        this.inputPage = this.currentPage;
      } catch (error) {
        console.error('Error fetching favorites:', error);
        if (error.response?.status === 401) {
          this.$router.push('/');
        }
      } finally {
        this.loading = false;
      }
    },
    
    goToPage() {
      const page = Math.min(Math.max(1, parseInt(this.inputPage) || 1), this.totalPages);
      if (page !== this.currentPage) {
        this.getFavorites(page);
      } else {
        this.inputPage = page; // Reset if same page
      }
    },
    
    confirmDeleteFavorite(favorite) {
      this.selectedFavorite = {
        id: favorite.id,
        name: favorite.name
      };
      this.showDeleteModal = true;
    },
    
    cancelDelete() {
      this.showDeleteModal = false;
      this.selectedFavorite = {
        id: null,
        name: ''
      };
    },
    
    async deleteFavorite() {
      if (!this.selectedFavorite.id) return;
      
      try {
        // Usamos la instancia de api configurada que ya incluye los headers necesarios
        const response = await api({
          method: 'delete',
          url: `/favorite/${this.selectedFavorite.id}`,
          data: { api_id: this.selectedFavorite.id }
        });
        console.log('Respuesta de eliminación:', response.data);
        // Update UI without reloading all data
        this.favorites = this.favorites.filter(fav => fav.id !== this.selectedFavorite.id);
        this.totalItems--;
        
        // If last item on current page and not first page, go to previous page
        if (this.favorites.length === 0 && this.currentPage > 1) {
          this.getFavorites(this.currentPage - 1);
        } else {
          this.getFavorites(this.currentPage);
        }
        
        this.showDeleteModal = false;
      } catch (error) {
        console.error('Error deleting favorite:', error);
        alert('Error al eliminar el favorito');
      }
    },
    loadFavorites() {
      this.getFavorites(1);
    },
    
    resetFilters() {
      this.filterParams = {
        search: '',
        name: '',
        description: ''
      };
      this.getFavorites(1);
    },
  },
  
  created() {
    this.getFavorites(1);
  }
};
</script>

<style scoped>
.favorites {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  min-height: calc(100vh - 80px);
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.home-title {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2.2rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Filtros */
.filters-container {
  margin-bottom: 2rem;
  background: #2a2a2a;
  padding: 1.8rem;
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.filters-title {
  color: #42b4ca;
  margin-bottom: 1.2rem;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters-title:before {
  content: '\f0b0';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  font-size: 1rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end; /* Alinea los botones con los inputs */
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.85rem;
  color: #ccc;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.filter-input {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.filter-input:focus {
  outline: none;
  border-color: #42b4ca;
  box-shadow: 0 0 0 2px rgba(66,180,202,0.3), inset 0 2px 6px rgba(0,0,0,0.3);
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0;
  align-items: end; /* Alinea con inputs */
}

.search-button,
.reset-button {
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  height: fit-content;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.05);
}

.search-button {
  background: #42b4ca;
  color: white;
}

.search-button:hover {
  background: #3694a8;
  transform: translateY(-2px);
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3), -2px -2px 6px rgba(255,255,255,0.05);
}

.reset-button {
  background: #6c757d;
  color: white;
}

.reset-button:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3), -2px -2px 6px rgba(255,255,255,0.05);
}

/* No favorites */
.no-favorites {
  text-align: center;
  padding: 3rem 1rem;
  background: #2a2a2a;
  border-radius: 16px;
  margin: 2rem 0;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}

.no-favorites p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #ddd;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #42b4ca;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.05);
}

.btn-primary:hover {
  background: #3694a8;
  transform: translateY(-2px);
}

/* Characters Grid */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1rem 1.2rem;
  background: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #ddd;
}

.per-page-select {
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: white;
  cursor: pointer;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-button {
  background: #2c2c2c;
  color: white;
  border: 1px solid #444;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 8px rgba(0,0,0,0.3), -4px -4px 8px rgba(255,255,255,0.05);
}

.pagination-button:not(:disabled):hover {
  background: #3d3d3d;
  border-color: #42b4ca;
  color: #42b4ca;
}

.pagination-button:disabled,
.pagination-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ddd;
  font-size: 0.95rem;
}

.page-input {
  width: 60px;
  padding: 0.45rem 0.5rem;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: white;
}

.page-input:focus {
  outline: none;
  border-color: #42b4ca;
  box-shadow: 0 0 0 2px rgba(66,180,202,0.3);
}

.total-items {
  color: #aaa;
  font-size: 0.9rem;
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 16px;
  max-width: 90%;
  width: 450px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.modal h3 {
  color: #ff6b6b;
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
  flex-wrap: wrap;
}

.btn {
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  gap: 1rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: #42b4ca;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 992px) {
  .filters { grid-template-columns: 1fr; }
  .filter-actions { flex-direction: row; justify-content: start; }
  .search-button, .reset-button { width: auto; }
  .pagination { flex-direction: column; gap: 1rem; text-align: center; }
}

@media (max-width: 768px) {
  .characters-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .modal { width: 95%; padding: 1.5rem; }
  .modal-actions { flex-direction: column; gap: 0.5rem; }
}

@media (max-width: 480px) {
  .favorites { padding: 1rem 0.75rem; }
  .characters-grid { grid-template-columns: 1fr; gap: 1rem; margin: 1rem 0; }
  .page-navigation { flex-direction: column; gap: 0.75rem; }
  .page-info { flex-direction: column; width: 100%; text-align: center; }
  .btn-primary { width: 100%; justify-content: center; }
  .no-favorites { padding: 2rem 1rem; margin: 1rem 0; }
  h1 { font-size: 1.6rem; margin-bottom: 1.25rem; }
}
</style>
