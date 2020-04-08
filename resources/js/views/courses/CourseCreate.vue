<template>
  <div>
    <b-row align-h="center page-title">
      <b-col md="6">
        <b-card class="center-page">
          <b-card-title>
            <span v-if="!editing">Create</span>
            <span v-else>Update</span>
            Course
            <router-link :to="`/courses`">
              <b-button class="float-right btn btn-primary">
                <b-icon icon="reply-fill" style="transform: scaleX(-1)"></b-icon>Back
              </b-button>
            </router-link>
          </b-card-title>
          <b-form>
            <b-form-group label="Title" label-for="title">
              <b-form-input
                id="title"
                type="text"
                class="form-control"
                name="title"
                required
                autocomplete="current-title"
                v-model="course.title"
                placeholder="Enter title"
              />
            </b-form-group>

            <b-form-group label="Code" label-for="code">
              <b-form-input
                id="code"
                type="text"
                class="form-control"
                name="code"
                required
                autocomplete="current-code"
                v-model="course.code"
                placeholder="Enter code"
              />
            </b-form-group>

            <b-form-group label="Description" label-for="description">
              <b-form-textarea
                id="description"
                class="form-control"
                name="description"
                required
                autocomplete="current-description"
                v-model="course.description"
                placeholder="Enter description"
                rows="4"
              ></b-form-textarea>
            </b-form-group>

            <b-row>
              <b-col sm="6">
                <b-form-group label="Points" label-for="points">
                  <b-form-input
                    id="points"
                    type="text"
                    class="form-control"
                    name="points"
                    required
                    autocomplete="current-points"
                    v-model="course.points"
                    placeholder="Enter points"
                  />
                </b-form-group>
              </b-col>

              <b-col sm="6">
                <b-form-group label="Level" label-for="level">
                  <b-form-input
                    id="level"
                    type="text"
                    class="form-control"
                    name="level"
                    required
                    autocomplete="current-level"
                    v-model="course.level"
                    placeholder="Enter level"
                  />
                </b-form-group>
              </b-col>
            </b-row>

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
  name: "CourseCreate",
  components: {
    LoadingSpinner
  },
  props: {
    course: {
      type: Object,
      default() {
        return {
          title: "",
          code: "",
          description: "",
          points: "",
          level: ""
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
    //check if we are editing a course and set loading to true once it has retrieved the course
    if (this.editing && this.course) {
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
          .put("/api/courses/" + app.course.id, app.course, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(response => {
            this.$router.push("/courses");
          })
          .catch(err => {
            app.submitting = false;
          });
      } else {
        axios
          .post("/api/courses", app.course, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(response => {
            this.$router.push("/courses");
          })
          .catch(err => {
            app.submitting = false;
          });
      }
    }
  }};
</script>

<style>
</style>
