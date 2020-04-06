<template>
  <div class="bg">
    <Navbar></Navbar>
    <b-container align-h="center">
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Navbar from './components/Navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
  },
  data() {
    return {

    }
  }
}
</script>

<style>
.b-container {
  margin: auto;
}

.page-title{
  padding-top: 20px;  
}

/* .bg {
  background-color: black;
} */
</style>
