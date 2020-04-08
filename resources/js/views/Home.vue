<template>
  <div class="page-title">
    <b-jumbotron>
      <template v-slot:header>College App</template>

      <template v-slot:lead>
          College management made easy.
      </template>

      <hr class="my-4" />

      <p>
        Manage an entire college with our full college management suite. Keep track of courses, lecturers and enrolments with a simple and easy to use system.
      </p>

      <b-button variant="primary" to="/register">Register</b-button>
      <b-button variant="success" to="/login">Login</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { FormPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style>
body, html{
  height: 100% !important;
  
}
</style>
