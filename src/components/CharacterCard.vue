<template>
  <div class="character-card">
    <img :src="image" :alt="name" class="character-image">

    <div class="character-info">
      <h3 class="character-name">Nombre: {{ name }}</h3>
      <p class="character-species">Descripción: {{ species }}</p>

      <!-- Botón de corazón -->
      <button 
        class="favorite-button" 
        @click="handleFavoriteClick"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          width="36"
          height="28"
          :fill="isFavoriteLocal ? 'red' : 'none'"
          :stroke="isFavoriteLocal ? 'red' : 'white'"
          stroke-width="2"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M12 21C12 21 5 13.5 5 8.5C5 6.01472 7.01472 4 9.5 4C10.9887 4 12.3781 4.83207 13 6.08579C13.6219 4.83207 15.0113 4 16.5 4C18.9853 4 21 6.01472 21 8.5C21 13.5 14 21 14 21H12Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CharacterCard",
  props: {
    favoriteId: { type: Number, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    isFavorite: { type: Boolean, default: false }
  },
  data() {
    return {
      // Solo refleja favoritos confirmados
      isFavoriteLocal: this.isFavorite
    }
  },
  watch: {
    isFavorite: {
      immediate: true, // Para asegurar que se ejecute al montar el componente
      handler(newVal) {
        this.isFavoriteLocal = newVal;
      }
    }
  },
  methods: {
    handleFavoriteClick() {
      // Emitimos al padre para abrir el modal
      this.$emit('toggle-favorite', {
        id: this.favoriteId,
        name: this.name,
        image: this.image,
        species: this.species
      });
      // NO cambiamos isFavoriteLocal todavía
    }
  }
}
</script>

<style scoped>
.character-card {
  background: #2c2c2c;
  border-radius: 12px;
  padding: 15px;
  width: 220px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  transition: transform 0.2s ease;
  margin: 10px;
}

.character-card:hover {
  transform: scale(1.05);
}

.character-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
  height: 200px;
  object-fit: cover;
}

.character-name {
  font-size: 16px;
  margin: 5px 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.character-species {
  font-size: 14px;
  color: #aaa;
  margin: 5px 0 10px;
}

.favorite-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.favorite-button:focus {
  outline: none;
}
</style>
