<template>
  <div>
    <LecturerCreate v-if='lecturer' :lecturer='lecturer' editing></LecturerCreate>
    <LoadingSpinner v-else></LoadingSpinner>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import LecturerCreate from "./LecturerCreate";
import LoadingSpinner from "../../components/LoadingSpinner.vue"
Vue.use(ButtonPlugin);
Vue.use(SpinnerPlugin);
export default {
  name: "LecturerUpdate",
  components: {
    LecturerCreate,
    LoadingSpinner
  },
  data() {
    return {
      lecturer: ""
    };
  },
  methods: {},
  mounted() {
    const app = this;
    let token = localStorage.getItem('token');

      axios
        .get("/api/lecturers/" + this.$route.params.id, {
          headers: { Authorization: "Bearer "+ token}
        })
        .then(response => {
          app.lecturer = response.data.data;
        })
        .catch(err => {
          console.log(err.response);
        });
  }
};
</script>