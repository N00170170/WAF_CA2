<template>
  <div>
    <!-- Using CourseCreate as component -->
    <CourseCreate v-if="course" :course="course" editing></CourseCreate>
    <LoadingSpinner v-else></LoadingSpinner>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import CourseCreate from "./CourseCreate";
import LoadingSpinner from "../../components/LoadingSpinner.vue";
Vue.use(ButtonPlugin);
Vue.use(SpinnerPlugin);
export default {
  name: "CourseUpdate",
  components: {
    CourseCreate,
    LoadingSpinner
  },
  data() {
    return {
      course: ""
    };
  },
  methods: {},
  mounted() {
    const app = this;
    let token = localStorage.getItem("token");

    axios
      .get("/api/courses/" + this.$route.params.id, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(response => {
        app.course = response.data.data;
      })
      .catch(err => {
        console.log(err.response);
      });
  }
};
</script>