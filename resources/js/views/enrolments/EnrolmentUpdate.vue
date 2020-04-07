<template>
  <div>
    <EnrolmentCreate v-if='enrolment' :enrolment='enrolment' editing></EnrolmentCreate>
    <LoadingSpinner v-else></LoadingSpinner>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import EnrolmentCreate from "./EnrolmentCreate";
import LoadingSpinner from "../../components/LoadingSpinner.vue"
Vue.use(ButtonPlugin);
Vue.use(SpinnerPlugin);
export default {
  name: "EnrolmentUpdate",
  components: {
    EnrolmentCreate,
    LoadingSpinner
  },
  data() {
    return {
      enrolment: ""
    };
  },
  methods: {},
  mounted() {
    const app = this;
    let token = localStorage.getItem('token');

      axios
        .get("/api/enrolments/" + this.$route.params.id, {
          headers: { Authorization: "Bearer "+ token}
        })
        .then(response => {
          app.enrolment = response.data.data;
        })
        .catch(err => {
          console.log(err.response);
        });
  }
};
</script>