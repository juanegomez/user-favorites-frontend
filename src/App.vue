<template>
  <router-view/>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['getToken'])
  },
  created() {
    this.getToken()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}

html, body {
  background-color: #0D0D0D;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>
