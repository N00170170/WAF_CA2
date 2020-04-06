<template>
  <div>
    <b-row align-h="center page-title">
      <!-- <b-container fluid class="center"> -->
      <b-col md="6">
        <b-card class="cent">
          <b-card-title>
            <span v-if="!editing">Create</span>
            <span v-else>Update</span>
            Lecturer
          </b-card-title>
          <b-form>
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                type="text"
                class="form-control"
                name="name"
                required
                autocomplete="current-name"
                v-model="lecturer.name"
                @keydown.enter.native="login()"
              />
            </b-form-group>

            <b-form-group label="Address" label-for="address">
              <b-form-input
                id="address"
                type="text"
                class="form-control"
                name="address"
                required
                autocomplete="current-address"
                v-model="lecturer.address"
                @keydown.enter.native="login()"
              />
            </b-form-group>

            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                type="email"
                class="form-control"
                name="email"
                required
                autocomplete="current-email"
                v-model="lecturer.email"
                @keydown.enter.native="login()"
              />
            </b-form-group>

            <b-form-group label="Phone" label-for="phone">
              <b-form-input
                id="phone"
                type="text"
                class="form-control"
                name="phone"
                required
                autocomplete="current-phone"
                v-model="lecturer.phone"
                @keydown.enter.native="login()"
              />
            </b-form-group>

            <b-form-group label label-for="submit" class="mb-0">
              <b-button
                id="submit"
                v-on:click="submit()"
                v-if="!submitting"
                class="btn btn-success"
              >
                <span v-if="editing">Update</span>
                <span v-else>Create</span>
              </b-button>
              <b-button v-else class="btn btn-info">
                <b-spinner small label="Loading..."></b-spinner>
              </b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { FormPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  name: "LecturerCreate",
  components: {
    LoadingSpinner
  },
  props: {
    lecturer: {
      type: Object,
      default() {
        return {
          name: "",
          address: "",
          email: "",
          phone: ""
        };
      }
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: "",
      name: "",
      loaded: false,
      submitting: false
    };
  },
  mounted() {
    //check if we are editing a lecturer and set loading to true once it has retrieved the lecturer
    if (this.editing && this.lecturer) {
      this.loaded = true;
    } else {
      this.loaded = true;
    }
  },
  methods: {
    submit() {
      let app = this;
      let token = localStorage.getItem("token");
      app.submitting = true;
      if (app.editing) {
        axios
          .put("/api/lecturers/" + app.lecturer.id, app.lecturer, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(response => {
            this.$router.push("/lecturers");
          })
          .catch(err => {
            app.submitting = false;
          });
      } else {
        axios
          .post("/api/lecturers", app.lecturer, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(response => {
            this.$router.push("/lecturers");
          })
          .catch(err => {
            app.submitting = false;
          });
      }
    }
  }
  //   computed: {
  //     ...mapState({
  //       authLoading: state => state.auth.status === "loading"
  //     })
  //   }
};
</script>

<style>
.cent {
  margin: auto;
}
</style>
